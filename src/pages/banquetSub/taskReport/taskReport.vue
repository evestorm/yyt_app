<template>
	<view class="task-report">
		<!-- =============================================头部任务概况=========================================== -->
		<view class="report">
			<view class="report-top">
				<view class="top-title">任务概况</view>
				<view class="top-info">
					<view>
						<view class="title">任务总量</view>
						<view class="num">{{ taskReportData.allCount }}</view>
					</view>
					<view>
						<view class="title">今日待办</view>
						<view class="num">{{ taskReportData.todayCount }}</view>
					</view>
				</view>
			</view>
			<!-- =============================================数量信息=========================================== -->
			<view class="report-mid">
				<view class="">
					<view class="mid-title">三日待办</view>
					<view class="num warn">{{ taskReportData.threeDayCount }}</view>
				</view>
				<view class="">
					<view class="mid-title">逾期</view>
					<view class="num err">{{ taskReportData.overdueCount }}</view>
				</view>
				<view class="">
					<view class="mid-title">未完成</view>
					<view class="num">{{ taskReportData.unfinishedCount }}</view>
				</view>
				<view class="">
					<view class="mid-title">已完成</view>
					<view class="num">{{ taskReportData.finishedCount }}</view>
				</view>
			</view>
			<!-- =============================================底部客户经理数据详情=========================================== -->
			<view class="report-bottom">
				<yyt-report-table :titleList="titleList" :tableDataList="tableDataList"></yyt-report-table>
			</view>
		</view>
		<!-- 底部logo -->
		<view class="logoPic">
			<image src="https://pic.cwyyt.cn/upload/yyticons/0952195219_logo.png" class="bot-logo"></image>
		</view>
	</view>
</template>

<script>
export { default } from './taskReport.js';
</script>

<style lang="less" scoped>
@import url('taskReport.less');
</style>
