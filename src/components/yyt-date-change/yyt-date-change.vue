<!--作者:覃彬-->
<template>
	<view class="yyt-date-change">
		<view class="date-top bg-white d-flex">
			<view class="left d-flex a-center" v-if="date.startDate == date.endDate">
				<view class="py-2 px-5" @tap="getPre"><image class="img" :src="picDomain + '/upload/yytApp/reserve/arrow-left.png'"></image></view>
				<view class="date-text d-flex px-1 a-center" @tap="selDataRange">
					<image :src="picDomain + '/upload/yytApp/images/date-mounth.png'" mode="" class="data-icon"></image>
					<view>{{ type == 'range' ? date.startDate : date.chooseDate }}</view>
				</view>
				<view class="py-2 px-5" @tap="getNext"><image class="img" :src="picDomain + '/upload/yytApp/reserve/arrow-right.png'"></image></view>
			</view>
			<view class="left d-flex a-center py-2" v-else-if="type == 'range' && date.startDate != date.endDate" @tap="selDataRange">
				<image :src="picDomain + '/upload/yytApp/images/date-mounth.png'" mode="" class="data-icon"></image>
				<text>{{ date.startDate }}</text>
				<text class="mx-1 font-22">至</text>
				<text>{{ date.endDate }}</text>
			</view>
		</view>
		<!-- 选择时间范围picker -->
		<yyt-picker
			:mode="type"
			:format="type == 'range' || type == 'yearMonth' ? 'YYYY-MM' : 'YYYY-MM-DD'"
			:startYear="dateRange.startDate"
			:endYear="dateRange.endDate"
			:defaultVal="dateRange.defaultDateRangeArr"
			:current="false"
			@confirm="onConfirmDateRange"
			ref="dateRange"
			themeColor="#007AFF"
		></yyt-picker>
	</view>
</template>

<script>
export { default } from './yyt-date-change.js';
</script>

<style lang="less" scoped>
@import url('yyt-date-change.less');
</style>
