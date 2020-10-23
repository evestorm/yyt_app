<!--作者:杨亮-->
<template>
	<view class="notificationList">
		<!-- ========================= 顶部筛选 START ========================= -->
		<view class="filter-wrapper d-flex justify-start align-center p-2">
			<view class="filter-item mr-3" :class="{ active: item.selected }" v-for="(item, idx) in calcFilterArr" :key="idx" @tap="_handleSelFilter(item)">{{ item.label }}</view>
		</view>
		<!-- ========================= 顶部筛选 END ========================= -->

		<!-- ========================= 列表 START ========================= -->
		<view class="list-wrapper">
			<scroll-view scroll-y="true" upper-threshold="10" @scrolltoupper="refreshList" @scrolltolower="loadMore" style="height:calc(100vh - 200rpx)">
				<view class="flex-column a-center d-flex py-2" v-if="isEmpty">
					<image style="width: 140rpx;height: 120rpx;" src="https://pic.cwyyt.cn/upload/img/20200409/1216271627_empty-data.png"></image>
					<text>暂无数据</text>
				</view>
				<view v-else><item v-for="(item, idx) in calcGetListOut" :key="idx" :item="item" :loading="loading" @updateItem="updateItem"></item></view>
				<view class="yyt-logo-bottom" v-show="isAllLoad">
					<view style="width: 80rpx; height: 2rpx; margin-right: 10rpx; background: rgba(191,191,191,1);"></view>
					<image src="https://pic.cwyyt.cn/upload/yytApp/images/logo-bottom.png" style="width: 80rpx; height: 40rpx;"></image>
					<view style="width: 80rpx; height: 2rpx; margin-left: 10rpx; background: rgba(191,191,191,1);"></view>
				</view>
			</scroll-view>
		</view>
		<!-- ========================= 列表 END ========================= -->
	</view>
</template>

<script src="./notificationList.js"></script>

<style lang="less" scoped>
@import url('notificationList.less');
</style>
