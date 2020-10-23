<template>
	<view class="edit-profile">
		<!-- 导航栏 -->
		<z-nav-bar class="z-nav-bar" :title="'个人资料'" bgColor="#0782ff" fontColor="#FFF">
			<!-- 返回 -->
			<sw-icon type="back" size="27" slot="left" @tap="onBack" color="#FFF"></sw-icon>
			<!-- 保存 -->
			<view class="right-selector" slot="right" @tap="save"><text class="tools-text">保存</text></view>
		</z-nav-bar>

		<!-- 表单 -->
		<view class="wrapper">
			<view class="item avatar" @tap="addPhoto">
				<view class="title">更换头像</view>
				<yyt-upload-img ref="uploadImg" @getImgUrl="getImgUrl"></yyt-upload-img>
				<image class="head-img" :src="changeImgUrl || userinfo.headImgUrl" mode="aspectFill"></image>
			</view>
			<view class="item">
				<view class="title">邮箱</view>
				<view class="email flex-1">
					<input placeholder-style="fontSize:22rpx" class="sw-input flex-1" type="text" focus placeholder="请输入邮箱信息" v-model="userinfo.email" />
					<view class="arrow-wrapper"><sw-icon :size="20" class="uni-icon-wrapper" color="#bbb" type="arrowright" /></view>
				</view>
			</view>
			<view class="item signature">
				<view class="title">个性签名</view>
				<view class="uni-textarea">
					<textarea maxlength="15" auto-height placeholder-style="fontSize:22rpx" @blur="bindTextAreaBlur" v-model="userinfo.desc" placeholder="请输入个性签名" />
				</view>
				<view class="tip">{{ userinfo.desc.length }}/15</view>
			</view>
		</view>
		<!-- 底部logo -->
		<view class="logoPic"><image src="https://pic.cwyyt.cn/upload/yyticons/0952195219_logo.png" class="bot-logo"></image></view>
	</view>
</template>

<script>
export { default } from './editProfile.js';
</script>

<style lang="less" scoped>
@import url('editProfile.less');
</style>
