<template>
	<view class="call-records">
		<!-- 搜索栏 -->
		<!-- <uni-search-bar
			:radius="100"
			placeholder="搜索"
			clearButton="none"
			bgColor="white"
			@confirm="search"></uni-search-bar> -->
		<!-- <scroll-view scroll-y="true" class="scroll-view-wrapper"> -->
		<mescroll-uni class="records-list" :up="upOption" @up="upCallback" :down='down' :top="90" :firstReload='true'>
		<!-- <scroll-view class="records-list" scroll-y @scrolltolower='pagination'> -->
			<view class="card"
				v-for="(user, index) in dataList" :key="user.phone + index"
				@tap="gotoCustomerDetail(user)">
				<view class="basic">
					<view class="aside yyt-margin-right-bg">
						<image v-if="user.callType == 2" class="yyt-normal-img" :src="picDomain + '/upload/yytApp/customer/huchu.png'" mode=""></image>
					</view>
					<view class="content">
						<view class="customer-info" v-if="user.customerID">
							<view class="nickname" :class="user.talkTime == 0 ? 'yyt-error' : ''">{{user.customSaveName || user.phone}}</view>
							<image class="margin-left level yyt-margin-right-small" :src="picDomain + user.customerLevelImgUrl"></image>
							<view class="name">客户姓名：{{user.customerName}}</view>
							<view class="cs-manager-wrapper">
								<text class="icon iconfont lines-blue" :class="user.isLockMarket?'icon-suoding1':'icon-weisuoding'" style="font-size: 24rpx;"></text>
								<!-- <image v-if="user.marketer" class="yyt-small-img" :src="picDomain + '/upload/yytApp/banquet/kefujingli.png'" mode=""></image> -->
								<text class="name">{{user.marketer}}</text>
							</view>
						</view>
						<view class="simple-info" v-else>
							<!-- 只要是通话时间为0，就算未接 -->
							<view class="phone" :class="user.talkTime == 0 ? 'yyt-error' : ''">{{user.customSaveName ? user.customSaveName : user.phone}}</view>
						</view>
					</view>
				</view>
				<yyt-allfree :summaryStat='user.summaryStat' v-if='user.customerID' class='mt-1' style='marginLeft:60rpx;'></yyt-allfree>
				<view class="details yyt-margin-top-bg">
					<view class="time">{{user.beginTime | parseShortDate}} <text class="yyt-margin-left-bg">{{user.beginTime | parseTime}}</text></view>
					<view class="tools">
						<view class="item"><image @tap.stop="gotoSendMsg(user)" class="icon" :src="picDomain + '/upload/yytApp/common/duanxin.png'" mode=""></image></view>
						<view class="item"><image @tap.stop="gotoCallPhone(user.phone)" class="icon" style="width: 42rpx;height: 38rpx;" :src="picDomain + '/upload/yytApp/common/phone.png'" mode=""></image></view>
						<view class="item"><image @tap.stop="addCustomer(user)" v-if="!user.customerID" class="icon" style="width: 42rpx;height: 42rpx;" :src="picDomain + '/upload/yytApp/customer/add-customer.png'" mode=""></image></view>
					</view>
				</view>
			</view>
		<!-- </scroll-view> -->
		</mescroll-uni>
		<!-- </scroll-view> -->
		<!-- <view class="logo-bottom">
		  <view style="width: 80rpx; height: 2rpx; margin-right: 10rpx; background: rgba(191,191,191,1);"></view>
		<image :src="picDomain + '/upload/yytApp/images/logo-bottom.png'" style="width: 80rpx; height: 40rpx;"></image>
		<view style="width: 80rpx; height: 2rpx; margin-left: 10rpx; background: rgba(191,191,191,1);"></view>
		</view> -->
	</view>
</template>

<script>
	export { default } from './callRecords.js';
</script>

<style lang="less" scoped>
	@import url('callRecords.less');
</style>
