<!--作者:覃彬-->
<template>
	<view class="banquet-cue-item">
		<navigator
			hover-class="none"
			class="order-sec-list"
			v-for="(item, index) in banquetOrderlist"
			:key="index"
			:url="`/pages/banquetSub/banquetDetail/banquetDetail?banquetId=${item.id}`"
		>
			<view class="order-left"><image :src="item.headImg || 'https://pic.cwyyt.cn/upload/yytApp/images/salesperson.png'" class="img"></image></view>
			<view class="order-sec-right">
				<view class="order-sec-right-top">
					<view class="order-sec-right-top-data">
						<text class="top-name">{{ item.banquetOrderName }}</text>
						<uni-icons type="arrowright" size="35r" color="#D9D9D9" class="icon"></uni-icons>
					</view>
					<view class="order-sec-right-top-right-data">
						<image class="img" :src="picDomain + '/upload/yytApp/banquet/date.png'" mode=""></image>
						<text class="top-data">{{ item.banquetDate | parseShortDate }}</text>
					</view>
					<view class="order-sec-right-name">
						<text class="right-name">{{ item.orderCstName }}</text>
						<text>{{ item.orderCstPhone }}</text>
					</view>
					<view class="order-sec-right-type">
						<image :src="picDomain + '/upload/yytApp/banquet/order-yh.png'" mode="" class="img"></image>
						<text class="type-text" v-show="item.banquetThemeTypeName">{{ item.banquetThemeTypeName }}</text>
						<text class="type-text" v-show="item.themeConfName">{{ item.themeConfName }}</text>
						<text class="type-text" v-show="item.diningTypeName">{{ item.diningTypeName }}</text>
						<text class="type-text" v-show="item.banquetPackageName">{{ item.banquetPackageName }}</text>
					</view>
				</view>
				<view class="order-sec-right-mid" v-if="item.backlogCount && item.banquetOrderState != 3">
					<text class="sec-mid-text">待办</text>
					<uni-badge :text="item.backlogCount" type="error" size="small" class="badge"></uni-badge>
					<view class="remark">
						<text v-show="item.backlogData" class="sec-mid-remark-data">{{ item.backlogData | parseShortDate }}</text>
						<text class="sec-mid-remark">{{ item.backlogName }}</text>
					</view>
				</view>
				<view class="order-sec-right-mid-proress" v-if="item.banquetOrderState != 3">
					<text class="proress-text">完成度:</text>
					<progress
						class="mid-proress"
						:percent="item.allCount == 0 ? 0 : (100 * item.executCount) / item.allCount"
						border-radius="8"
						activeColor="#0183ff"
						active
						stroke-width="6"
					/>
					<text class="proress-text-now">{{ item.executCount }}</text>
					<text class="proress-text-total">/{{ item.allCount }}</text>
				</view>
				<view class="cancleShow" v-if="item.banquetOrderState == 3">已取消</view>
				<view class="order-sec-right-bottom">
					<view class="order-sec-right-bottom-left">
						<image :src="picDomain + '/upload/yytApp/banquet/tongchou.png'" mode="" class="bottom-img"></image>
						<text class="bottom-text">统筹人:</text>
						<text class="bottom-name">{{ item.coordinatorName }}</text>
					</view>
					<view class="order-sec-right-bottom-left">
						<image :src="picDomain + '/upload/yytApp/banquet/order-tel.png'" mode="" class="bottom-img"></image>
						<text class="bottom-text">客户经理:</text>
						<text class="bottom-name">{{ item.marketerName }}</text>
					</view>
				</view>
			</view>
		</navigator>
	</view>
</template>

<script>
export { default } from './banquet-order-item.js';
</script>

<style lang="less" scoped>
@import url('banquet-order-item.less');
</style>
