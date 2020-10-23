<!--作者:覃彬-->
<template>
	<view class="joinList">
		<!--日期筛选-->
		<yyt-date-change @chooseRangeDate="getRangeDate" type="yearMonth"></yyt-date-change>
		<view class="join-type d-flex a-center p-3">
			<view
				class="bg-white font-28 mr-3 btn"
				@tap="queryData.taskStatus = item.value"
				:class="queryData.taskStatus == item.value ? 'sel' : ''"
				v-for="(item, index) in constData.state"
				:key="item.value"
			>
				{{ item.label }}
			</view>
		</view>
		<!--协同列表项-->
		<mescroll-uni :down="downOption" @down="downCallback" :up="upOption" @up="upCallback" :top="navFilterBottom">
			<join-list-item :listData="joinList" :month="queryData.month"></join-list-item>
		</mescroll-uni>
	</view>
</template>

<script src="./joinList.js"></script>

<style lang="less" scoped>
@import url('joinList.less');
</style>
