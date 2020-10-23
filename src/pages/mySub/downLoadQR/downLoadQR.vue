<template>
	<view class="downLoadQR_page">
		<!-- 导航栏 -->
		<!-- <z-nav-bar title="下载分享码" bgColor="rgb(248, 248, 248)"><sw-icon type="back" size="27" slot="left" @tap="onBack"></sw-icon></z-nav-bar> -->
		<!-- 导航栏 -->
		<z-nav-bar class="z-nav-bar" :title="'下载分享码'" :back="false" bgColor="#0782ff" fontColor="#FFF">
			<!-- 查看报表按钮 -->
			<sw-icon type="back" color="white" size="27" slot="left" @tap="goBack"></sw-icon>
			<!-- 切换门店按钮 -->
		</z-nav-bar>
		<!-- 侧边栏 -->
		<view class="left_navList">
			<view
				v-for="(item, index) in navList"
				class="left_navList_Selected"
				:key="index"
				:class="item.type == currentType ? 'selected' : ''"
				@tap="changeNav(item.type)"
			>
				{{ item.name }}
			</view>
		</view>
		<view class="list-top"></view>
		<!-- 分页列表 -->
		<view class="main_navList">
			<view v-for="(item, index) in dataList" class="nav_item" :key="index">
				<view class="item">
					<view class="item-title">
						<view class="nav_item_title" v-if="currentType == 1">{{ item.marketSetName }}</view>
						<image
							class="img"
							v-if="currentType == 2"
							:src="item.cardImgUrl ? item.cardImgUrl : 'https://pic.cwyyt.cn/upload/img/20200509/164208428_2020050908413.png'"
						></image>
						<view class="nav_item_title" v-if="currentType == 3">{{ item.cardName }}</view>
						<view class="nav_item_btn" @tap="showDownLoad(currentType, item, 0)">下载</view>
					</view>
					<view class="">
						<view class="nav_item_title muliple-line" v-if="currentType == 2">{{ item.hyCardTitle }}</view>
						<view class="item" v-if="currentType == 1">{{ item.marketSetRemark }}</view>
						<view class="item" v-if="currentType == 3">{{ item.cardRemark }}</view>
					</view>
				</view>
			</view>
			<view class="download_bt" v-show="isBottom && dataList.length > 0">-- 已滚动到底部 --</view>
			<view class="no-data" v-show="dataList.length == 0">
				<image class="img" src="https://pic.cwyyt.cn/upload/img/20200206/15000707_nodata.png" mode=""></image>
				<view class="">暂无数据</view>
			</view>
		</view>
		
		<view id="downLoad_qr" @tap.stop="hideDownLoad" v-if="isDownload">
			<image class="img" mode="aspectFit" :src="currentQR"></image>
			<view class="d-flex a-center j-sa flex-wrap">
				<view class="item" @tap.stop="sendWXImg">发送给朋友</view>
				<view class="item" @tap.stop="downLoadR">保存到手机</view>
			</view>
		</view>
		<view class="preview-image-from-app">
			<!-- 预览图片 -->
			<yyt-save-image v-if="isShowPhoto" :url="currentQR" @hide="hidePhoto"></yyt-save-image>
		</view>
	</view>
</template>

<script>
export { default } from './downLoadQR.js';
</script>
<style lang="less" scoped>
@import url('downLoadQR.less');
</style>
