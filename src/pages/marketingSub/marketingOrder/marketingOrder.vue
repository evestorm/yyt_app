<!--作者:覃彬-->
<template>
	<view class="marketingOrder d-flex a-center flex-column">
		<yyt-custom-date-picker class="w-100" :dateArr="PageConstData.dateArr" @onConfirmDateRange="onConfirmDateRange" @onSelectDate="onSelectDate"></yyt-custom-date-picker>
		<!--顶部筛选-->
		<order-search @selMarketData="getMarkerSearchData" @selActivityData="geActivitySearchDat"></order-search>
		<!--订单列表-->
		<mescroll-uni :down="downOption" @down="downCallback" :up="upOption" @up="upCallback" :top="navFilterBottom" firstReload="false">
			<view class="sec">
				<!--展示列表项-->
				<order-list class="mt-2 flex-1" :dataList="getOrderDetailsOut.dataList"></order-list>
			</view>
		</mescroll-uni>
	</view>
</template>

<script src="./marketingOrder.js"></script>

<style lang="less" scoped>
@import url('marketingOrder.less');
</style>
