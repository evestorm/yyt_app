<!--作者:杨亮-->
<template>
	<view class="smsItem">
		<text class="item-name">{{ item.customerName }} {{ item.phone }}</text>
		<!-- <text class="item-vip-name" v-if="item.msgName">(尊称：{{ item.msgName }})</text> -->
		<!-- 发送状态 -->
		<text class="item-status" :class="{ suc: statusDesc == '已发送', fail: statusDesc == '发送失败' }">{{ statusDesc }}</text>
		<!-- 发送成功后，按钮不可用 -->
		<button class="send-btn" :class="{ disabled: disabled }" @click="_onClick" :disabled="disabled">{{ statusDesc == '发送失败' ? '重新发送' : '发送' }}</button>
	</view>
</template>

<script>
export { default } from './smsItem.js';
</script>

<style lang="less" scoped>
@import url('smsItem.less');
</style>
