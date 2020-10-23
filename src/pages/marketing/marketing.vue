<!--作者:覃彬-->
<template>
	<view class="marketing p-3">
		<!-- 导航栏 -->
		<z-nav-bar class="z-nav-bar" :title="'营销中心'" :back="false" bgColor="#0782ff" fontColor="#FFF">
			<!-- 查看报表按钮 -->
			<navigator url="/pages/_common/statList/statList" hover-class="none" open-type="navigate" class="left-selector" slot="left">
				<text class="icon iconfont icon-tongji" style="font-size: 24rpx;"></text>
			</navigator>
			<!-- 卡券核销 -->
			<navigator url="/pages/marketingSub/couponVerification/couponVerification" hover-class="none" open-type="navigate" class="right-selector" slot="right">
				<text class="icon iconfont icon-kaquanhexiao" style="font-size: 24rpx;"></text>
				<text class="yyt-margin-left-small">卡券核销</text>
			</navigator>
		</z-nav-bar>
		<!--顶部汇总数据-->
		<top-sumdata :sumData="topSumData"><yyt-switch-all-btn @change="isGetAll"></yyt-switch-all-btn></top-sumdata>
		<!--近期活动-->
		<new-campaign class="mt-2" :campaignData="campaignData"><view class="card-title">近期活动</view></new-campaign>
		<!--最新订单-->
		<new-order class="mt-2" :orderDetails="orderDetails"><view class="card-title">最新订单</view></new-order>
		<!--我的名片-->
		<my-card><view class="card-title">我的名片</view></my-card>
	</view>
</template>

<script src="./marketing.js"></script>

<style lang="less" scoped>
@import url('marketing.less');
</style>
