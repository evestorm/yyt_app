<template>
	<view class="book-report">
		<!-- 导航栏 -->
		<z-nav-bar class="z-nav-bar" :title="navTitle" :back="false" bgColor="#0782ff" fontColor="#FFF">
			<!-- 返回 -->
			<sw-icon type="back" size="27" slot="left" @tap="onBack" color="#FFF"></sw-icon>
		</z-nav-bar>
		<!-- 报表主体 -->
		<view class="main-wrapper">
			<!-- 运营概况 / 转化概况 切换按钮 -->
			<view class="action-wrapper" ref="actionWrapperRef">
				<!-- <view class="btn-wrapper uni-flex yyt-flex-center">
					<button @tap="showOperationDashboard" class="cu-btn round lg margin-right" :class="activeIdx == 0 ? 'bg-blue' : 'line-blue'">
						运营概况
					</button>
					<button @tap="showConversionDashboard" class="cu-btn round lg margin-left" :class="activeIdx == 1 ? 'bg-blue' : 'line-blue'">
						转化概况
					</button>
				</view> -->
				<!-- 顶部时间筛选tab切换 -->
				<scroll-view v-show="activeIdx == 0" scroll-x class="time-tab bg-white nav">
					<view class="time-tab-box">
						<view
							class="cu-item"
							:class="[item.selected&&index!=4? 'text-blue cur short' : 'text-grey',item.selected&&index==4?'timecss':'']"
							v-for="(item, index) in operationTimeArr"
							:key="index"
							@tap="timeTabSelect(operationTimeArr, item)"
							:data-id="index"
						>
							<text>{{ item.label }}</text>
						</view>
					</view>
				</scroll-view>
				<!-- 顶部时间筛选tab切换 -->
				<scroll-view v-show="activeIdx == 1" scroll-x class="time-tab bg-white nav">
					<view class="time-tab-box">
					<view
						class="cu-item"
						:class="[item.selected&&index!=4? 'text-blue cur short' : 'text-grey',item.selected&&index==4?'timecss':'']"
						v-for="(item, index) in conversionTimeArr"
						:key="index"
						@tap="timeTabSelect(conversionTimeArr, item)"
						:data-id="index"
					>
						<text>{{ item.label }}</text>
					</view>
					</view>
				</scroll-view>
			</view>
			<!-- 运营概况板块 -->
			<view v-show="activeIdx == 0" class="operation-info-wrapper">
				<view class="total uni-flex uni-row yyt-flex-center yyt-margin-bottom-bg">
					<view class="item uni-flex uni-column yyt-flex-center">
						<view class="title">
							总桌数
							<text>(桌)</text>
						</view>
						<view class="data">{{operationsReport.totalTableNum}}</view>
					</view>
					<view class="item uni-flex uni-column yyt-flex-center">
						<view class="title">
							总收入
							<text>(元)</text>
						</view>
						<view class="data">{{ operationsReport.totalFeeAmount | formatMoney }}</view>
					</view>
				</view>
				<view class="detail uni-flex uni-row d-flex justify-around">
					<view class="item uni-flex uni-column yyt-flex-center">
						<view class="title">
							客户
							<text>(桌/¥)</text>
						</view>
						<view class="data">{{operationsReport.cstTableNum}}</view>
						<view class="data">{{ operationsReport.cstFeeAmount | formatMoney }}</view>
					</view>
					<view class="item uni-flex uni-column yyt-flex-center">
						<view class="title">
							宴会
							<text>(桌/¥)</text>
						</view>
						<view class="data">{{operationsReport.banquetTableNum}}</view>
						<view class="data">{{ operationsReport.banquetFeeAmount | formatMoney }}</view>
					</view>
					<!-- <view class="item uni-flex uni-column yyt-flex-center">
						<view class="title">
							散客
							<text>(桌/¥)</text>
						</view>
						<view class="data">{{operationsReport.noCstTableNum}}</view>
						<view class="data">{{ operationsReport.noCstFeeAmount | formatMoney }}</view>
					</view> -->
				</view>

				<!-- 客户经理数据 -->
				<view class="CS-wrapper">
					<view class="title margin-left">客户经理数据</view>
					<view class="table">
						<view class="table-title">
							<view class="item">客户经理</view>
							<view class="item"
								v-for="(item, idx) in tableArr" :key="idx" @tap="sortOperationsMarketerReports(item)">
									{{ item.name }}
									<text>{{item.unit}}</text>
									<image :src="sortIcon(item.sortDesc, item.selected)" mode=""></image>
							</view>
						</view>
						<view class="table-row" v-for="(item,index) in operationsReport.operationsMarketerReports" :key="index">
							<view class="item">{{item.marketerName}}</view>
							<view class="item">
								<text>{{item.cstTableNum}}</text>
								<!-- <text :class="{active: tableArr.filter(v => v.selected)[0].value == 'cstFeeAmount'}">{{ item.cstFeeAmount | formatMoney }}</text> -->
								<text class="active">{{ item.cstFeeAmount | formatMoney }}</text>
							</view>
							<view class="item">
								<text>{{item.banquetTableNum}}</text>
								<!-- <text :class="{active: tableArr.filter(v => v.selected)[0].value == 'banquetFeeAmount'}">{{ item.banquetFeeAmount | formatMoney }}</text> -->
								<text class="active">{{ item.banquetFeeAmount | formatMoney }}</text>
							</view>
							<!-- <view class="item">
								<text>{{item.noCstTableNum}}</text>
								<text class="active">{{ item.noCstFeeAmount | formatMoney }}</text>
							</view> -->
						</view>
					</view>
				</view>
			</view>
			<!-- 转化概况板块 -->
			<view v-show="activeIdx == 1" class="conversion-info-wrapper">
				<view class="total uni-flex uni-row yyt-flex-center yyt-margin-bottom-bg">
					<view class="item conversion uni-flex uni-column yyt-flex-center">
						<view class="title">
							全部转化
							<text>(桌/¥)</text>
						</view>
						<view class="data">{{transforReport.totalTableNum}}</view>
						<view class="data">{{transforReport.totalFeeAmount | formatMoney}}</view>
					</view>
					<view class="item conversion uni-flex uni-column yyt-flex-center">
						<view class="title">
							推荐转化
							<text>(桌/¥)</text>
						</view>
						<view class="data">{{ transforReport.transforTableNum }}</view>
						<view class="data">{{ transforReport.transforFeeAmount | formatMoney }}</view>
					</view>
				</view>
				
				
				<!-- 客户经理数据 -->
				<view class="CS-wrapper">
					<view class="title margin-left">客户经理数据</view>
					<view class="table">
						<view class="table-title">
							<view class="item">客户经理</view>
							<view class="item"
								v-for="(item, idx) in tableTransArr" :key="idx" @tap="sortOperationsMarketerReports(item)">
									{{ item.name }}
									<text>{{item.unit}}</text>
									<image :src="sortIcon(item.sortDesc, item.selected)" mode=""></image>
							</view>
							<!-- <view class="item">
								全部转化
								<text>(桌/¥)</text>
								<image :src="sortIcon(item.sortDesc, item.selected)" mode=""></image>
							</view>
							<view class="item">
								推荐转化
								<text>(桌/¥)</text>
								<image :src="sortIcon(item.sortDesc, item.selected)" mode=""></image>
							</view> -->
						</view>
						<view class="table-row" v-for="(item,index) in transforReport.transforMarketerReports" :key="index">
							<view class="item">{{item.marketerName}}</view>
							<view class="item">
								<text>{{item.totalTableNum}}</text>
								<text class="active">{{ item.totalFeeAmount | formatMoney }}</text>
							</view>
							<view class="item">
								<text>{{item.transforTableNum}}</text>
								<text class="active">{{ item.transforFeeAmount | formatMoney }}</text>
							</view>
						</view>
					</view>
				</view>
			</view>
		</view>
		<!-- 选择时间modal -->
		<yyt-picker mode="range"
			:startYear="startDateStr"
			:endYear="endDateStr"
			:defaultVal="defaultDateRangeArr"
			:current="false"
			@confirm="onConfirm"
			@cancel="cancelDatePicker"
			ref="range" 
			themeColor="#f00"
		></yyt-picker>
	</view>
</template>

<script>
export { default } from './bookReport.js';
</script>

<style lang="less" scoped>
@import url('bookReport.less');
</style>
