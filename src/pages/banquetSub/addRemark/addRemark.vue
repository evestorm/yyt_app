<template>
	<view class="add-remark">
		<textarea class="remark-text" v-model="taskRemark" placeholder="" maxlength="300" />
		<text class="remark-length">{{ taskRemark.length }}/300</text>
		<text class="remark-place" v-show="taskRemark.length==0">请填写备注</text>
	</view>
</template>
<script>
export { default } from './addRemark.js';
</script>

<style lang="less" scoped>
@import url('addRemark.less');
</style>
