<template>
	<view id="customer-source">
		<form>
			<!-- 文本域 -->
			<view class="cu-form-group margin-top textarea-wrapper">
				<textarea
					class="textarea"
					:maxlength=maxTextLength
					:disabled="note==null"
					@input="textareaInput"
					placeholder="请填写客户来源"
					:style="{height: '8em'}"
					v-model="note">
				</textarea>
				<span class="tip" :class="{'warning': note.length >= maxTextLength}">{{showCurNumber}}</span>
			</view>
			<!-- 快捷备注 -->
			<yyt-tag-panel title="快捷备注" :tagList="tagList"
				@tap-tag="addToNoteFromTag"
				@add-new-tag="addNewTag"
				@delete-tag="deleteTag"
				tagFieldStr="bizOptionName"></yyt-tag-panel>
		</form>
		<!-- 确认按钮 -->
		<view class="padding flex flex-direction confirm-btn">
			<button @tap="tapConfirmBtn" class="cu-btn block bg-blue margin-tb-sm lg" type="" :disabled="note.length === 0">确定</button>
		</view>
	</view>
</template>

<script>
	import { mapState, mapMutations } from 'vuex';
	import FWBizOption from '@/service/FW/FWBizOptionAppService.js';

	export default {
		data() {
			return {
				note: '', // 客户来源内容
				maxTextLength: 200, // 最长备注字数
				tagList: [], // 快捷备注标签列表
				storeID: '' // 门店ID
			};
		},
		computed: {
			...mapState(['todayChance']),
			showCurNumber() {
				return this.note.length + '/' + this.maxTextLength;
			}
		},
		onShow() {
			this.note = this.todayChance.customerSource || '';
		},
		async onLoad() {
			this.storeID = this.$storage.getAppUserInfo().currentStoreId;
			const data = {
				"order": "OrderCode  desc",
				"viewName": "view_FW_BizOption",
				"filter": "{\"Type\":\"and\",\"conditions\":[{\"Attribute\":\"buUnitGUID\",\"Datatype\":\"nvarchar\",\"Operatoer\":\"eq\",\"Value\":\"" + this.storeID + "\"},{\"Attribute\":\"bizParamCode\",\"Datatype\":\"nvarchar\",\"Operatoer\":\"eq\",\"Value\":\"CstFromSource\"}]}",
				"page": 1,
				"rows": 20,
				"select": "id,BizOptionName"
			};
			let result=await FWBizOption.GetGridDto(data);
				// console.log(result);
				this.tagList = result.rows;
			
		},
		components: {
		},
		methods: {
			...mapMutations(['setTodayChance']),
			// 文本域内容改变时触发
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
			// 给当前门店添加新的客户来源标签
			async addNewTag(tagName) {
				console.log("给当前门店添加新的客户来源标签", tagName);
				const data = {
					bizOptionName: tagName,
					bizParamCode: "CstFromSource",
					storeId: this.storeID
				}
				
				let result=await FWBizOption.CreateDictOption(data);
				if(!result)
				{
					uni.showToast({
						title: '添加失败，请稍后重试...',
						icon: 'none'
					});
					return false;
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
				console.log("删除当前门店一个客户来源标签", tagObj);
				
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
				const todayChance = this.todayChance;
				todayChance.customerSource = this.note;
				this.setTodayChance(todayChance);
				uni.navigateBack({
					delta: 1,
				});
			}
		},
	}
</script>

<style lang="less" scoped>
@import url('customerSource.less');
</style>
