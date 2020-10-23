// 作者:覃彬

//------------------------------mock数据引入---------------------------
import yytQRshareImg from './yyt-qr-share-img_mock.js';

export default {
	name: 'yyt-qr-share-img',
	// 注册属性
	props: {
		imgUrl: {//图片的网络地址
			type: String,
			require: true,
			default: ''
		},
	},
	data() {
		return {
			isOpen: false
		};
	},
	created() {},
	methods: {
		downLoadR() { //下载图片
			if (this.$cw.isApp(false)) {
				this.$cw.savePhoto(this.imgUrl);
				this.close();
			}
		},
		sendWXImg() { //分享至微信好友
			this.$cw.sendWXImageMessage(this.imgUrl)
		},
		open() { //打开弹窗
			this.isOpen = true;
		},
		close() { //关闭弹窗
			this.isOpen = false;
		},
	},
	computed: {},
	filters: {},
	watch: {
		// "currentStore.storeId": {
		//    handler(val, oldval) {
		//        if (val) {
		//        }
		//    }
		// }
	},
};
