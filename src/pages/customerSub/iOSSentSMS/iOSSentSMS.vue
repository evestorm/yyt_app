<!--作者:杨亮-->
<template>
	<view class="iOSSentSMS">
		<scroll-view scroll-y="true" class="scroll-view-wrapper">
			<block v-for="(item, idx) in smsList" :key="item.phone"><sms-item :item="item" @onClick="onClick" :androidAllState="androidAllState"></sms-item></block>
		</scroll-view>
		<uni-popup ref="cancelPopup" type="center" class="tip-popup" :custom="true">
			<view class="wrapper">
				<view class="popup-top">
					<text>提示</text>
					<image class="popup-top-img" src="/static/banquet/quxiao.png" mode="" @click="cancel()"></image>
				</view>
				<!-- popup中部 -->
				<view class="popup-mid">
					<image class="popup-mid-img" src="/static/banquet/error.png" mode=""></image>
					<text>您还有短信未发送完毕，确定要退出吗？</text>
				</view>
				<view class="popup-bot">
					<view class="cancel" @click="cancel()">取消</view>
					<view class="confirm" @click="confirm()">确定</view>
				</view>
			</view>
		</uni-popup>
	</view>
</template>

<script src="./iOSSentSMS.js"></script>

<style lang="less" scoped>
@import url('iOSSentSMS.less');
</style>
