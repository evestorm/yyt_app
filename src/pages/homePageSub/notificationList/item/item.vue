<!--作者:杨亮-->
<template>
	<view class="item d-flex align-start justify-between p-2" @tap="_userMessagePageUrl(items)" :class="{ 'skt-loading': loading }">
		<view class="avatar d-flex align-center justify-center text-white skeleton">{{ items.userMessageTypeRemark }}</view>
		<view class="main-wrapper d-flex flex-column flex-1 ml-2" :style="{ opacity: item.messageIsRead ? 0.6 : 1 }">
			<view class="title-wrapper d-flex justify-between align-center mb-2 skeleton">
				<view class="title ">{{ items.userMessageTitle }}</view>
				<view class="date">{{ items.fromNowTime }}</view>
			</view>
			<view class="desc skeleton">{{ items.userMessageBody }}</view>
		</view>
	</view>
</template>

<script>
export { default } from './item.js';
</script>

<style lang="less" scoped>
@import url('item.less');
</style>
