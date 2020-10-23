<template>
	<view id="myModal" class="modal">
		<!-- 弹窗内容 -->
		<view class="modal-content">
			<view class="modal-content_message_title">
				<view class="modal-content_message_title_tip"><slot name="title">标题</slot></view>
				<slot name="close">操作按钮</slot>
			</view>
			<view class="modal-content_message_Info"><slot name="content">内容</slot></view>
			<view class="sendMessageInfo"><slot name="footer"></slot></view>
		</view>
	</view>
</template>

<script>
export default {
	name: 'yyt-short',
	props: {
		title: String,
		close: String,
		content: String,
		footer: String
	}
};
</script>

<style lang="less" scoped>
//弹窗样式
.modal {
	position: fixed;
	z-index: 999;
	top: 0;
	right: 0;
	bottom: 0;
	left: 0;
	width: 100%;
	height: 100%;
	overflow: auto;
	background-color: rgba(0, 0, 0, 0.4);
	transition: opacity 0.3s ease;
	.modal-content {
		width: 100%;
		position: absolute;
		left: 50% !important;
		top: 50% !important;
		transform: translate(-50%, -50%);
		display: flex;
		flex-direction: column;
		z-index: 6;
		background-color: #fff;
		width: 670rpx;
		height: auto;
		/* height: 6.89rem; */
		// border: 1rpx solid #e8e8e8;
		padding: 0 30rpx 0 30rpx;
		border-radius: 20rpx;
		box-sizing: border-box;
		transition: all 0.3s ease;
		.modal-content_message_title {
			width: 100%;
			height: 100rpx;
			line-height: 100rpx;
			display: flex;
			justify-content: center;
			color: #0d0d0d;
			font-size: 32rpx;
			font-weight: bold;
			// border-bottom: solid 1rpx #e8e8e8;
			.modal-content_message_title_tip {
				line-height: 100rpx;
			}
		}
		.modal-content_message_Info {
			width: 100%;
		}
	}
}
</style>
