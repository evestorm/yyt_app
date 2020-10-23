<template>
	<view class="">
		<mescroll-uni class="log" :down="downOption" @down="downCallback" :up="upOption" @up="upCallback" :top="50">
			<view class="log-title" v-show="logList.length!=0">项目</view>
			<view class="log-list" v-for="(item,index) in logList" :key='index'>
				<view class="log-red"></view>
				<view class="log-info">
					<view class="">
						<text class="font12">{{item.historyTitle}}</text>
					</view>
					<view class="">
						<text class="font11">{{item.historySection}}</text>
					</view>
				</view>
			</view>
		</mescroll-uni>
	</view>
</template>

<script>
export { default } from './workingLog.js';
</script>

<style lang="less" scoped>
@import url('workingLog.less');
</style>