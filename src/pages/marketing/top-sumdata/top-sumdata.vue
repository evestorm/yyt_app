<!--作者:覃彬-->
<template>
	<view class="top-sumdata bg-white p-3">
		<view class="sum-top text-center">
			<!-- 顶部我的/全店切换按钮 -->
			<view class=""><slot></slot></view>
			<view class="text-semibold font-34 mt-3" v-cloak>{{ calcSumData.performance | formatMoney }}</view>
			<view class="font-30 mt-2">营销业绩</view>
		</view>
		<view class="sum-bottom">
			<view class="num d-flex a-center j-sa">
				<view class="text-center ">
					<view class="font-34">{{ calcSumData.visitCount }}</view>
					<view class="text font-30">访问次数</view>
				</view>
				<view class="text-center">
					<view class="font-34">{{ calcSumData.visitPeople }}</view>
					<view class="text font-30">访问人数</view>
				</view>
			</view>
			<navigator url="/pages/mySub/shareCodeReport/shareCodeReport" hover-class="none" open-type="navigate" class="d-flex a-center j-sb">
				<view class="d-flex a-center">
					<text class="iconfont icon-riqi1 text-primary mr-1"></text>
					<text class="font-24 color-78">{{ $moment().format('YYYY-MM') }}</text>
				</view>
				<view class="d-flex a-center color-78">
					<text class="mr-1 font-24">更多数据</text>
					<text class="iconfont icon-jiantou02 font-24"></text>
				</view>
			</navigator>
		</view>
	</view>
</template>

<script>
export { default } from './top-sumdata.js';
</script>

<style lang="less" scoped>
@import url('top-sumdata.less');
</style>
