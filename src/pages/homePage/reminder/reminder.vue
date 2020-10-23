<!--作者:杨亮-->
<template>
    <view class="reminder">
		<view class="header">提醒</view>
		<view class="list">
			<view class="item d-flex align-center justify-between"
				v-for="(item, idx) in noticeList"
				:key="idx"
				@tap="_clickReminderItem(item)"
			>
				<view class="left">
					<view class="name">
						{{ item.name }}
					</view>
				</view>
				<view class="right d-flex justify-end">
					<view class="tip" v-html="tipHTML(item)"></view>
					<view class="arrow yyt-margin-left-bg">
						<text class="icon iconfont icon-jiantou02" style="font-size: 24rpx;"></text>
					</view>
				</view>
			</view>
		</view>
	</view>
</template>

<script>
    export { default } from './reminder.js';
</script>

<style lang="less" scoped>
    @import url('reminder.less');
</style>
