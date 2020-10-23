<template>
	<view class="container">
		<yyt-custom-date-picker
			@onSelectDate="selectDate"
			@onConfirmDateRange="confirmDateRange"
			@onCancelPickerSelect="cancelPickerSelect"
		></yyt-custom-date-picker>
	</view>
</template>

<script>
export { default } from './lanceTestFile.js';
</script>

<style lang="less" scoped>
@import url('lanceTestFile.less');
</style>
