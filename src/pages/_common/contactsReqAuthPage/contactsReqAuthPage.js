// 作者:杨亮

//------------------------------mock数据引入---------------------------
import contactsReqAuthPageMock from './contactsReqAuthPage_mock.js';

//------------------------------组件引入-------------------------------
const app = getApp();

export default {
    // 组件放在data前面
    components: {
        
    },
    data() {
        return {
            // --------------------------------------页面参数---------------------------
            urlOption: {}, // url参数
			redirectUrl: '', // 重定向页面
			checkedFile: false, // 同意协议
			webHref: 'https://s.cwyyt.cn/yunyutianAgreement.htm', // 协议地址
			picDomain: app.globalData.PicDomain,
        };
    },
    // 页面加载事件
    async onLoad(options) {
        this.urlOption = options;
		this.redirectUrl = decodeURIComponent(this.urlOption.redirectUrl);
    },
    methods: {
		// ---------------- iOS 权限获取 ---------------------
		// 「开始启用」按钮
		reqAuth() {
			if (!this.checkedFile) {
				this.$cw.showError('请阅读勾选《隐私授权协议》');
				return;
			}
			// 申请权限
			this.$cw.reqAddressBookAuth(auth => {
				if (auth) {
					// 不管用户是否点击授权，都隐藏当前页，直接跳转到之前的页面，从哪儿来回哪儿去
					uni.redirectTo({
						url: this.redirectUrl
					});
				} else {
					
				}
			});
			
		},
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
		},
    },
    computed: {
        // fullName(){
        //	return this.items
        //}
    },
    filters: {
        // parseScene(value) {
        // return value+'123';
        // }
    },
    watch: {
        // "currentStore.storeId": {
        //    handler(val, oldval) {
        //        if (val) {

        //        }
        //    }
        // }
    }
};
