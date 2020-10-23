<!--作者:杨亮-->
<template>
	<view class="container share-code-report logo-absolute-bottom-page">
		<!-- 导航栏 -->
		<z-nav-bar class="z-nav-bar" :title="navTitle" :back="false" bgColor="#0782ff" fontColor="#FFF">
			<navigator open-type="navigateBack" :delta="1"  slot="left">
				<sw-icon type="back" color="white" size="27"></sw-icon>
			</navigator>
		</z-nav-bar>
		<!-- 正文 -->
		<view class="content">
			<!-- tab选项卡 -->
			<view class="tab-wrapper bg-light-secondary px-1 py-3 d-flex justify-start a-center"
				v-if="curTabIdx != 3"
			>
				<view
					v-for="(item, idx) in tabArr"
					v-if="item.value != 3"
					:key="idx"
					class="tab-item px-2 mx-2 border border-primary text-center"
					:class="item.selected ? 'text-white bg-light-blue' : 'text-blue'"
					@tap="onSelectTab($event, item)"
				>
					{{ item.label }}
				</view>
			</view>
			<!-- 时间选择 -->
			<yyt-custom-date-picker
				v-show="curTabIdx == 0"
				@onSelectDate="selectDate"
				@onConfirmDateRange="confirmDateRange"
				@onCancelPickerSelect="cancelPickerSelect"
			></yyt-custom-date-picker>
			<yyt-custom-date-picker
				v-show="curTabIdx == 1"
				@onSelectDate="selectDate"
				@onConfirmDateRange="confirmDateRange"
				@onCancelPickerSelect="cancelPickerSelect"
			></yyt-custom-date-picker>
			<yyt-custom-date-picker
				v-show="curTabIdx == 2"
				@onSelectDate="selectDate"
				@onConfirmDateRange="confirmDateRange"
				@onCancelPickerSelect="cancelPickerSelect"
			></yyt-custom-date-picker>
			<yyt-custom-date-picker
				v-show="curTabIdx == 3"
				@onSelectDate="selectDate"
				@onConfirmDateRange="confirmDateRange"
				@onCancelPickerSelect="cancelPickerSelect"
			></yyt-custom-date-picker>
			<!-- 营销页，会员卡，优惠券的列表 -->
			<scroll-view scroll-y="true" class="list-wrapper" v-show="curTabIdx !== 3">
				<view class="list-header">
					共
					<text>{{ dataArr.length }}</text>
					篇
				</view>
				<navigator
					v-for="(item, idx) in dataArr"
					:key="idx"
					class="list-item bg-white d-flex border-bottom p-2 flex-column"
					hover-class="none"
					:url="`/pages/mySub/shareCodeDetail/shareCodeDetail?id=${item.id}&type=${curTabIdx + 1}&title=${item.name}`"
				>
					<view class="list-item-header d-flex j-sb a-center">
						<view class="title text-bold text-black text-ellipsis">{{ item.name }}</view>
						<view class="date uni-text-gray text-sm">创建时间：{{ item.time.slice(0, 10) }}</view>
					</view>
					<view class="list-item-content d-flex j-sb a-center pt-1">
						<view class="desc text-ellipsis">{{ item.describe || '暂无' }}</view>
						<!-- <navigator
							class="more text-light-blue"
							:url="'/pages/mySub/shareCodeDetail/shareCodeDetail?id=' + item.id"
						> -->
							<view class="more text-light-blue">详情</view>
						<!-- </navigator> -->
					</view>
					<view class="list-item-footer d-flex row a-center j-sa py-1">
						<view class="read-count d-flex row a-center j-center row">
							<image
								style="width: 38rpx;height: 26rpx;margin-right: 10rpx;"
								:src="picDomain + '/upload/yyticons/0951195119_read.png'"
								mode=""
							></image>
							{{ item.visitCount }}
						</view>
						<view class="conversion d-flex row a-center j-center">
							<!-- curTabIdx == 2代表优惠券，优惠券图标是下载 -->
							<image
								style="width: 30rpx;height: 30rpx;margin-right: 10rpx;"
								:src="picDomain + (curTabIdx == 2 ? '/upload/img/20200525/1420392039_download-icon.png' : '/upload/yyticons/0958295829_conversion.png')"
								mode=""
							></image>
							<!-- 如果是优惠券，conversionCount就代表下载量 -->
							{{ item.conversionCount }}
						</view>
						<view class="conversion-rate d-flex row a-center j-center">
							<image
								style="width: 30rpx;height: 30rpx;margin-right: 10rpx;"
								:src="picDomain + '/upload/yyticons/0959145914_conversion-rate.png'"
								mode=""
							></image>
							{{ item.conversionRatio }}%
						</view>
					</view>
				</navigator>
			</scroll-view>
			<view v-show="curTabIdx === 3">
				<!-- 数据概览 -->
				<view class="page-header bg-white my-2 p-2">
					<view class="d-flex a-center mb-3">
						<!-- <image :src="topIcon" mode="" class="img" :class="`img${queryData.type}`"></image> -->
						<view class="list-title font-weight line-h">数据概览</view>
					</view>
					<view class="px-4 d-flex j-sb a-center">
						<view class="text-center">
							<view class="title font-22 text-muted">总金额( ¥ )</view>
							<view class="text-primary font-lg font-weight">
								{{ generalData.allMoney | formatMoney }}
							</view>
						</view>
						<view class="text-center">
							<view class="title font-22 text-muted">总访问</view>
							<view class="text-primary font-lg font-weight">
								{{ generalData.visitCount }}
							</view>
						</view>
						<view class="text-center">
							<view class="title font-22 text-muted">总下单次数</view>
							<view class="text-primary font-lg font-weight">
								{{ generalData.orderCount }}
							</view>
						</view>
						<view class="text-center">
							<view class="title font-22 text-muted">转化率</view>
							<view class="text-primary font-lg">
								<text class="font-weight">{{ generalData.ratio }}</text>
								<text class="font-40">%</text>
							</view>
						</view>
					</view>
				</view>
				<!-- 推广专员数据 -->
				<view class="promotion-specialist-wrapper bg-white my-2">
					<view class="header d-flex j-sb a-center px-2 pt-2">
						<view class="title font-30 font-weight flex-1">推广专员数据</view>
						<view class="attatch-show-type d-flex j-sa a-center flex-1">
							<view
								v-for="(item, idx) in attachShowTypeArr"
								:key="idx"
								class="font-24 radius-20 flex-1 px-2 mx-2 border border-primary text-center"
								:class="item.selected ? 'text-white bg-light-blue' : 'text-blue'"
								@tap="onSelectAttachShowType($event, item)"
							>
								{{ item.label }}
							</view>
						</view>
					</view>
					<view class="charts-main p-2">
						<!-- echarts柱状图 -->
						<yyt-bar-chart
							v-show="curAttachShowType == 0"
							:chartArr="sendPeopleData"
							:keyAttr="'name'"
							:valueAttr="curAttachEchartsType.split(',')[0]"
							:xName="curAttachEchartsType.split(',')[1]"
							:xMinInterval="curAttachEchartsType.split(',')[2]"
						></yyt-bar-chart>
						<!-- excel表 -->
						<yyt-report-table
							v-show="curAttachShowType == 1"
							:titleList="attachTitleList"
							:tableDataList="attachTableDataList"
							title=""
						></yyt-report-table>
					</view>
					<view class="attach-echarts-type d-flex j-sa a-center py-2" v-show="curAttachShowType == 0">
						<view
							v-for="(item, idx) in attachEchartsTypeArr"
							:key="idx"
							class="font-24 radius-20 flex-1 px-2 mx-2 border border-primary text-center"
							:class="item.selected ? 'text-white bg-light-blue' : 'text-blue'"
							@tap="onSelectAttachEchartsType($event, item)"
						>
							{{ item.label }}
						</view>
					</view>
				</view>
				<!-- 数据详情 -->
				<view class="data-details bg-white my-2">
					<view class="header d-flex j-sb a-center px-2 pt-2">
						<view class="title font-30 font-weight flex-1">数据详情</view>
						<view class="attatch-show-type d-flex j-sa a-center flex-1">
							<view
								v-for="(item, idx) in dataDetailsShowTypeArr"
								:key="idx"
								class="font-24 radius-20 flex-1 px-2 mx-2 border border-primary text-center"
								:class="item.selected ? 'text-white bg-light-blue' : 'text-blue'"
								@tap="onSelectDataDetailsShowType($event, item)"
							>
								{{ item.label }}
							</view>
						</view>
					</view>
					<view class="charts-main p-2">
						<!-- echarts折线图 -->
						<yyt-brokenline-chart
							v-show="curDataDetailsShowType == 0"
							:chartArr="detailData"
							:keyAttr="curDataDetailsEchartsType.split(',')[1]"
							:valueAttr="curDataDetailsEchartsType.split(',')[0]"
							:color="curDataDetailsEchartsType.split(',')[2]"
							:yMinInterval="curDataDetailsEchartsType.split(',')[3]"
						></yyt-brokenline-chart>
						<!-- excel表 -->
						<yyt-report-table
							v-show="curDataDetailsShowType == 1"
							:titleList="dataDetailsTitleList"
							:tableDataList="dataDetailsTableDataList"
							title=""
						></yyt-report-table>
					</view>
					<view class="data-details-echarts-type d-flex j-sa a-center py-2" v-show="curDataDetailsShowType == 0">
						<view
							v-for="(item, idx) in dataDetailsEchartsTypeArr"
							:key="idx"
							class="font-24 radius-20 flex-1 mx-2 border border-primary text-center"
							:class="item.selected ? 'text-white bg-light-blue' : 'text-blue'"
							@tap="onSelectDataDetailsEchartsType($event, item)"
						>
							{{ item.label }}
						</view>
					</view>
				</view>
			</view>
		</view>
		<!-- 顶部时间范围筛选 -->
		<yyt-picker
			mode="range"
			format="YYYY-MM-DD"
			:startYear="startDateStr"
			:endYear="endDateStr"
			:defaultVal="defaultDateRangeArr"
			:current="false"
			@confirm="onConfirmDateRange"
			ref="dateRangePicker"
			themeColor="#007AFF"
		></yyt-picker>
		<!-- 底部 -->
		<view class="logoPic">
			<image src="https://pic.cwyyt.cn/upload/yyticons/0952195219_logo.png" class="bot-logo"></image>
		</view>
	</view>
</template>

<script>
export { default } from './shareCodeReport.js';
</script>

<style lang="less" scoped>
@import url('shareCodeReport.less');
</style>
