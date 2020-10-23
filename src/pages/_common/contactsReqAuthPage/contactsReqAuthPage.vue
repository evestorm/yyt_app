<!--作者:杨亮-->
<template>
	<view class="contactsReqAuthPage">
		<view class="request-auth yyt-auth-contacts">
			<view class="img-wrapper">
				<image class="contacts" :src="picDomain + '/upload/yyticons/170517517_open-addressbook.png'" mode=""></image>
				<text>暂未启用通讯录</text>
			</view>
			<!-- 按钮 -->
			<view class="uni-flex yyt-flex-center" style="margin-top: 150rpx;">
				<button class="login-btn cu-btn round bg-blue margin-tb-sm lg" @tap="reqAuth">开始启用</button>
			</view>
			<!-- 协议 -->
			<view class="file-check agreement yyt-margin-top-bg">
				<!-- <label> -->
				<checkbox @tap="changeFile" color="#00BFFF" value="checkedFile" :checked="checkedFile" style="transform:scale(0.6);position: relative;top: -1px;" />
				<text>
					同意《
					<text @tap="navito" class="text-black">隐私授权协议</text>
					》
				</text>
				<!-- </label> -->
			</view>
		</view>
	</view>
</template>

<script src="./contactsReqAuthPage.js"></script>

<style lang="less" scoped>
@import url('contactsReqAuthPage.less');
</style>
