<template>
	<view class="container banquet-report logo-absolute-bottom-page">
		<!-- 顶部时间范围筛选 -->
		<yyt-picker
			mode="range"
			format="YYYY-MM"
			:startYear="startDateStr"
			:endYear="endDateStr"
			:defaultVal="defaultDateRangeArr"
			:current="false"
			@confirm="onConfirmDateRange"
			ref="dateRangePicker"
			themeColor="#007AFF"
		></yyt-picker>
		<!-- 顶部筛选 -->
		<view class="nav-fixed-wrapper">
			<!-- tab导航 -->
			<scroll-view scroll-x class="tab-info-wrapper bg-white nav text-center">
				<view class="inner">
					<view
						class="cu-item"
						:class="item.selected ? 'text-blue cur short yyt-font-weight' : 'text-light-gray'"
						v-for="(item, index) in reportTypeArr"
						:key="index"
						@tap="reportTypeTabSelect($event, item)"
						:data-id="index"
					>
						{{ item.label }}
					</view>
				</view>
			</scroll-view>
			<!-- 顶部filter -->
			<view class="bg-white nav uni-flex nav-filter">
				<!-- 时间筛选 -->
				<!-- 时间筛选 -->
				<view class="cu-item text-center">
					<view
						class="dateSelect"
						:style="{
							flex: queryData.startDate == queryData.endDate ? '	0 1 30%' : '1',
							justifyContent: queryData.startDate == queryData.endDate ? 'center' : 'ceter'
						}"
					>
						<block v-if="queryData.startDate == queryData.endDate">
							<view class="toLeft" @tap="getPre">
								<image
									class="yyt-small-img"
									:src="picDomain + '/upload/yytApp/reserve/arrow-left.png'"
									mode=""
								></image>
							</view>
							<view class="date-range" @tap="clickDateRange">
								<image
									class="icon yyt-margin-right-small"
									:src="picDomain + '/upload/yytApp/home/date.png'"
									mode=""
								></image>
								<text id="start-date" class="input">
									{{ queryData.startDate.slice(0, 7) }}
								</text>
							</view>
							<view class="toRight" @tap="getNext">
								<!-- <uni-icons type="arrowright" size="35r" color="#0183FF"></uni-icons> -->
								<image
									class="yyt-small-img"
									:src="picDomain + '/upload/yytApp/reserve/arrow-right.png'"
									mode=""
								></image>
							</view>
						</block>
						<block v-else>
							<view class="date-range" @tap="clickDateRange">
								<image
									class="icon yyt-margin-right-small yyt-margin-left-bg"
									:src="picDomain + '/upload/yytApp/home/date.png'"
									mode=""
								></image>
								<text id="start-date" class="input yyt-margin-right-small">
									{{ queryData.startDate.slice(0, 7) }}
								</text>
								<text class="span">至</text>
								<text id="end-date" class="input yyt-margin-left-small">
									{{ queryData.endDate.slice(0, 7) }}
								</text>
							</view>
							<!-- <uni-icons type="arrowdown" size="35r" color="#0183FF"></uni-icons> -->
						</block>
					</view>
				</view>
				<!-- 自定义 -->
				<!-- <view class="cu-item text-right"><text class="custom yyt-margin-right-bg" @tap="showDatePanel">自定义</text></view> -->
			</view>
		</view>
		<!-- 正文 -->
		<view class="main content">
			<!-- =========================== 宴会数据 ==================== -->
			<!-- 宴会概况 -->
			<view class="banquet-summary" v-show="curTabIdx == 0">
				<view class="title-wrapper">
					<view class="title">宴会概况</view>
					<view class="btn-group">
						<view
							@tap="changeDataType('状态')"
							class="btn"
							:class="curDataType == '状态' ? 'active' : ''"
						>
							状态
						</view>
						<view
							@tap="changeDataType('类别')"
							class="btn"
							:class="curDataType == '类别' ? 'active' : ''"
						>
							类别
						</view>
					</view>
				</view>
				<!-- 状态数据 -->
				<view class="summary-data" v-show="curDataType == '状态'">
					<view class="item">
						执行中
						<text>{{ banquetGeneral.executioningCount }}</text>
					</view>
					<view class="item">
						已执行
						<text>{{ banquetGeneral.finishCount }}</text>
					</view>
					<view class="item">
						已完成
						<text>{{ banquetGeneral.accomplishCount }}</text>
					</view>
					<view class="item">
						取消
						<text>{{ banquetGeneral.cancelCount }}</text>
					</view>
					<view class="item">
						新增
						<text style="color: #FF0000;">+{{ banquetGeneral.addCount }}</text>
					</view>
				</view>
				<!-- 表格数据 -->
				<view class="chart-main" v-show="curDataType == '类别' && chartArr.length > 0">
					<yyt-bar-chart
						:chartArr="chartArr"
						:keyAttr="'typeName'"
						:valueAttr="'typeCount'"
						:xName="'单'"
						:xMinInterval="1"
					></yyt-bar-chart>
				</view>
			</view>

			<!-- 客户经理详情 -->
			<view class="CS-detail" v-show="curTabIdx == 0">
				<!-- <view class="title-wrapper">
					<view class="title">
						客户经理详情
					</view>
				</view> -->
				<yyt-report-table
					:titleList="csTitleList"
					:tableDataList="csTableDataList"
					title="客户经理详情"
				></yyt-report-table>
			</view>

			<!-- ======================= 主题数据 ==================== -->
			<view class="theme-detail" v-show="curTabIdx == 1">
				<!-- <view class="title-wrapper">
					<view class="title">
						主题使用数据
					</view>
				</view> -->
				<yyt-report-table
					class
					:titleList="csTitleList"
					:tableDataList="csTableDataList"
					title="主题使用数据"
				></yyt-report-table>
			</view>

			<!-- ======================= 套餐数据 ==================== -->
			<view class="package-detail" v-show="curTabIdx == 2">
				<!-- <view class="title-wrapper">
					<view class="title">
						套餐数据
					</view>
				</view> -->
				<yyt-report-table
					:titleList="csTitleList"
					:tableDataList="csTableDataList"
					title="套餐数据"
				></yyt-report-table>
			</view>
		</view>
		<!-- 底部 -->
		<view class="logoPic">
			<image src="https://pic.cwyyt.cn/upload/yyticons/0952195219_logo.png" class="bot-logo"></image>
		</view>
	</view>
</template>

<script>
export { default } from './banquetReport.js';
</script>

<style lang="less" scoped>
@import url('banquetReport.less');
</style>
