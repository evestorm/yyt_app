<!--作者:杨亮-->
<template>
	<view class="homePage" ref="homePage">
		<!-- 导航栏 -->
		<z-nav-bar class="z-nav-bar" :title="'首页'" :back="false" bgColor="#0782ff" fontColor="#FFF">
			<!-- 查看统计 -->
			<navigator url="/pages/_common/statList/statList" class="left-selector" slot="left">
				<text class="icon iconfont icon-tongji" style="font-size: 24rpx;"></text>
			</navigator>
			<!-- 切换门店按钮 -->
			<!-- <view class="right-selector" slot="right" @tap="showMore">
				<text class="tools-text">{{ userInfo.currentStoreName.slice(0, 10) }}</text>
				<image class="tools-icon" :src="picDomain + '/upload/yytApp/home/store-select.png'"></image>
			</view> -->
			<!-- 通知 -->
			<navigator url="/pages/homePageSub/notificationList/notificationList" class="right-selector" slot="right">
				<text class="icon iconfont icon-tongzhi" style="font-size: 34rpx;">
					<text class="badge" v-if="notificationCount!=0">{{notificationCount}}</text>
				</text>
			</navigator>
		</z-nav-bar>
		<!-- 右上角门店弹窗 -->
		<uni-popup class="nav-popup" bubble='right' ref="morePopup" type="position" posi="top: 50px; right: 0; display: flex; justify-content: flex-end;" :custom="true" :mask-click="true">
			<view class="wrapper" style="margin-right: 20rpx;">
				<view v-for="(store, index) in storeData" :key="index" class="item" @tap="chgStore(store)">
					<view class="title" :class="{ active: store.storeId == userInfo.currentStoreId }">{{ store.branchName }}</view>
				</view>
			</view>
		</uni-popup>
		<mescroll-uni ref="mescrollRef" @init="mescrollInit" :up="upOption" :down="downOption" @down="downCallback" :top="mescrollTopY" @scroll="onScroll">
			<view class="scroll-inner">
				<!--首页概况-->
				 <overview
					:tabNar="calcTabNavigatorArr"
					:overviewData="cacheOverViewData"
					@tabNavSelect="tabNavSelect"
					:userInfo="userInfo"
					:isShow="isShow"
					@changeData="changeOverViewData" @seeMore="seeMore"></overview>
				
				<!-- 间隔 -->
				<view class="margin-top"></view>
				<!--入口菜单-->
				 <grid-menu :menuList="menuList" @goNaviPage="goNaviPage"></grid-menu>
				 <view class="margin-top" v-show="noticeList.length > 0"></view>
				<!--提醒-->
				 <reminder
					v-show="noticeList.length > 0"
					:noticeList="noticeList"
					@clickReminderItem="clickReminderItem"></reminder>
			</view>
		</mescroll-uni>
		
		<!-- ========================= 其他 START ========================= -->
		<!-- 【刷新跟踪机会】选择年月 -->
		<yyt-picker
		    mode="yearMonth"
			:format="'YYYY-MM'"
		    :startYear="dateRange.startDate"
		    :endYear="dateRange.endDate"
		    :defaultVal="dateRange.defaultDateRangeArr"
		    :current="false"
		    @confirm="onConfirmYear"
			@cancel="onCancelYear"
		    ref="yearMonth"
		    themeColor="#007AFF"
		></yyt-picker>
		<!-- ========================= 其他 END ========================= -->
	</view>
</template>

<script src="./homePage.js"></script>

<style lang="less" scoped>
    @import url('homePage.less');
</style>
