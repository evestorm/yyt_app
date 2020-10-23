<template>
	<view id="Login">
		<view class="container">
			<view class="yyt_header"><view class="logoPic"></view></view>
			<view class="yyt_content">
				<form autocomplete="on" class="yyt_customerInfo_main">
					<view class="cu-form-group margin-top">
						<!-- <text class="cuIcon-people text-blue text-right"></text> -->
						<image class="icon-img yyt-margin-right-bg" :src="picDomain + '/upload/yytApp/my/user.png'" mode=""></image>
						<input type="number" id="customerName" focus placeholder="请输入账号" name="input" v-model="userLoginInfo.loginName" />
					</view>
					<view class="cu-form-group margin-top">
						<!-- <text class="cuIcon-lock text-blue text-right"></text> -->
						<image class="icon-img yyt-margin-right-bg" :src="picDomain + '/upload/yytApp/my/pwd.png'" mode=""></image>
						<input type="text" password id="customerNickName" placeholder="请输入密码" name="input" v-model="userLoginInfo.pwd" />
						<navigator class="forget-password" url="/pages/mySub/forgetPwd/forgetPwd" style="margin-left: auto;" hover-class="navigator-hover">
							<text>忘记密码?</text>
						</navigator>
					</view>
				</form>
			</view>
			<view class="yyt_footer margin-top">
				<view class="file-check avoid-login">
					<!-- <view class="yyt_bottom_l">
					</view> -->
					<!-- <view class="yyt_bottom_r" @tap="goApplyCheck">
						<sw-icon class="apply" type="plusempty" size="20"></sw-icon>
						<text class="text-black">申请入驻</text>
					</view> -->
					<!-- <view class="yyt_bottom_r"> -->
					<!-- <view class="yyt_bottom_l">
						<checkbox-group @change="checkboxChange">
							<label>
								<checkbox
									color="#00BFFF"
									value="checked"
									:checked="checked"
									style="transform:scale(0.6);position: relative;top: -1px;"
								/>
								<text class="">14天免登录</text>
							</label>
						</checkbox-group>
					</view> -->
				</view>
				<view class="uni-flex yyt-flex-center">
					<button class="login-btn cu-btn round bg-blue margin-tb-sm lg" @tap="fastLogin" :disabled="isLogging">
						{{ !isLogging ? '立即登录' : '登录中...' }}
					</button>
				</view>
				<view class="file-check agreement yyt-margin-top-bg">
					<!-- <label> -->
					<checkbox
						@tap="changeFile"
						color="#00BFFF"
						value="checkedFile"
						:checked="checkedFile"
						style="transform:scale(0.6);position: relative;top: -1px;"
					/>
					<text>
						同意《
						<text @tap="navito" class="text-black">云于天用户协议与隐私政策</text>
						》协议
					</text>
					<!-- </label> -->
				</view>
			</view>
		</view>
		<view class="sologan text-primary font-28">- 让餐厅营销管理更智能 -</view>
	</view>
</template>

<script>
export { default } from './login.js';
</script>

<style lang="less" scoped>
@import url('login.less');
</style>
