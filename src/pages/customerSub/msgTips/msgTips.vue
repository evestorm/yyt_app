<template>
	<view class="tips">
		<view class="tips-sec">
			<view class="tips-title" v-show="sendState == 1">短信发送中......</view>
			<!-- <view class="tips-title" v-show="sendState == 1">{{textMsg}}</view> -->
			<!-- 短信发送中...... -->
			<view class="tips-title" v-show="sendState == 2">发送完成</view>
			<!-- 短信发送中 -->
			<view class="" v-show="sendState == 1">
				<view class="tip-proress">
					<progress class="proress-top" :percent="percent" border-radius="5" activeColor="#0183ff" stroke-width="10" />
					<text class="tip-now" :style="{ left: styleLeft }">{{ num }}</text>
					<text class="tip-all">{{ customerList.length }}</text>
				</view>
				<!-- <view class="state">
					<text class="now">正在发送给：</text>
					<text class="now-name">{{ sendName }}</text>
				</view> -->
				<!-- 短信发送状态列表 -->
				<scroll-view scroll-y="true" class="send-msg-list">
					<view class="send-item" v-for="(item, index) in customerList" :key="index">
						<text class="send-text" v-show="item.resType == 0">{{ item.customerName}}：等待发送中...</text>
						<view class="" v-show="item.resType == 1">
							<image class="send-img" :src="picDomain + '/upload/yytApp/customer/send-suc.png'" mode=""></image>
							<text class="send-text">成功：发送给</text>
							<text class="send-name">{{ item.customerName }}</text>
						</view>
						<view class="" v-show="item.resType != 0 && item.resType != 1">
							<image class="send-img" :src="picDomain + '/upload/yytApp/customer/send-err.png'" mode=""></image>
							<text class="send-text">失败：发送给</text>
							<text class="send-name">{{ item.customerName }}</text>
						</view>
					</view>
				</scroll-view>
				<view class="tip-scroll" v-show="customerList.length > 10">上下滑动查看其他发送状态</view>
			</view>
			<!-- 发送完成后 -->
			<view class="send-after" v-show="sendState == 2">
				<!-- 成功 -->
				<view class="send-suc">
					<view class="suc-title">
						<image class="send-img" :src="picDomain + '/upload/yytApp/customer/send-suc.png'" mode=""></image>
						<text class="">发送成功</text>
						<text class="blue-title">{{ sucName.length }}</text>
						<text class="">个</text>
					</view>
					<scroll-view scroll-y="true" class="suc-content">{{ sucName.toString() }}</scroll-view>
				</view>
				<!-- 失败 -->
				<view class="send-suc">
					<view class="suc-title">
						<image class="send-img" :src="picDomain + '/upload/yytApp/customer/send-err.png'" mode=""></image>
						<text class="">发送失败</text>
						<text class="red-title">{{ errName.length }}</text>
						<text class="">个</text>
					</view>
					<scroll-view scroll-y="true" class="suc-content">{{ errName.toString() }}</scroll-view>
				</view>
				<view class="suc-btn" @tap="sucSendMsg">完成</view>
				<!-- <view class="tip-scroll">上下滑动查看其他发送状态</view> -->
			</view>
		</view>

		<!-- 底部logo -->
		<view class="logoPic"><image src="https://pic.cwyyt.cn/upload/yyticons/0952195219_logo.png" class="bot-logo"></image></view>
	</view>
</template>

<script>
export { default } from './msgTips.js';
</script>

<style lang="less" scoped>
@import url('msgTips.less');
</style>
