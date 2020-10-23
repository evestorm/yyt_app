<template>
	<view class="container">
		<z-nav-bar title="修改密码" bgColor="#0782ff" fontColor="#FFF">
			<sw-icon type="back" size="27" slot="left" @tap="onBack" color="#FFF"></sw-icon>
		</z-nav-bar>
		<form>
			<view class="add-item">
				<view class="cu-form-group">
					<view class="title">旧密码:</view>
					<input
						password
						type="text"
						class="desc"
						placeholder="请输入旧密码"
						name="oldPwd"
						v-model="updatePwd.oldPassword"
					/>
				</view>
				<view class="cu-form-group">
					<view class="title">新密码:</view>
					<input
						password
						type="text"
						class="desc"
						placeholder="请输入新密码"
						name="newPwd"
						v-model="updatePwd.userPassword"
					/>
				</view>
				<view class="cu-form-group">
					<view class="title">确认密码:</view>
					<input
						password
						type="text"
						class="desc"
						placeholder="请输入确认密码"
						name="confirmPwd"
						v-model="confirmPassword"
					/>
				</view>
			</view>

			<view class="padding flex flex-direction">
				<button class="cu-btn bg-blue lg" @tap="savePwd">保存</button>
			</view>
		</form>
	</view>
</template>

<script>
import storage from '@/common/unistorage/index.js';
import FWUser from '@/service/FW/FWUserAppService.js';
export default {
	data() {
		return {
			confirmPassword: '',
			//用户登录信息
			updatePwd: {
				uRUserId: storage.getAppUserInfo() ? storage.getAppUserInfo().id : null,
				userPassword: '',
				oldPassword: ''
			}
		};
	},
	methods: {
		// 返回上一页
		onBack() {
			// 返回上一页
			uni.navigateBack({
				delta: 1
			});
		},
		// 保存密码
		async savePwd() {
			var self = this;
			var data = self.updatePwd;
			if (!data.userPassword || !data.oldPassword || !self.confirmPassword) {
				uni.showToast({
					title: '请填写密码!',
					icon: 'none'
				});
				return;
			}

			if (self.confirmPassword !== data.userPassword) {
				uni.showToast({
					title: '两次密码不相同!',
					icon: 'none'
				});
				return;
			}

			let result = await FWUser.UpdateByDto(data);
			if (result) {
				uni.showToast({
					title: '修改密码成功',
					icon: 'success'
				});
				setTimeout(function() {
					self.onBack();
				}, 1500);
			}
		}
	}
};
</script>

<style lang="less" scoped>
@import url('updatePwd.less');
</style>
