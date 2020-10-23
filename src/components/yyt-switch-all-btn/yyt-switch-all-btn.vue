<!--作者:杨亮-->
<template>
    <view class="yyt-switch-all-btn d-flex justify-center" @tap="_change()">
		<view class="btn d-flex justify-center align-center">
			<text class="normal" :class="{ active: !isGetAll }">我的</text>
			<text class="normal">/</text>
			<text class="normal" :class="{ active: isGetAll }">全店</text>
		</view>
	</view>
</template>

<script>
    export { default } from './yyt-switch-all-btn.js';
</script>

<style lang="less" scoped>
    @import url('yyt-switch-all-btn.less');
</style>
