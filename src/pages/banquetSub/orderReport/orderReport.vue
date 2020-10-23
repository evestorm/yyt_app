<template>
	<view>
		<!-- 底部选择时间范围picker -->
		<yyt-picker
			mode="range"
			format="YYYY-MM"
			:startYear="dateRange.startDate"
			:endYear="dateRange.endDate"
			:defaultVal="dateRange.defaultDateRangeArr"
			:current="false"
			@confirm="onConfirmDateRange"
			ref="dateRange"
			themeColor="#007AFF"
		></yyt-picker>
		<!--===================================顶部日期选择====================================-->
		<view class="report-top bg-white flex">
			<view class="left flex" v-if="queryData.startDate == queryData.endDate">
				<view class="py-2 px-5" @tap="getPre">
					<image class="img" :src="picDomain + '/upload/yytApp/reserve/arrow-left.png'"></image>
				</view>
				<view class="date-text flex px-1" @tap="selDataRange">
					<image :src="picDomain + '/upload/yytApp/images/date-mounth.png'" mode="" class="data-icon"></image>
					<view>{{ queryData.startDate }}</view>
				</view>
				<view class="py-2 px-5" @tap="getNext">
					<image class="img" :src="picDomain + '/upload/yytApp/reserve/arrow-right.png'"></image>
				</view>
			</view>
			<view class="left d-flex a-center py-2" v-else @tap="selDataRange">
				<image :src="picDomain + '/upload/yytApp/images/date-mounth.png'" mode="" class="data-icon"></image>
				<text>{{ queryData.startDate }}</text>
				<text class="mx-1 font-22">至</text>
				<text>{{ queryData.endDate }}</text>
			</view>
		</view>
		<!--===================================线索概况====================================-->
		<view class="report-content bg-white">
			<view class="card-title">线索概况</view>
			<view class="content-info flex">
				<view class="info-list">
					<view class="item-title">线索总量</view>
					<view class="item-sec">{{ general.allCount }}</view>
				</view>
				<view class="info-list">
					<view class="item-title">新增线索</view>
					<view class="item-sec">{{ general.addCount }}</view>
				</view>
				<view class="info-list">
					<view class="item-title">成交率</view>
					<view class="item-sec">
						{{ general.ratio }}
						<text>%</text>
					</view>
				</view>
			</view>
		</view>
		<!-- ===============================e-charts图形======================================= -->
		<view class="report-echars bg-white">
			<view class="top-title flex">
				<view class="card-title">线索等级统计</view>
				<view class="flex top-btn">
					<view
						class="tab-list"
						:class="{ sel: index + 1 == queryData.type }"
						@tap="queryData.type = index + 1"
						v-for="(item, index) in echartsOfType"
						:key="index"
					>
						{{ item.text }}
					</view>
				</view>
			</view>
			<view class="chart-main"><div ref="orderChart" class="chart-svg"></div></view>
		</view>
		<!--底部信息-->
		<view class="report-bottom bg-white">
			<yyt-report-table :titleList="titleList" :tableDataList="tableDataList"></yyt-report-table>
		</view>
	</view>
</template>

<script>
export { default } from './orderReport.js';
</script>

<style lang="less" scoped>
@import url('orderReport.less');
</style>
