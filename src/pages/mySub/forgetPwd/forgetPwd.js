import GK01 from '@/service/GK/GK01AppService.js';
import FWUser from '@/service/FW/FWUserAppService.js';
const app = getApp();
export default {
	data() {
		return {
			picDomain: app.globalData.PicDomain,
			phoneno: '', // 修改密码的电话
			second: 0, // 发送短信时间
			code: '', // 短信验证码
			showPassword: false, // 是否显示验证码
			password: '' // 新密码
		}
	},
	onLoad() {},
	computed: {
		yanzhengma() {
			if (this.second == 0) {
				return '获取验证码';
			} else {
				if (this.second < 10) {
					return '0' + this.second + 's';
				} else {
					return this.second + 's';
				}
			}
		}
	},
	methods: {
		display() {
			this.showPassword = !this.showPassword
		},
		async getcode() {
			if (this.phoneno.length < 1) {
				uni.showToast({
					title: '请输入手机号',
					icon: 'none'
				})
				return;
			}
			if (this.second > 0) {
				return;
			}

			const data = {
				tel: this.phoneno,
			};
			let res=await GK01.SendCode(data);
			if(res){
				this.second = 60;
				let js = setInterval(() => {
					this.second--;
					if (this.second == 0) {
						clearInterval(js)
					}
				}, 1000)
			};

		},
		async bindLogin() {
			if (this.phoneno.length != 11) {
				uni.showToast({
					icon: 'none',
					title: '手机号不正确'
				});
				return;
			}
			if (this.password.length < 6) {
				uni.showToast({
					icon: 'none',
					title: '密码需要6位以上'
				});
				return;
			}
			if (this.code.length != 6) {
				uni.showToast({
					icon: 'none',
					title: '验证码不正确'
				});
				return;
			}

			// 调用修改密码的接口
			const data = {
				tel: this.phoneno,
				newPwd: this.password,
				code: this.code
			};
			let res=await FWUser.UpdatePwdByMsg(data);
			if(res){
				uni.showToast({
					icon: 'none',
					title: '密码修改成功'
				});

				setTimeout(() => uni.navigateBack({
					delta:1
				}), 1000);

			};


		}
	}
};
