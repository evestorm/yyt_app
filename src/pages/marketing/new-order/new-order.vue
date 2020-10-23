<!--作者:覃彬-->
<template>
	<view class="new-order bg-white p-3">
		<navigator url="/pages/marketingSub/marketingOrder/marketingOrder" hover-class="none" open-type="navigate" class="top-title d-flex a-center j-sb mb-1">
			<view class=""><slot></slot></view>
			<view class="d-flex a-center">
				<text class="mr-1">查看所有</text>
				<text class="iconfont icon-jiantou02 font-24 color-9a"></text>
			</view>
		</navigator>
		<view class="order-list">
			<view class="order-item font-24 d-flex a-center flex-wrap" v-for="(item, index) in calcOrderDetails" :key="index">
				<text v-show="item.nickName" class="mr-1">{{ item.nickName }}</text>
				<text v-show="item.customerName" class="mr-2">({{ item.customerName }})</text>
				<text v-show="item.setName" class="mr-2">{{ item.setName }}</text>
				<text v-show="item.date" class="mr-1">{{ item.date }}</text>
				<text v-show="item.createTime">{{ item.createTime | parseTime }}</text>
			</view>
		</view>
	</view>
</template>

<script>
export { default } from './new-order.js';
</script>

<style lang="less" scoped>
@import url('new-order.less');
</style>
