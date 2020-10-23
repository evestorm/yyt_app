<!--作者:覃彬-->
<template>
	<view class="banquet-cue-item">
		<navigator hover-class="none" class="sec-list" v-for="(item, index) in banquetCuelist" :key="index" :url="`/pages/banquetSub/myBanquetInfo/myBanquetInfo?id=${item.id}`">
			<view class="sec-list-item-top to-flex">
				<view class="sec-list-item-top-left ">
					<view class="name">{{ item.clueUserName }}</view>
					<view class="phone">{{ item.clueUserPhone }}</view>
				</view>
				<view class="sec-list-item-top-mid">{{ item.name }}</view>
				<view class="sec-list-item-top-right">
					<text class="grade grade1 font13" :class="item.clueLevel ? 'grade' + item.clueLevel : ''">{{ item.clueLevel | parseClueLevel }}</text>
					<text class="state">{{ item.clueStatus == 1 ? '跟进中' : item.clueStatus == 2 ? '已取消' : '成交' }}</text>
				</view>
			</view>
			<view class="sec-list-item-bot">
				<view class="sec-list-item-bot1">
					<image :src="picDomain + '/upload/yytApp/banquet/remark.png'" class="img"></image>
					<text class="font13 edit">{{ item.clueRemark || '暂无备注' }}</text>
				</view>
				<view class="sec-list-item-bot2 to-flex">
					<view class="bot2-list">
						<image :src="picDomain + '/upload/yytApp/banquet/drink.png'" class="img"></image>
						<text class="font12">{{ item.clueTableCount || '0' }}桌备{{ item.bakTableCount }}</text>
					</view>
					<view class="bot2-list">
						<image :src="picDomain + '/upload/yytApp/banquet/form.png'" class="img"></image>
						<text class="font12">{{ item.clueSourceType == 1 ? '手动录入' : item.clueSourceType == 2 ? '表单' : '三方平台' }}</text>
					</view>
					<view class="bot2-list">
						<image :src="picDomain + '/upload/yytApp/banquet/kefujingli.png'" v-show="item.marketerName" class="img"></image>
						<text class="font12">{{ item.marketerName }}</text>
					</view>
				</view>
				<view class="sec-list-item-bot3">
					<image :src="picDomain + '/upload/yytApp/banquet/genjin.png'" class="img"></image>
					<text class="font12">{{ item.latestYHClueHistoryLog }}</text>
				</view>
			</view>
		</navigator>
	</view>
</template>

<script>
export { default } from './banquet-cue-item.js';
</script>

<style lang="less" scoped>
@import url('banquet-cue-item.less');
</style>
