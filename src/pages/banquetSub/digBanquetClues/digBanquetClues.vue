<!--作者:杨亮-->
<template>
	<view class="container digBanquet-clues">
		<!-- 导航栏 -->
		<z-nav-bar class="z-nav-bar" :title="'挖掘宴会线索'" :back="false" bgColor="#0782ff" fontColor="#FFF">
			<navigator open-type="navigateBack" :delta="1"  slot="left">
				<sw-icon type="back" color="white" size="27"></sw-icon>
			</navigator>
		</z-nav-bar>
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
		<view class="filter-top-wrapper my-2 bg-white d-flex j-sb a-center p-2">
			<!-- 日期筛选 -->
			<image :src="picDomain + '/upload/yytApp/home/date.png'" class="yyt-normal-img mr-1"></image>
			<block v-if="query.startMonth == query.endMonth">
				<view class="date-range" @tap="clickDateRange">
					<text id="start-date" class="input">{{query.startMonth | date2month}}</text>
				</view>
			</block>
			<block v-else>
				<view class="date-range" @tap="clickDateRange">
					<text id="start-date" class="input">{{query.startMonth | date2month}}</text>
					<text class="span">{{ ' 至 ' }}</text>
					<text id="end-date" class="input">{{query.endMonth | date2month}}</text>
				</view>
			</block>
			<!-- 批量操作 -->
			<view class="batch-operation text-blue" style="margin-left: auto;" @tap="toggleBatch">
				{{ isBatch ? '取消' : '批量操作'}}
			</view>
		</view>
		<view class="count pb-1 px-2 text-dark-gray font-22">
			共 {{ curListRowCount }} 条宴会机会
		</view>
		<!-- 正文 -->
		<view class="content">
			<!-- ========================= 列表 START ========================= -->
			<mescroll-uni :topbar="true" :down="downOption" @down="downCallback" :up="upOption" @up="upCallback" :top="navFilterBottom" :bottom="swBottom">
				<checkbox-group @change="checkboxChange">
					<block
						v-for="(item, index) in calcPageList"
						:key="item.bookOrderID"
					>
						<dig-banquet-card :item="item" :isBatch="isBatch" @onAddTheClue="onAddTheClue"></dig-banquet-card>
					</block>
				</checkbox-group>
			</mescroll-uni>
		</view>
		<view class="yyt-batch-container" style="height: 120rpx;" v-show="isBatch">
			<view @tap="toggleAllSel" class="left-wrapper">
				<checkbox :checked="isAllSel" class="check-box-styl" />
				<view class="text">
					<view class="p">{{isAllSel ? '取消全选' : '全选'}}</view>
					<view class="p">(已选:<text class="span" style="color: #0183FF;">{{checkboxSelectNum}}</text>)</view>
				</view>
			</view>
			<view class="batch_list">
				<text class="span bg-blue" @tap="addTheClues">添加到线索</text>
			</view>
		</view>
	</view>
</template>

<script src="./digBanquetClues.js"></script>

<style lang="less" scoped>
@import url('digBanquetClues.less');
</style>
