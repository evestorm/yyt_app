<template>
	<!-- 逻辑： 默认显示添加按钮，可以添加标签。点击编辑后不能添加标签，只能删除标签 -->
	<view class="yyt-tag-panel">
		<!-- 工具栏 -->
		<view class="tools-wrapper">
			<view class="tools-title">{{title}}</view>
			<view @tap="triggerEdit" class="tools-edit text-right">{{isEdit ? '保存' : '编辑'}}</view>
		</view>
		<!-- 标签展示区域 -->
		<view class="tag-wrapper van-clearfix" :style="{ maxHeight: parseInt(maxHeight) + 'px' }">
			<view class="tag-view"
				v-for="(tag, index) in tagList"
				:key="index"
				@tap="tapTag(index)">
				<view v-if="isEdit" class="cuIcon cuIcon-roundclose tag-delete text-white"></view>
				<view v-if="isEdit" @tap="deleteTag(index)" class="cuIcon cuIcon-roundclosefill tag-delete text-red"></view>
				<uni-tag
					:text="tag[tagFieldStr]" type="primary" />
			</view>
			<!-- 点击添加按钮显示弹窗 -->
			<view class="tag-view">
				<text @tap="showModal" v-if="!isEdit" class='cuIcon cuIcon-add tag-add'></text>
			</view>
			<!-- 添加tag的弹窗modal -->
			<yyt-neil-modal
				:show="isShowModal"
				@cancel="closeModal"
				@confirm="addNewTag"
				:auto-close="false"
				title="添加标签" confirm-text="确定" cancel-text="取消">
				<view class="cu-form-group">
					<view class="title">标签名</view>
					<input placeholder="请填写标签名" name="input" v-model="newTagName"></input>
			    </view>
			</yyt-neil-modal>
		</view>
	</view>
</template>

<script>
	import uniTag from '@/components/uni-tag/uni-tag.vue';
	export default {
		name: 'yyt-tag-panel',
		props: {
			// 标题
			title: {
				type: String,
				default: ''
			},
			// 标签列表
			tagList: {
				type: Array,
				default() {
					return []
				}
			},
			tagFieldStr: {
				type: String,
				default: 'bizOptionName'
			},
			// 标签列表最大高度（为了避免太高导致遮盖父页面其他元素）
			maxHeight: {
				type: Number,
				default: 300
			}
		},
		components: {
			uniTag,
		},
		data() {
			return {
				isEdit: false, // 是否在编辑状态（默认非编辑状态）
				isShowModal: false, // 是否显示弹窗（默认不显示）
				newTagName: '', // 用户新增tag
			};
		},
		methods: {
			// 触发编辑
			triggerEdit() {
				this.isEdit = !this.isEdit;
			},
			// 点击了标签
			tapTag(index) {
				if (!this.isEdit) {
					this.$emit('tap-tag', this.tagList[index]);
				}
			},
			// 删除标签
			deleteTag(index) {
				this.$emit('delete-tag', this.tagList[index]);
			},
			// 显示弹窗
			showModal() {
				this.isShowModal = true;
			},
			// 添加标签按钮被点击
			addNewTag() {
				if (this.newTagName === '') {
					uni.showToast({
						title: '标签名为空，添加失败！',
						icon: 'none',
						duration: 1000
					});
					this.isShowModal = false;
					return;
				}
				this.$emit('add-new-tag', this.newTagName);
				this.newTagName = '';
				// console.log("已确认添加标签");
				// 关闭弹窗
				this.isShowModal = false;
			},
			// 关闭弹窗
			closeModal() {
				this.isShowModal = false;
				// console.log('关闭了弹窗');
			}
		}
	}
</script>

<style lang="less" scoped>
@import url('yyt-tag-panel.less');
</style>
