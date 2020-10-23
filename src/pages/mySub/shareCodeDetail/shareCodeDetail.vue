<!--作者:覃彬-->
<template>
	<view class="logo-absolute-bottom-page">
		<view class="content pt-3">
			<!--============================头部==================================================-->
			<view class="page-header bg-white pl-3">
				<view class="d-flex a-center mb-2">
					<image :src="topIcon" mode="" class="img" :class="`img${queryData.type}`"></image>
					<view class="list-title font-weight line-h">{{ pageDetail.title }}</view>
				</view>
				<view class="px-4 d-flex j-sb a-center">
					<view class="text-center">
						<view class="title font-22">总访问</view>
						<view class="text-primary font-lg font-weight">
							{{ pageDetail.totalData.visitCount }}
						</view>
					</view>
					<view class="text-center">
						<view class="title font-22">今新增访问</view>
						<view class="text-primary font-lg font-weight">
							{{ pageDetail.totalData.todayAdd }}
						</view>
					</view>
					<view class="text-center">
						<view class="title font-22">转化率</view>
						<view class="text-primary font-lg">
							<text class="font-weight">{{ pageDetail.totalData.conversionRatio || 0 }}</text>
							<text class="font-22">%</text>
						</view>
					</view>
					<!-- 营销页没有转化金额 -->
					<view class="text-center" v-if="queryData.type != 1">
						<view class="title font-22">转化金额</view>
						<view class="text-primary font-lg">
							<text class="font-weight">{{ pageDetail.totalData.conversionAmount | formatMoney }}</text>
						</view>
					</view>
				</view>
			</view>
			<!-- 日期选择tab -->
			<yyt-custom-date-picker
				@onSelectDate="changeDateType"
				@onConfirmDateRange="onConfirmDateRange"
				@onCancelPickerSelect="cancelPickerSelect"
			></yyt-custom-date-picker>
			<!--============================内容==================================================-->
			<view class="page-content">
				<view class="bg-white table-mid">
					<yyt-report-table
						:titleList="titleList"
						:tableDataList="tableDataList"
						title="客户经理详情"
					></yyt-report-table>
				</view>
			</view>
			<!--===========================底部table==================================================-->
			<view class="page-bottom bg-white">
				<yyt-report-table
					:titleList="detailDataTitle"
					:tableDataList="detailData"
					title="详细数据详情"
				></yyt-report-table>
			</view>
		</view>

		<!--底部logo-->
		<view class="logoPic"><image :src="picDomain + '/upload/yytApp/banquet/logo.png'" class="bot-logo"></image></view>
	</view>
</template>

<script>
export { default } from './shareCodeDetail.js';
</script>

<style lang="less" scoped>
@import url('shareCodeDetail.less');
</style>
