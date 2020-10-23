<!--作者:覃彬-->
<template>
	<view class="content">
		<!--============================头部==================================================-->
		<view class="page-header bg-white px-3">
			<view class="d-flex j-sb a-center list font-28 ">
				<view class="left-title">预订(已交定金)</view>
				<view class="right-num">
					<text>{{ orderSumDetail.payDepositCount }}</text>
					<text class="font-24">单</text>
				</view>
			</view>
			<view class="d-flex j-sb list font-28">
				<view class="left-title">预订(未交定金)</view>
				<view class="right-num">
					<text>{{ orderSumDetail.notPayDepositCount }}</text>
					<text class="font-24">单</text>
				</view>
			</view>
			<view class="d-flex j-sb list font-28">
				<view class="left-title">未预订</view>
				<view class="right-num">
					<text>{{ orderSumDetail.notBookOnCount }}</text>
					<text class="font-24">厅</text>
				</view>
			</view>
			<view class="d-flex j-sb list font-28">
				<view class="left-title">预订率</view>
				<view class="right-num">
					<text>{{ orderSumDetail.bookOnRate }}</text>
					<text class="font-24">%</text>
				</view>
			</view>
		</view>

		<!--============================内容==================================================-->
		<view class="page-content bg-white px-3">
			<view class="d-flex j-sb list font-28">
				<view class="left-title">已交定金总额</view>
				<view class="right-num">
					<text class="font-24">￥</text>
					<text>{{ orderSumDetail.payDepositAmount | formatMoney }}</text>
				</view>
			</view>
			<view class="d-flex j-sb list font-28">
				<view class="left-title">预计销售总额</view>
				<view class="right-num">
					<text class="font-24">￥</text>
					<text>{{ orderSumDetail.totalSaleAmount | formatMoney }}</text>
				</view>
			</view>
			<view class="d-flex j-sb list font-28">
				<view class="left-title">预计桌均消费</view>
				<view class="right-num">
					<text class="font-24">￥</text>
					<text>{{ orderSumDetail.tableFeeAvgAmount | formatMoney }}</text>
				</view>
			</view>
			<view class="d-flex j-sb list font-28">
				<view class="left-title">预计人均消费</view>
				<view class="right-num">
					<text class="font-24">￥</text>
					<text>{{ orderSumDetail.personalFeeAvgAmount | formatMoney }}</text>
				</view>
			</view>
		</view>
		<!--===========================底部==================================================-->
		<view class="page-bottom bg-white px-3">
			<view class="d-flex j-sb list font-28">
				<view class="left-title">总预订桌数</view>
				<view class="right-num">
					<text>{{ orderSumDetail.totalTableCount }}</text>
					<text class="font-24">桌</text>
				</view>
			</view>
			<!-- <view class="d-flex j-sb list font-28">
				<view class="left-title">总备用桌数</view>
				<view class="right-num">
					<text>{{ orderSumDetail.totalBookNums }}</text>
					<text class="font-24">桌</text>
				</view>
			</view> -->
		</view>
	</view>
</template>

<script>
export { default } from './banquetPlanList.js';
</script>

<style lang="less" scoped>
@import url('banquetPlanList.less');
</style>
