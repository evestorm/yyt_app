<template>
	<view>
		<!-- 导航栏 -->
		<z-nav-bar
			class="z-nav-bar"
			@onactive="onActive"
			:isactive="tabIndex"
			:titles="zTitles"
			:titleswitch="true"
			:back="true"
			bgColor="#0782ff"
			fontColor="#FFF"
		>
		
			<!-- 统计报表 -->
			<view class="left-selector" slot="right">
				<navigator url="/pages/_common/statList/statList">
					<text class="icon iconfont icon-tongji" style="font-size: 24rpx;"></text>
				</navigator>
			</view>

			<!-- 右侧切换视图 -->
			<!-- <view class="right-selector" slot="right" @tap="toggleView"><image class="navbar-right" :src="iconSrc"></image></view> -->
		</z-nav-bar>
		<view v-show="tabIndex == 0"><select-table ref="selectTable"></select-table></view>
		<view v-show="tabIndex == 1"><today-book ref="todayBook" :payload="urlOptions"></today-book></view>
	</view>
</template>

<script src="./reserve.js"></script>

<style lang="less">
.left-selector {
	padding: 10rpx 30rpx 10rpx 10rpx;
}
.right-selector {
	padding: 10rpx 1rpx 10rpx 30rpx;
}
.navbar-right {
	width: 40rpx;
	height: 40rpx;
	margin-right: 12rpx;
}
</style>
