<!--作者:杨亮-->
<template>
	<view
		class="dig-banquet-card my-1 p-2 radius-20"
		:class="{ 'bg-light-grey': item.isAdded, 'bg-white': !item.isAdded}"
	>
		<view class="content-wrapper d-flex j-sb a-center">
			<checkbox v-show="isBatch && !item.isAdded" :value="item.bookOrderID" :checked="item.selected" class="check-box-styl mr-2" @tap.stop />
			<view class="gallery flex-1">
				<view class="header d-flex j-start a-center pb-1">
					<text class="font-32 font-weight pr-1">{{ item.customerName }}</text>
					<text class="font-30 text-secondary">{{ item.phone }}</text>
					<image v-show="item.isAdded" style="width: 80rpx; height: 30rpx;" class="mr-auto" :src="picDomain + '/upload/yyticons/165306536_added-icon.png'"></image>
					<text class="font-24 text-secondary ml-auto">{{ item.expectOn | parseShortDate }}</text>
					<text class="font-24 text-secondary pl-1">{{ item.remark }}</text>
				</view>
				<view class="main d-flex j-start a-center">
					<image style="top: -2rpx;" class="yyt-small-img mr-1" :src="picDomain + '/upload/yyticons/1549294929_resume-icon.png'"></image>
					<text class="font-24 text-secondary pl-1" v-show="item.bookOn">{{ item.bookOn | parseShortDate }}</text>
					<text class="font-24 text-secondary pl-2" v-show="item.name">{{ item.name }}</text>
					<text class="font-24 text-secondary pl-2" v-show="item.bookTableNum">{{ item.bookTableNum }}桌</text>
					<text class="font-24 text-secondary pl-2" v-show="item.fee">¥{{ item.fee | formatMoney }}</text>
				</view>
			</view>
		</view>
		<view class="bottom d-flex j-end a-center mt-2" v-show="!item.isAdded && !isBatch">
			<button class="clue-btn mr-0 ml-auto" @tap="_onAddTheClue">添加到线索</button>
		</view>
	</view>
</template>

<script>
export { default } from './dig-banquet-card.js';
</script>

<style lang="less" scoped>
@import url('dig-banquet-card.less');
</style>
