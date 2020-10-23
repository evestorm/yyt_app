<template>
	<view id="chance-note">
		<!-- <view class="back-icon" v-if="fromWhere == 'CstListRemark'" @tap="hideIframe"></view> -->
		<form>
			<!-- 文本域 -->
			<view class="cu-form-group margin-top textarea-wrapper">
				<textarea
					class="textarea"
					:maxlength=maxTextLength
					:disabled="note==null"
					@input="textareaInput"
					placeholder="请填写机会备注"
					:style="{height: '8em'}"
					v-model="note">
				</textarea>
				<span class="tip" :class="{'warning': note.length >= maxTextLength}">{{showCurNumber}}</span>
			</view>
			<!-- 快捷备注 -->
			<view class="quick-note-wrapper">
				<yyt-tag-panel title="快捷备注" :tagList="tagList"
					@tap-tag="addToNoteFromTag"
					@add-new-tag="addNewTag"
					@delete-tag="deleteTag"
					tagFieldStr="bizOptionName"></yyt-tag-panel>
			</view>
		</form>
		<!-- 确认按钮 -->
		<view class="padding flex flex-direction confirm-btn">
			<button @tap="tapConfirmBtn" class="cu-btn block bg-blue margin-tb-sm lg" type="" :disabled="note.length === 0">确定</button>
		</view>
	</view>
</template>

<script>
	import uniIcon from "@/components/uni-icon/uni-icon.vue";
	import { mapState, mapMutations } from 'vuex';
	import FWBizOption from '@/service/FW/FWBizOptionAppService.js';
	export default {
		// 目前就两种来源
		// 		今日预订：ChanceRemark
		// 		移入跟踪：CstListRemark
		data() {
			return {
				note: '', // 机会备注内容
				maxTextLength: 200, // 最长备注字数
				tagList: [], // 快捷备注标签列表
				storeID: '', // 门店id
				fromWhere: ''
			};
		},
		computed: {
			...mapState(['todayChance', 'cstListRemark']),
			showCurNumber() {
				return this.note.length + '/' + this.maxTextLength;
			}
		},
		components: {
			uniIcon
		},
		onShow() {
			var note = this.fromWhere == 'CstListRemark' ? 
				this.cstListRemark.chanceNote :
				this.todayChance.chanceNote;
			this.note = note || '';
		},
		onLoad(options) {
			this.storeID = this.$storage.getAppUserInfo().currentStoreId;
			this.fromWhere = options.fromWhere ? options.fromWhere : 'ChanceRemark';
			this.getRemark(this.fromWhere);
		},
		methods: {
			...mapMutations(['setTodayChance', 'setCstListRemark']),
			// 文本域内容改变时触发
			async getRemark(typeName) {
				const data = {
					"order": "OrderCode  desc",
					"viewName": "view_FW_BizOption",
					"filter": "{\"Type\":\"and\",\"conditions\":[{\"Attribute\":\"buUnitGUID\",\"Datatype\":\"nvarchar\",\"Operatoer\":\"eq\",\"Value\":\"" + this.storeID + "\"},{\"Attribute\":\"bizParamCode\",\"Datatype\":\"nvarchar\",\"Operatoer\":\"eq\",\"Value\":\""+ typeName +"\"}]}",
					"page": 1,
					"rows": 20,
					"select": "id,BizOptionName"
				};
				let result=await FWBizOption.GetGridDto(data);
					// console.log(result);
					this.tagList = result.rows;
			
			},
			textareaInput(e) {
				this.note = e.detail.value;
			},
			// 添加标签到备注
			addToNoteFromTag(tagObj) {
				console.log("添加标签到备注", tagObj);
				// this.note += tagObj.bizOptionName + ', ';
				if (this.note.length === 0) {
					this.note += tagObj.bizOptionName;
				} else {
					this.note += ', ' + tagObj.bizOptionName;
				}
			},
			// 给当前门店添加新的机会备注标签
			async addNewTag(tagName) {
				console.log("给当前门店添加新的机会备注标签", tagName);
				const data = {
					bizOptionName: tagName,
					bizParamCode: this.fromWhere,
					storeId: this.storeID
				}
				
				let result=await FWBizOption.CreateDictOption(data);
				if(!result)
				{
					uni.showToast({
						title: '添加失败，请稍后重试...',
						icon: 'none'
					});
					return flase;
				}
					// console.log(result);
					this.tagList = this.tagList.concat({
						id: result.id,
						bizOptionName: tagName
					})
					uni.showToast({
						title: '添加成功！'
					});
				
				
			},
			// 删除当前门店一个机会备注标签
			async deleteTag(tagObj) {
				console.log("删除当前门店一个机会备注标签", tagObj);
				
				let result=await FWBizOption.DeleteByDto({id: tagObj.id});
				if(!result)
				{
					uni.showToast({
						title: '删除失败，请稍后重试...',
						icon: 'none'
					});
					return false;
				}
					// console.log(result);
					this.tagList = this.tagList.filter(v => v.id !== tagObj.id);
					uni.showToast({
						title: '删除成功！'
					});
					
				
			},
			// 页面底部确认按钮
			tapConfirmBtn() {
				switch(this.fromWhere) {
					case 'ChanceRemark':
						const todayChance = this.todayChance;
						todayChance.chanceNote = this.note;
						this.setTodayChance(todayChance);
						uni.navigateBack({
							delta: 1,
						});
					break;
					case 'CstListRemark':
						// 删除父级页面的iframe
						// parent.vmDivItem5.hideRemarkIframe(this.note);
						uni.$emit('chanceNoteToCustomList', this.note);
						this.setCstListRemark({
							chanceNote: this.note
						});
						uni.navigateBack({
							delta: 1,
						});
					break;
				}
			}
		},
	}
</script>

<style lang="less" scoped>
@import url('chanceNote.less');
</style>
