<!--作者:覃彬-->
<template>
	<view class="content pt-2">
		<!--============================头部==================================================-->
		<view class="page-header d-flex j-sb px-3 a-center bg-white">
			<view class="">
				<picker mode="date" fields="month" class="" :value="month" @change="chooseDate">
					<text>{{ month }}</text>
					<image class="down-icon d-inline-block" src="https://pic.cwyyt.cn/upload/yyticons/1311151115_下拉@2x.png" mode=""></image>
				</picker>
			</view>
			<view class="right-change-img-view d-flex a-center" @tap="pageStyle = pageStyle == 1 ? 2 : 1">
				<image
					:src="
						pageStyle == 1
							? 'https://pic.cwyyt.cn/upload/yyticons/131103113_切换到列表预览@2x.png'
							: 'https://pic.cwyyt.cn/upload/yyticons/1112451245_切换到区域预览@2x.png'
					"
					class="right-change-img"
					mode=""
				></image>
				<text class="ml-1 ml-1 font-32">{{ pageStyle == 1 ? '统计' : '看板' }}</text>
			</view>
		</view>

		<!--============================内容==================================================-->
		<view class="page-content">
			<banquet-plan-table :month="month" v-if="pageStyle == 1"></banquet-plan-table>
			<banquet-plan-list :month="month" v-if="pageStyle == 2"></banquet-plan-list>
		</view>
		<!--===========================底部==================================================-->
		<view class="page-bottom"></view>
	</view>
</template>

<script>
export { default } from './banquetPlan.js';
</script>

<style lang="less" scoped>
@import url('banquetPlan.less');
</style>
