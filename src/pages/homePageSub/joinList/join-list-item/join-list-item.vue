<!--作者:覃彬-->
<template>
	<view class="join-list-item Regular bg-white px-3">
		<navigator
			hover-class="none"
			class="item d-flex py-3 a-center"
			v-for="(item, index) in showList"
			:key="index"
			:url="`/pages/homePageSub/joinDetail/joinDetail?id=${item.id}&type=${item.taskType}&month=${month}`"
		>
			<view class="join-type Regular text-white bg-primary radius-100 text-center mr-2">{{ item.taskType | parseType }}</view>
			<view class="join-info flex-1 ">
				<view class="d-flex a-center j-sb info-top">
					<view class="join-name Regular font-30 line-h">{{ item.taskName }}</view>
					<view class=" line-h"><rich-text :nodes="parseConfirmText(item)"></rich-text></view>
				</view>
				<view class="info-bottom d-flex a-center j-sb mt-2">
					<view class=" line-h">{{ item.taskShortName }}</view>
					<view class="join-status text-center font-24" :class="item.taskStatus==10 ? 'bg-join-gray' : 'bg-join-green'">{{ item.taskStatus == '10' ? '未完成' : '已完成' }}</view>
				</view>
			</view>
		</navigator>
	</view>
</template>

<script>
export { default } from './join-list-item.js';
</script>

<style lang="less" scoped>
@import url('join-list-item.less');
</style>
