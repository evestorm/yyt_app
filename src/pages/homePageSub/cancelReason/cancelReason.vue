<template>
	<view id="cancel-reason">
		<!-- 文本域 -->
		<view class="cu-form-group cu-list cu-card article textarea-wrapper">
			<textarea
				class="textarea cu-item"
				:maxlength="maxTextLength"
				:disabled="reason == null"
				@input="textareaInput"
				placeholder="输入订单取消原因"
				:style="{ height: '8em' }"
				v-model="reason"
			></textarea>
			<span class="tip" :class="{ warning: reason.length >= maxTextLength }">{{ showCurNumber }}</span>
		</view>
		<!-- 快捷备注 -->
		<view class="quick-note-wrapper">
			<yyt-tag-panel
				title="快捷备注"
				:tagList="quickSelectList"
				@tap-tag="addToNoteFromTag"
				@add-new-tag="addNewTag"
				@delete-tag="deleteTag"
				tagFieldStr="tagContent"
			></yyt-tag-panel>
		</view>
		<!-- 确认按钮 -->
		<view class="padding flex flex-direction confirm-btn">
			<button @tap="tapConfirmBtn" class="cu-btn block bg-blue margin-tb-sm lg" type="" :disabled="reason.length === 0">确定</button>
		</view>
	</view>
</template>

<script>
import CY63 from '@/service/CY/CY63AppService.js';
import CY20 from '@/service/CY/CY20AppService.js';
export default {
	data() {
		return {
			quickSelectList: [], // 快捷备注数组
			reason: '', // 文本框文字
			maxTextLength: 50, // 最长备注字数
			bookID: '', // 订单ID
		};
	},
	computed: {
		showCurNumber() {
			return this.reason.length + '/' + this.maxTextLength;
		}
	},
	async onLoad(payload) {
		// 获取订单id
		this.bookID = payload.bookID;
		this.getLabelFilter(); //获取快捷标签
	},
	methods: {
		// 文本域内容改变时触发
		textareaInput(e) {
			this.reason = e.detail.value;
		},
		// ----------------------------快捷标签相关操作--------------------------
		addToNoteFromTag(obj) {
			//点击标签
			if (this.reason.length == 0) {
				this.reason += obj.tagContent;
			} else if(this.reason.length<this.maxTextLength) {
				this.reason += '，' + obj.tagContent;
			}
			this.reason =this.reason.substring(0,this.maxTextLength);
		},
		addNewTag(str) {
			//添加新标签
			this.createByDto(str, res => {
				let obj = {
					tagContent: res.tagContent,
					tagID: res.id,
					tagType: 1
				};
				this.quickSelectList.unshift(obj);
			});
		},
		deleteTag(obj) {
			//删除标签
			this.deleteByDto(obj.tagID, res => {
				if (res) {
					this.quickSelectList = this._.reject(this.quickSelectList, { tagID: obj.tagID });
				}
			});
		},
		async getLabelFilter() {
			//获取取消快捷备注列表
			const data = {
				storeId: this.$storage.getAppUserInfo().currentStoreId,
				tagType: 1,
				pageIndex: 1,
				pageSize: 10
			};
			// 获取取消原因
			let result = await CY63.GetLabelFilter(data);
			if (result) {
				this.quickSelectList = result.result.dataList;
			}
		},
		async createByDto(str, cb) {
			//新增快捷标签
			let data = {
				storeId: this.$storage.getAppUserInfo().currentStoreId,
				tagContent: str,
				tagType: 1
			};
			let res = await CY63.CreateByDto(data);
			cb && cb(res);
		},
		async deleteByDto(id, cb) {
			//删除快捷标签
			let data = {
				id: id
			};
			let res = await CY63.DeleteByDto(data);
			cb && cb(res);
		},
		// 确认取消
		async tapConfirmBtn() {
			const data = {
				id: this.bookID, // 订单主键
				status: 5,
				reason: this.reason, // 取消原因
				abolishTime: this.$cw.pikerGetDate() + ' 00:00:00', // 取消时间
				cancellerID: this.$storage.getAppUserInfo().id // 当前登录用户id
			};
			let result = await CY20.UpdateByDto(data);
			uni.reLaunch({
					url: '/pages/homePageSub/reserve/reserve'
			});
		}
	}
};
</script>

<style lang="less" scoped>
@import url('cancelReason.less');
</style>
