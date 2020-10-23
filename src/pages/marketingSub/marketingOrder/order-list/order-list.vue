<!--作者:覃彬-->
<template>
	<view class="order-list bg-white">
		<view class="item" v-for="(item, index) in calcDataList" :key="index">
			<view class="p-3">
				<view class="d-flex a-start">
					<view class="d-flex flex-wrap ">
						<text class="font-28 color-44">{{ item.nickName }}</text>
						<text class="font-28 color-44" v-show="item.customerName">（{{ item.customerName }}）</text>
						<text class="font-28 color-44">{{ item.phone | parseTel }}</text>
					</view>
					<text class="font-28 color-9a flex-1 text-right">{{ item.marketName }}</text>
				</view>
				<view class="d-flex a-center j-sb flex-wrap">
					<text class="font-26 color-66 mr-1">{{ item.setName }}</text>
					<text class="font-28 color-44 mr-1" v-if="item.fee==0">直接领取</text>
					<text class="font-28 color-44 mr-1" v-else>￥{{ item.fee | formatMoney }}</text>
					<text class="font-26 color-9a a-self-end">{{ item.createTime }}</text>
				</view>
			</view>
		</view>
	</view>
</template>

<script>
export { default } from './order-list.js';
</script>

<style lang="less" scoped>
@import url('order-list.less');
</style>
