<!--作者:杨亮-->
<template>
    <view class="overview" v-if="tabNar.length > 0">
		<!-- ========================= 顶部导航 START ========================= -->
		<scroll-view
			scroll-x
			class="tab-nav bg-white nav"
			scroll-with-animation
			:scroll-left="tabNavScrollLeft"
		>
			<view
				class="cu-item yyt-font-weight"
				:class="item.selected ? 'text-blue cur short' : 'text-light-gray'"
				v-for="item in tabNar"
				:key="item.code"
				@tap="_tabNavSelect"
				:data-code="item.code"
			>
				{{ item.name }}
			</view>
		</scroll-view>
		<!-- ========================= 顶部导航 END ========================= -->
		
		<!-- ========================= 我的/全店 START ========================= -->
		<view class="switch-panel"
			v-for="item in tabNar"
			:key="item.idx"
			v-show="tabNavSelected.code == item.code">
			<yyt-switch-all-btn @change="change" :key="$storage.getAppUserInfo().currentStoreId"></yyt-switch-all-btn>
		</view>
		<!-- ========================= 我的/全店 END ========================= -->
		
		<!-- ========================= 数字统计 START ========================= -->
		<view class="hero-wrapper">
			<block
				v-if="tabNar.length > 0"
			>
				<view class="hero-num d-flex justify-between align-center" v-if="tabNavSelected.name == moduleEnum.reserve">
					<view class="hero-num-item d-flex flex-column justify-between align-center flex-1">
						<view class="number">{{ calcCurData(moduleEnum.reserve, 'overview', 'currMonthTotalAmount') | formatMoney }}</view>
						<view class="info">全店收入</view>
					</view>
					<view class="hero-num-item d-flex flex-column justify-between align-center flex-1">
						<view class="number">{{ calcCurData(moduleEnum.reserve, 'overview', 'currMonthTotalTableCount') }}</view>
						<view class="info">总桌数</view>
					</view>
					<view class="hero-num-item d-flex flex-column justify-between align-center flex-1">
						<view class="number">{{ calcCurData(moduleEnum.reserve, 'overview', 'currMonthTotalBookNums') }}</view>
						<view class="info">总人数</view>
					</view>
				</view>
				<view class="hero-num d-flex justify-between align-center" v-if="tabNavSelected.name == moduleEnum.customer">
					<view class="hero-num-item d-flex flex-column justify-between align-center flex-1">
						<view class="number">{{ calcCurData(moduleEnum.customer, 'overview', 'cstCount') }}</view>
						<view class="info">总客户</view>
					</view>
					<view class="hero-num-item d-flex flex-column justify-between align-center flex-1">
						<view class="number">{{ calcCurData(moduleEnum.customer, 'overview', 'cstPoolCount') }}</view>
						<view class="info">价值客户</view>
					</view>
					<view class="hero-num-item d-flex flex-column justify-between align-center flex-1">
						<view class="number">{{ calcCurData(moduleEnum.customer, 'overview', 'toShopCstCount') }}</view>
						<view class="info">本月到店</view>
					</view>
				</view>
				<view class="hero-num d-flex justify-between align-center" v-if="tabNavSelected.name == moduleEnum.banquet">
					<view class="hero-num-item d-flex flex-column justify-between align-center flex-1">
						<view class="number">{{ calcCurData(moduleEnum.banquet, 'overview', 'currMonthNeedHandleCount') }}</view>
						<view class="info">本月待办</view>
					</view>
					<view class="hero-num-item d-flex flex-column justify-between align-center flex-1">
						<view class="number">{{ calcCurData(moduleEnum.banquet, 'overview', 'currMonthAddAmount') }}</view>
						<view class="info">本月新增</view>
					</view>
				</view>
				<view class="hero-num d-flex justify-between align-center" v-if="tabNavSelected.name == moduleEnum.marketing">
					<view class="hero-num-item d-flex flex-column justify-between align-center flex-1">
						<view class="number">{{ calcCurData(moduleEnum.marketing, 'overview', 'performance') }}</view>
						<view class="info">营销业绩</view>
					</view>
				</view>
			</block>
		</view>
		<!-- ========================= 数字统计 END ========================= -->
		
		<!-- ========================= 饼状图 START ========================= -->
		<block
			v-if="tabNar.length > 0"
		>
			<yyt-pie-chart :isShow="isShow" :chartData="calcCurData(moduleEnum.reserve, 'data', 'data')" v-if="tabNavSelected.name == moduleEnum.reserve && isrefresh"></yyt-pie-chart>
			<yyt-pie-chart :chartData="calcCurData(moduleEnum.customer, 'data', 'data')" v-if="tabNavSelected.name == moduleEnum.customer"></yyt-pie-chart>
			<yyt-bar-chart
				class="bar-chart"
				v-if="tabNavSelected.name == moduleEnum.banquet"
				:chartArr="calcCurData(moduleEnum.banquet, 'data', 'data')"
				:keyAttr="'typeName'"
				:valueAttr="'typeCount'"
				:xMinInterval="1"
			></yyt-bar-chart>
			<view class="marketing-wrapper d-flex justify-around align-center" v-if="tabNavSelected.name == moduleEnum.marketing">
				<view class="data-item d-flex flex-column align-center justify-between">
					<view class="num">{{ calcCurData(moduleEnum.marketing, 'data', 'data').visitCount }}</view>
					<view class="desc">访问次数</view>
				</view>
				<view class="data-item d-flex flex-column align-center justify-between">
					<view class="num">{{ calcCurData(moduleEnum.marketing, 'data', 'data').visitPeople }}</view>
					<view class="desc">访问人数</view>
				</view>
			</view>
		</block>
		<!-- ========================= 饼状图 END ========================= -->
		
		<!-- ========================= 查看更多 START ========================= -->
		<view class="bottom-wrapper d-flex justify-between align-center"
			v-for="(item, idx) in tabNar"
			:key="`${idx}${idx}`"
			v-show="tabNavSelected.code == item.code"
			@tap="_seeMore(item)"
		>
			<view class="date-inner d-flex align-center justify-center">
				 <text class="icon iconfont icon-riqi1 yyt-margin-right-small" style="font-size: 24rpx; color: #0185FEFF;"></text>
				 <text class="date">{{ nowDate }}</text>
			</view>
			<view class="see-more">
				<text class="">查看更多</text>
				<text class="icon iconfont icon-jiantou02" style="font-size: 24rpx;"></text>
			</view>
		</view>
		<!-- ========================= 查看更多 END ========================= -->
	</view>
</template>

<script>
    export { default } from './overview.js';
</script>

<style lang="less" scoped>
    @import url('overview.less');
</style>
