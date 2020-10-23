<!--作者:覃彬 二维码图片分享-->
<template>
	<view class="yyt-qr-share-img" @touchmove.prevent @tap="isOpen = false" v-show="isOpen">
		<view class="position-fixed top-0 left-0 qr-bg d-flex flex-column a-center">
			<!-- 图片 -->
			<image @tap.stop class="img" :src="imgUrl" mode="aspectFit"></image>
			<!-- 按钮区域 -->
			<view class="w-100 d-flex a-center j-sa flex-wrap flex-1">
				<view class="item text-white bg-primary mb-2" @tap.stop="downLoadR">下载图片</view>
				<view class="item text-white bg-primary mb-2" @tap.stop="sendWXImg">分享至微信好友</view>
			</view>
		</view>
	</view>
</template>

<script>
export { default } from './yyt-qr-share-img.js';
</script>

<style lang="less" scoped>
@import url('yyt-qr-share-img.less');
</style>
