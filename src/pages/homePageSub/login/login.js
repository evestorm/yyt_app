import storage from '@/common/unistorage/index.js';
import moment from '@/lib/moment/moment.min.js';
import cw from '@/common/ceiwei/common.js';

// 之所以不起名为 uniIcon ，是因为官方bug。使用 uniIcon 会被覆盖导致 h5端不显示，换个名就正常了... 服了
import swIcon from '@/components/uni-icon/uni-icon.vue';
const app = getApp();
import {
	mapState,
	mapMutations,
	mapActions
} from 'vuex';

export default {
	data() {
		return {
			picDomain: app.globalData.PicDomain,
			showModal: false, // 修改客户尊称弹框默认隐藏
			userLoginInfoData: '', //用户登录后的信息
			userLoginInfo: {
				loginName: '', //登录手机号码
				pwd: '', //登录密码
				regID: '',
			},
			//checked: true, //默认记住密码
			checkedFile: false, //同意协议
			isLogging: false, // 控制登录按钮文字的状态（点击登录时显示登录中...）
			userId: '', //用户是否记住密码凭证
			webHref: 'https://s.cwyyt.cn/yunyutianAgreement.htm'
		};
	},
	onLoad() {
		this.checkedFile = storage.getAgreeFile();
	},
	onShow(){
		this.$cw.deleteSiteStorage();
		this.$storage.removeStoreData()
	},
	methods: {
		...mapActions(['login', 'getSalesAuthority', 'getMarketData']),
		// 快速登录
		async fastLogin() {
			var userLoginInfo = this.userLoginInfo;
			userLoginInfo.loginName = userLoginInfo.loginName;
			userLoginInfo.pwd = userLoginInfo.pwd;
			userLoginInfo.regID = storage.getJPushRId() ? storage.getJPushRId() : getApp().globalData.regId ? getApp().globalData.regId : '';
			// alert(JSON.stringify(userLoginInfo));
			if (!userLoginInfo.loginName) {
				uni.showToast({
					title: '请输入账号',
					icon: 'none',
					duration: 2000
				});
				return;
			}
			if (!userLoginInfo.pwd) {
				uni.showToast({
					title: '请输入密码',
					icon: 'none',
					duration: 2000
				});
				return;
			}
			if (!this.checkedFile) {
				uni.showToast({
					title: '请阅读勾选《云于天产品服务条款》协议 ',
					icon: 'none',
					duration: 2000
				});
				return;
			}
			this.isLogging = true;
			uni.showToast({
				title: '登录中...',
				icon: 'none',
				duration: 2000
			});
			try {
				// 登录请求
				let loginInfo = await this.login({
					userLoginInfo,
					//checked: this.checked
				});
				storage.setAgreeFile(this.checkedFile)

				// // 获取客户经理列表
				await this.getMarketData();
				
				this.isLogging = false;
				uni.showToast({
					title: '登录成功！',
					duration: 2000,
				})
				uni.reLaunch({
					url: '/pages/homePage/homePage'
				});
			} catch (err) {
				this.isLogging = false;
			}
		},
		// 触发勾选7天免登陆
		// checkboxChange(e) {
		// 	const values = e.detail.value; // 是个数组!
		// 	this.checked = values[0] === 'checked'
		// },
		//协议勾选
		changeFile() {
			if (this.checkedFile) {
				this.checkedFile = false;
			} else {
				this.checkedFile = true;
			}

		},
		//跳转协议页面  https://s.cwyyt.cn/yunyutianAgreement.htm
		navito() {
			uni.navigateTo({
				url: `/pages/_common/webPage/webPage?url=${this.webHref}`
			});
		}
	},
	computed: {

	},
	components: {
		swIcon,
	}
}
