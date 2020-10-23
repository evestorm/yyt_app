<!--作者:覃彬-->
<template>
	<view class="new-campaign bg-white p-3">
		<navigator url="/pages/mySub/downLoadQR/downLoadQR" hover-class="none" open-type="navigate" class="top-title d-flex a-center j-sb mb-1">
			<view class=""><slot></slot></view>
			<view class="d-flex a-center">
				<text class="mr-1">查看所有</text>
				<text class="iconfont icon-jiantou02 font-24 color-9a"></text>
			</view>
		</navigator>
		<!-- 活动列表 -->
		<view class="camp-list">
			<view class="camp-item py-3 px-2 d-flex a-center j-sb" v-for="(item, index) in calcCampaignData" :key="item.content">
				<view class=" remake">
					<view class="font-28 color-44">{{ item.setName }}</view>
					<view class="font-26 mt-2 ellips-1">{{ item.remake }}</view>
				</view>
				<view class="btn text-white bg-primary font-26 text-center" @tap="shareQr(item)">分享</view>
			</view>
		</view>
		<!--二维码图片分享-->
		<yyt-qr-share-img ref="QRpopup" :imgUrl="imgUrl"></yyt-qr-share-img>
	</view>
</template>

<script>
export { default } from './new-campaign.js';
</script>

<style lang="less" scoped>
@import url('new-campaign.less');
</style>
