<template>
	<view class="yyt-progress">
		<view class="date-rate" v-if="isShowDateRate" :style="{ left: dateRate + '%' }"></view>
		<progress class="w-100" :percent="calcPercent" border-radius="8" activeColor="#0183ff" active stroke-width="6" />
	</view>
</template>

<script>
export { default } from './yyt-progress.js';
</script>
<style scoped lang="less">
@import url('yyt-progress.less');
</style>
