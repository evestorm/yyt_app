<!--作者:杨亮-->
<template>
    <view class="submit-msg d-flex justify-between align-end">
		<textarea placeholder-class="font-24 line-h-52" :value="content" class="textarea" ref="textarea" @input="textareaAInput" row="1" placeholder="添加评价..."></textarea>
		<button class="submit d-flex justify-center align-center" @tap="_onSendAMsg">提交</button>
	</view>
</template>

<script>
    export { default } from './submitMsg.js';
</script>

<style lang="less" scoped>
    @import url('submitMsg.less');
</style>
