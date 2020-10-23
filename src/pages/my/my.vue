<template>
	<view class="my">
		<z-nav-bar class="z-nav-bar" title="我的" bgColor="#0782ff" fontColor="#FFF" :back="false">
			<!-- 切换门店按钮 -->
			<view class="right-selector" slot="right" @tap="showMore">
				<text class="tools-text">{{ userInfo.currentStoreName }}</text>
				<image class="tools-icon" :src="picDomain + '/upload/yytApp/home/store-select.png'"></image>
			</view>
		</z-nav-bar>
		<!-- 右上角门店弹窗 -->
		
		<uni-popup class="nav-popup" bubble='right' ref="morePopup" type="position" posi="top: 50px; right: 0; display: flex; justify-content: flex-end;" :custom="true" :mask-click="true">
			<view class="wrapper" style="margin-right: 20rpx;">
				<view v-for="(store, index) in storeData" :key="index" class="item" @tap="chgStore(store)">
					<!-- <image class="img" :src="picDomain + '/upload/yytApp/customer/add-customer.png'"></image> -->
					<view class="title" :class="{ active: store.storeId == userInfo.currentStoreId }">{{ store.branchName }}</view>
				</view>
			</view>
		</uni-popup>
		<view class="title-wrapper" @tap="gotoEditProfile">
			<view class="customer-content">
				<image mode="aspectFill" :src="customeritem.imgUrl && customeritem.imgUrl!='https://pic.cwyyt.cn' ? customeritem.imgUrl : 'https://pic.cwyyt.cn/upload/yytApp/images/salesperson.png'"></image>
				<text>{{ customeritem.customerName }}</text>
			</view>
			<view><sw-icon :size="20" class="uni-icon-wrapper" color="#bbb" type="arrowright" /></view>
		</view>
		<uni-list class="list-wrapper">
			<!-- <view > -->
					<uni-list-item
						class="item my-list" v-for="(item,index) in list" :key="index" @tap=goto(item.url)
						v-if="item.isShow" :title="item.title" :thumb="item.thumb"></uni-list-item>
			<!-- </view> -->
			<!-- <uni-list-item :showArrow='true' :title='customeritem.customerName' :thumb='customeritem.customerFace'></uni-list-item> -->
		</uni-list>
		<view class="bottom-wrapper">
			<view v-show="appInfo.isSHowCurrentVersion" class="app-version">
				<text>当前APP版本:{{ appInfo.appVersionText }}</text>
				<text v-show="isShowTest">(测试)</text>
			</view>
			<view class="logOut" @tap="logOut"><button type="primary" size="mini">退出登录</button></view>
			<!-- <view class="logo"></view> -->
			<view
				class="logo"
				style="display: flex; justify-content: center; align-items: center;"
			>
				<view style="width: 80rpx; height: 2rpx; margin-right: 10rpx; background: rgba(191,191,191,1);"></view>
				<image :src="picDomain + '/upload/yytApp/images/logo-bottom.png'" style="width: 80rpx; height: 40rpx;"></image>
				<view style="width: 80rpx; height: 2rpx; margin-left: 10rpx; background: rgba(191,191,191,1);"></view>
			</view>
		</view>
	</view>
</template>

<script>
export { default } from './my.js';
</script>

<style lang="less" scoped>
@import url('my.less');
</style>
