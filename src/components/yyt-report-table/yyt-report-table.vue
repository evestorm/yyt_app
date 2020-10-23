<template>
	<view class="">
		<view class="table-title pt-3 pl-3 pb-2 line-h font-weight" v-show="title">{{ title }}</view>
		<view class="bottom-table">
			<view class="bottom-left">
				<view class="title">{{ tableTitleFirst }}</view>
				<view class="name pl-2 text-ellipsis" v-for="(item, lIndex) in tableDataList" :key="lIndex">{{ item[0] }}</view>
			</view>
			<view class="bottom-right">
				<scroll-view scroll-x="true">
					<view class="bot-info">
						<view class="right-flex">
							<view class="title cell" v-for="(item, index) in tableTitle" :key="index">{{ item }}</view>
						</view>
						<view class="right-flex" v-for="(item, dIndex) in tableDataList" :key="dIndex">
							<view class="info-sec cell" v-for="(em, eIndex) in item" :key="eIndex">
								<text v-if="eIndex > 0">{{ em }}</text>
							</view>
						</view>
					</view>
				</scroll-view>
			</view>
		</view>
	</view>
</template>

<script>
export { default } from './yyt-report-table.js';
</script>

<style lang="less" scoped>
@import url('yyt-report-table.less');
</style>
