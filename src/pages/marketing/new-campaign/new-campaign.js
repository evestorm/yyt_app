// 作者:覃彬
import GK10 from '@/service/GK/GK10AppService.js';
//------------------------------mock数据引入---------------------------
import newCampaign from './new-campaign_mock.js';

export default {
	name: 'new-campaign',
	// 注册属性
	props: {
		campaignData: {
			type: Array,
			require: false,
			default: () => [{}],
		},
	},
	created() {},
	data() {
		return {
			imgUrl: '',
		};
	},
	methods: {
		//点击分享 分享图片
		async shareQr(item) {
			this.imgUrl = '';//清空图片地址
			let data = {
				storeId: this.$storage.getAppUserInfo().currentStoreId, //门店id
				marketerId: this.$storage.getAppUserInfo().marketerId, //客服经理id
				type: item.itemType,
				iD: item.content,
			};
			let res = await GK10.DownloadShareQrCode(data);
			if (res) {
				this.imgUrl = res.completeCodePath;
				this.$refs.QRpopup.open();
			}
		}
	},
	computed: {
		calcCampaignData() {
			return this.campaignData;
		},
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
	},
};
