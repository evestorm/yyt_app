<template>
  <view class="content">
  	<view class="header">重新设置密码</view>
  	<view class="list">
  		<!-- <view class="tishi">若您忘记了密码，可在此重新设置新密码。</view> -->
  		<view class="list-call">
  			<image class="img" :src="picDomain + '/upload/yytApp/my/forget-phone.png'"></image>
  			<input class="biaoti" type="number" v-model="phoneno" maxlength="11" placeholder="请输入手机号" />
  		</view>
  		<view class="list-call">
  			<image class="img" :src="picDomain + '/upload/yytApp/my/forget-pwd.png'"></image>
  			<input class="biaoti" type="text" v-model="password" maxlength="32" placeholder="请输入新密码" :password="!showPassword" />
  			<image class="img eyes" :src="showPassword?'https://pic.cwyyt.cn/upload/yytApp/shilu-login/op.png':'https://pic.cwyyt.cn/upload/yytApp/shilu-login/cl.png'" @tap="display"></image>
  		</view>
  		<view class="list-call">
  			<image class="img" :src="picDomain + '/upload/yytApp/my/forget-pwd-confirm.png'"></image>
  			<input class="biaoti" type="number" v-model="code" maxlength="6" placeholder="验证码" />
  			<view class="yzm text-center" :class="{ yzms: second>0 }" @tap="getcode">{{yanzhengma}}</view>
  		</view>
  	</view>
	<!-- <view class="btn" @tap="bindLogin()">提交</view> -->
	<button class="cu-btn round lg bg-blue" @tap="bindLogin()">提交</button> <!-- bg-blue实心按钮 line-blue 镂空按钮 -->
	<!-- <button class="sure-btn" type="primary" @tap="bindLogin()">修改密码</button> -->
  
  </view>
</template>

<script>
    export { default } from './forgetPwd.js';
</script>

<style lang="less" scoped>
    @import url('forgetPwd.less');
</style>
