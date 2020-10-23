<template>
	<view >
		<!-- <view>
		        <view class="titletext">
		        <text>{{titletext}}</text>
		        </view>
		        
		 </view> -->
		<view class="order">
			<view class="order-top">
		   	      <view class="order-input">
		 	      	<uni-icons type="search" size="35r"></uni-icons>
		 	      	<input type="text"   placeholder="请输入线索姓名、电话" />
		 	      </view>
			</view>
		</view>
    </view>
</template>

<script>
		export { default } from './cstRecord.js';
</script>

<style>
		@import url('cstRecord.less');
</style>

