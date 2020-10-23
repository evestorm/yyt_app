<template>
	<view class="track-list">
		<z-nav-bar title="跟踪排行" bgColor="#0782ff" fontColor="#FFF"><sw-icon type="back" size="27" slot="left" @tap="onBack" color="#FFF"></sw-icon></z-nav-bar>
		<view class="top-filter-wrapper" ref="topWrapperRef">
			<!-- 顶部filter -->
			<view class="bg-white nav uni-flex nav-filter">
				<!-- 时间筛选 -->
				<view class="cu-item text-center date-filter">
					<view class="dateSelect">
						<view class="toLeft" @tap="goleft">
							<image class="yyt-tiny-img" :src="picDomain + '/upload/yytApp/reserve/arrow-left.png'" mode=""></image>
						</view>
						<picker mode="date" fields="month" class="flex1" :value="month" @change="chooseDate">
							<view class="monthtime-month-text">
								<image class="yyt-small-img yyt-margin-right-small" :src="picDomain + '/upload/yytApp/home/date.png'" mode=""></image>
								<text>{{ month }}</text>
							</view>
						</picker>
						<view class="toRight" @tap="goright">
							<image class="yyt-tiny-img" :src="picDomain + '/upload/yytApp/reserve/arrow-right.png'" mode=""></image>
						</view>
					</view>
				</view>
			</view>
		</view>
		
		<view class="trick-wrapper">
			<view class="trick-header">
				<view class="left">客户经理</view>
				<view class="right">月跟踪数量<text class="text-sm text-gray">(个)</text></view>
			</view>
			<view class="trick-list">
				<view class="item" v-for="(item, index) in monthTop10List" :key="index">
					<view class="left">{{ item.marketerName }}</view>
					<view class="right">{{ item.followCount }}</view>
				</view>
			</view>
		</view>
		
		<view class="logo-bottom">
			<view style="width: 80rpx; height: 2rpx; margin-right: 10rpx; background: rgba(191,191,191,1);"></view>
			<image :src="picDomain + '/upload/yytApp/images/logo-bottom.png'" style="width: 80rpx; height: 40rpx;"></image>
			<view style="width: 80rpx; height: 2rpx; margin-left: 10rpx; background: rgba(191,191,191,1);"></view>
		</view>
	</view>
</template>

<script>
export { default } from './trackList.js';
</script>

<style lang="less" scoped>
@import url('trackList.less'); 
</style>
