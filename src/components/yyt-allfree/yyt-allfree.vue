<!--作者:覃彬-->
<template>
    <view class="yyt-allfree">
		<!-- 消费汇总情况 -->
		<view class="all-data-info d-flex flex-wrap">
			<view class="list list-left py-1">
				<view class="item">
					<text class="font-24">总消费</text>
					<text class="font-24">(次)：</text>
					<text class="font-24 num">
						{{ (summaryStat &&summaryStat.totalFeeCount) || 0 }}
					</text>
				</view>
			</view>
			<view class="list list-right py-1">
				<view class="item">
					<text class="font-24">总消费</text>
					<text class="font-24">(￥)：</text>
					<text class="font-24 num">
						{{ summaryStat && summaryStat.totalFeeAmount | formatMoney }}
					</text>
				</view>
			</view>
			<view class="list list-left py-1">
				<view class="item">
					<text class="font-24">桌均</text>
					<text class="font-24">(￥)：</text>
					<text class="font-24 num">
						{{ summaryStat && summaryStat.tableAvgFeeAmount | formatMoney }}
					</text>
				</view>
			</view>
			<view class="list list-right py-1">
				<view class="item">
					<text class="font-24">频次</text>
					<text class="font-24">(次)：</text>
					<text class="font-24 num">
						{{ (summaryStat && summaryStat.feeFrequency) || 0 }}
					</text>
					<text class="font-24">(平均每月)</text>
				</view>
			</view>
		</view>
	</view>
</template>

<script>
    export { default } from './yyt-allfree.js';
</script>

<style lang="less" scoped>
    @import url('yyt-allfree.less');
</style>
