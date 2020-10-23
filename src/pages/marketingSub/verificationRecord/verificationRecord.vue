<!--作者:杨亮-->
<template>
	<view class="verificationRecord" :class="{ 'yyt-noScroll': isShowCSManagerFilter || isShowCouponTypeFilter}">
		<!-- ========================= 导航栏 START ========================= -->
		<z-nav-bar class="z-nav-bar" :title="'核销记录'" :back="false" bgColor="#0782ff" fontColor="#FFF">
			<!-- 返回 -->
			<sw-icon type="back" size="27" slot="left" @tap="onBack" color="#FFF"></sw-icon>
		</z-nav-bar>
		<!-- ========================= 导航栏 END ========================= -->

		<!-- ========================= 筛选条件 START ========================= -->
		<view class="bg-white nav uni-flex nav-filter px-3" ref="navRef">
			<!-- 客户经理 -->
			<view class="cu-item text-center">
				<view class="flex yyt-flex-center yyt-h-100" @tap.stop="CSManagerFilterToggle">
					<!-- 现在这儿显示的是总数 -->
					<text>{{ currentSelCS.label | currentTopLabel(currentSelCS.value, CSManagerFilterArr) }}</text>
					<uni-icons type="arrowdown" size="35r" color="#0183FF"></uni-icons>
				</view>
				<!-- <uni-icons v-show="$storage.getSalesAuthority().isSeeAll" type="arrowdown" size="35r" color="#0183FF"></uni-icons> -->

				<view class="dropdown-panel" v-show="isShowCSManagerFilter">
					<scroll-view scroll-y="true" style="max-height: 28vh;">
						<view
							v-for="(item, index) in CSManagerFilterArr"
							:key="index"
							:class="['dropdown-item', item.selected ? 'dropdown-item-sel' : '']"
							@tap="seleCSManagerFilter(item)"
						>
							{{ item.count !== undefined ? `${item.label}` : item.label }}
						</view>
					</scroll-view>
					<view class="dropdown-mask" v-show="isShowCSManagerFilter" @tap.stop="hideDropdownAndMask"></view>
				</view>
			</view>
			<!-- 卡券名称 -->
			<view class="cu-item text-center">
				<view class="flex yyt-flex-center yyt-h-100" @tap.stop="couponFilterToggle">
					<text>{{ currentSelCoupon.label | currentTolCouponLabel(currentSelCoupon) }}</text>
					<uni-icons type="arrowdown" size="35r" color="#0183FF"></uni-icons>
				</view>
				<!-- 筛选排序 -->
				<view class="dropdown-panel" v-show="isShowCouponTypeFilter">
					<scroll-view scroll-y="true" style="max-height: 28vh;">
						<view
							v-for="(item, index) in calcGetCouponTypeOut"
							:key="index"
							:class="['dropdown-item', item.selected ? 'dropdown-item-sel' : '']"
							@tap="seleCouponFilter(item)"
						>
							{{ item.label }}
						</view>
					</scroll-view>
					<view class="dropdown-mask" v-show="isShowCouponTypeFilter" @tap="hideDropdownAndMask"></view>
				</view>
			</view>
		</view>
		<!-- ========================= 筛选条件 END ========================= -->
		<!--核销卡片-->
		<view class="list-wrapper"><recordItem v-for="(item, idx) in calcGetRecordListOut" :key="idx" :item="item"></recordItem></view>
		<!-- 底部logo -->
		<view class="yyt-logo-bottom" v-show="isAllLoad">
			<view style="width: 80rpx; height: 2rpx; margin-right: 10rpx; background: rgba(191,191,191,1);"></view>
			<image src="https://pic.cwyyt.cn/upload/yytApp/images/logo-bottom.png" style="width: 80rpx; height: 40rpx;"></image>
			<view style="width: 80rpx; height: 2rpx; margin-left: 10rpx; background: rgba(191,191,191,1);"></view>
		</view>
		<view class="flex-column a-center d-flex py-2" v-show="isEmpty">
			<image
				style="width: 140rpx;height: 120rpx;"
				src="https://pic.cwyyt.cn/upload/img/20200409/1216271627_empty-data.png"
			></image>
			<text>暂无数据</text>
		</view>
	</view>
</template>

<script src="./verificationRecord.js"></script>

<style lang="less" scoped>
@import url('verificationRecord.less');
</style>
