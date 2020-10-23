<!--作者:覃彬-->
<template>
    <view class="my-card bg-white p-3 mt-2">
		<slot></slot>
		<view class="d-flex a-center j-sb">
			<view class="d-flex flex-wrap a-center">
				<text class="font-28 mr-1 ">{{$storage.getAppUserInfo().userName}}</text>
				<text class="font-28 mr-1 ">{{$storage.getAppUserInfo().phone}}</text>
				<text class="font-28 mr-1 ">{{$storage.getAppUserInfo().businessName}}客户经理</text>
			</view>
			<view class="btn text-white bg-primary font-26 text-center" @tap="share">分享</view>
		</view>
	</view>
</template>

<script>
    export { default } from './my-card.js';
</script>

<style lang="less" scoped>
    @import url('my-card.less');
</style>
