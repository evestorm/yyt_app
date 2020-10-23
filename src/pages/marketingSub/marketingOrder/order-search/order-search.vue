<!--作者:覃彬-->
<template>
	<view class="order-search bg-white">
		<!-- 展示部分 -->
		<view class="d-flex a-center j-sa text-center">
			<view class="search-text line-h py-3 w-50" @tap="changeIsShowDataList('1')">
				<text class="mr-1  font-32">{{ topSearchMarketText }}</text>
				<text class="right-down iconfont icon-jiantou02 d-inline-block text-primary font-28"></text>
			</view>
			<view class="search-text line-h py-3  w-50" @tap="changeIsShowDataList('2')">
				<text class="mr-1 activity-name ellips-1 d-inline-block font-32">{{ topSearchActivityText }}</text>
				<text class="right-down iconfont icon-jiantou02 d-inline-block text-primary font-28"></text>
			</view>
		</view>

		<view class="search-bg-gary" :style="{ top: top }" v-show="isShowDataList" @tap="isShowDataList = false">
			<view class="" v-if="isShowDataList === '1'">
				<scroll-view scroll-y="true" class="scoll-h bg-white text-left">
					<view
						v-for="(item, index) in calcSearchMarketList"
						:key="item.value"
						class="line-h search-item font-30 p-3"
						:class="item.selected ? 'text-primary' : ''"
						@tap="_selMarket(item)"
					>
						{{ item.label }}
					</view>
				</scroll-view>
			</view>
			<view class="d-flex a-center" v-if="isShowDataList === '2'">
				<scroll-view scroll-y="true" class="right-search w-25 scoll-h bg-white text-left">
					<view
						v-for="(item, index) in activityTypeList"
						:key="item.value"
						class="line-h search-item font-30  p-3"
						:class="item.value == getActivityNameIn.type ? 'text-primary' : ''"
						@tap.stop="getActivityNameIn.type = item.value"
					>
						{{ item.text }}
					</view>
				</scroll-view>
				<scroll-view scroll-y="true" class="right-search flex-1 scoll-h bg-white text-left">
					<view
						v-for="(item, index) in calcActivityList"
						:key="item.value"
						class="line-h search-item font-30  p-3"
						:class="item.value && item.value == selectedActivityId ? 'text-primary' : ''"
						@tap="_searchActivity(item)"
					>
						{{ item.label }}
					</view>
				</scroll-view>
			</view>
		</view>
	</view>
</template>

<script>
export { default } from './order-search.js';
</script>

<style lang="less" scoped>
@import url('order-search.less');
</style>
