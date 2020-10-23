<!--作者:杨亮-->
<template>
    <view class="task-card">
		<view class="header d-flex justify-around align-center">
			<view class="title">{{ basicInfo.taskName }}</view>
			<view class="date yyt-margin-left-bg">{{ basicInfo.taskShortName }}</view>
			<view class="status d-flex justify-center align-center" :class="{comfirm: taskStatus, wait: !taskStatus}">{{  taskStatus ? '已完成' : '未完成' }}</view>
		</view>
		<view class="list" v-if="type == '每日预订'">
			<view class="list-item d-flex justify-around align-center"
				v-for="(v , idx) in orderDetail" :key="idx"
			>
				<view class="name">{{ v.taskOrderName }}</view>
				<view class="status-wrapper d-flex justify-center align-center">
					<text v-show="v.isConfrimeOrder" class="icon iconfont icon-yiwancheng"></text>
					<text v-show="!v.isConfrimeOrder" class="icon iconfont icon-daiqueren"></text>
					<text class="status-desc" :class="{ confirm: v.isConfrimeOrder, wait: !v.isConfrimeOrder }">{{ v.isConfrimeOrder ? '已确认' : '待确认' }}</text>
				</view>
			</view>
		</view>
		<view class="list" v-if="type == '每月跟踪'">
			<view class="list-item d-flex justify-around align-center"
				v-for="(v , idx) in followDetail" :key="idx"
			>
				<view class="name">{{ v.taskFollowName }}</view>
				<view class="status-wrapper d-flex justify-center align-center">
					<text class="status-desc">待跟 {{ v.waitFollowCount }}</text>
					<text class="status-desc">已跟 {{ v.alreadyFollowCount }}</text>
					<text class="status-desc">取消 {{ v.cancleFollowCount }}</text>
				</view>
			</view>
		</view>
		<view class="bottom">
			<!-- 财务：点了确认，显示去查看报表 -->
			<!-- 非财务：没点确认前，只显示确认；点了确认，确认按钮消失； -->
			<!-- 不管财务还是非财务，都只能点一次确认，点了无法反悔 -->
			<view class="btn-wrapper d-flex justify-around align-center" v-if="type == '每日预订'">
				<button v-if="basicInfo.isShowConfirmBtn" class="flex-1 confirm-btn d-flex justify-center align-center" @tap="_confirm">确认</button>
				<button v-if="basicInfo.isConfirmeFinance" class="flex-1 confirm-btn d-flex justify-center align-center" @tap="_gotoReport">去查看报表</button>
			</view>
			<view class="link-wrapper d-flex justify-center align-center" v-if="type == '每日预订'">
				<view class="check-an-order" @tap="checkOrderList">查看订单<span style="position: relative; top: -2rpx;">{{ ` >` }}</span></view>
			</view>
			<view class="btn-wrapper" v-if="type == '每月跟踪'">
				<button v-if="basicInfo.isShowConfirmBtn" class="confirm-btn d-flex justify-center align-center" @tap="_report">上报</button>
			</view>
		</view>
	</view>
</template>

<script>
    export { default } from './taskCard.js';
</script>

<style lang="less" scoped>
    @import url('taskCard.less');
</style>
