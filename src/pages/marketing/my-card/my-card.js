// 作者:覃彬
import YHBanquetOrder from '@/service/YH/YHBanquetOrderAppService.js';
//------------------------------mock数据引入---------------------------
import myCard from './my-card_mock.js';

export default {
	name: 'my-card',
	// 注册属性
	props: {},
	created() {},
	data() {
		return {};
	},
	methods: {
		//分享
		async share() {
			if (this.$cw.isApp(true)) {
				const webpageurl = "https://mp.weixin.qq.com";
				let imgUrl = '';
				const int = this.$cw.weixinIntType;
				let pagePath =
					`pages/common/salesManagerInfo/salesManagerInfo?salesID=${this.$storage.getAppUserInfo().marketerId}&shopID=${this.$storage.getAppUserInfo().currentStoreId}`;
				let title = '很高兴为您服务';
				let desc = `${this.$storage.getAppUserInfo().businessName}客服经理`;
				// 获取动态imgUrl
				let bgData = {
					shareBgType: 6, // 分享背景图片类型
					marketerId: this.$storage.getAppUserInfo().marketerId, //客服经理id
					storeId: this.$storage.getAppUserInfo().currentStoreId, //门店id
				};
				let result = await YHBanquetOrder.GetSmallShareBgUrl(bgData);
				const {
					bgUrl
				} = result;
				imgUrl = bgUrl;
				uni.showToast({
					title: '正在打开微信...',
					icon: 'none',
				});
				console.log(webpageurl, pagePath, title, desc, imgUrl, int)
				this.$cw.sendMiniPrograme(webpageurl, pagePath, title, desc, imgUrl, int);
			}
		}
	},
	computed: {},
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
	},
};
