<template>
	<view class="order">
		<!-- 筛选/搜索框 -->
		<view class="order-top">
			<view class="order-input">
				<uni-icons type="search" size="35r"></uni-icons>
				<input type="text" v-model="queryData.nameOrPhone" placeholder="请输入客户姓名、电话" @focus="triggerSearch" />
			</view>
			<view class="order-screen">
				<view class="order-screen-view" @tap="orderSel">
					<text>{{ orderText }}</text>
					<uni-icons type="arrowdown" size="35r" color="#0183ff" class="order-screen-img"></uni-icons>
				</view>
				<view class="order-screen-view" @tap="typeSel">
					<text>{{ typeText }}</text>
					<uni-icons type="arrowdown" size="35r" color="#0183ff" class="order-screen-img"></uni-icons>
				</view>
				<view class="order-screen-view" @tap="stateSel">
					<text>{{ stateText }}</text>
					<uni-icons type="arrowdown" size="35r" color="#0183ff" class="order-screen-img"></uni-icons>
				</view>
			</view>
			<view class="order-picker" :class="{ orderNone: isOrder }">
				<!-- order排序方式 -->
				<view class="order-picker-list" v-for="(item, orderIndex) in orderList" :key="orderIndex">
					<view class="order-list-item" :class="{ orderSel: item.selected }" @tap="orderClick(item)">{{ item.name }}</view>
				</view>
			</view>
			<view class="type-picker" :class="{ typeNone: isType }">
				<!-- type 宴会类别 -->
				<scroll-view scroll-y="true" class="type-picker-list">
					<view class="" v-for="(item, typeIndex) in typeList" :key="typeIndex">
						<view class="type-list-item" :class="{ typeSel: item.selected }" @tap="typeClick(item)">{{ item.name }}</view>
					</view>
				</scroll-view>
			</view>
			<view class="state-picker" :class="{ stateNone: isState }">
				<!-- state 订单状态 -->
				<view class="state-picker-list" v-for="(item, stateIndex) in stateList" :key="stateIndex">
					<view class="state-list-item" :class="{ stateSel: item.selected }" @tap="stateClick(item)">{{ item.name }}</view>
				</view>
			</view>
			<view class="mengban" :class="{ mengbanNone: isMengban }" @tap="mengbanNone"></view>
			<view class="filter-result-wrapper">
				<view class="left">
					<!-- 这儿显示的当前筛选条件下列表总数 -->
					<view class="page-num">共筛选{{ pageNum }}条宴会订单</view>
				</view>
			</view>
		</view>
		<!-- 宴会订单主体 -->
		<mescroll-uni class="order-section" :down="downOption" @down="downCallback" :up="upOption" @up="upCallback" :top="navFilterBottom">
			<banquet-order-item :banquetOrderlist="orderData"></banquet-order-item>
		</mescroll-uni>
	</view>
</template>

<script>
export { default } from './banquetOrder.js';
</script>

<style lang="less" scoped>
@import url('banquetOrder.less');
</style>
