<!--作者:杨亮-->
<template>
	<view class="recordItem d-flex flex-column p-2">
		<view class="main d-flex justify-between align-center flex-wrap">
			<view class="nick-name">{{ item.nickName }}</view>
			<view class="name" :class="{ 'pl-1': item.name }">{{ item.name }}</view>
			<view class="phone" :class="{ 'pl-1': item.phone }">{{ item.phone | formatPhone }}</view>
			<view class="cs-name ml-auto">{{ item.writeMarketerName }}</view>
		</view>
		<view class="minor d-flex justify-between align-center flex-wrap">
			<view class="card-name">{{ item.cardName }}</view>
			<view class="date ml-auto">{{ item.cardWriteOffTime }}</view>
		</view>
	</view>
</template>

<script>
export { default } from './recordItem.js';
</script>

<style lang="less" scoped>
@import url('recordItem.less');
</style>
