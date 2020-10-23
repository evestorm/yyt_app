import addressBook from '@/pages/customerSub/addressBook/addressBook.vue';
import callRecords from '@/pages/customerSub/callRecords/callRecords.vue';

import storage from '@/common/unistorage/index.js';
export default {
	data() {
		return {
			// ttl: [{
			// 	title: '通话记录'
			// }, {
			// 	title: '通讯录'
			// }],
			isactive: -1,
			// tabbar被顶起
			windowHeight: '',
			isLoadAddressBook: getApp().globalData.communicationPageData.isLoadAddressBook,
			isiOS: false,
		};
	},
	watch: {

	},
	components: {
		callRecords,
		addressBook,
	},
	onPageScroll(obj) {
		uni.$emit('communicationScroll', obj);
	},
	onLoad(option) {
		this.isiOS = this.$cw.isiOS();
		// console.log(storage.getBanquetIsactive());
		// this.isactive=storage.getBanquetIsactive()
		// 监听键盘弹起导致的resiez事件
		uni.getSystemInfo({
			success: res => {
				this.windowHeight = res.windowHeight;
			}
		});
		uni.onWindowResize(res => {
			if (res.size.windowHeight < this.windowHeight) {
				uni.hideTabBar({});
			} else {
				uni.showTabBar({});
			}
		});
		this.storeId = storage.getAppUserInfo().currentStoreId;
	},
	onUnload() {
		// 清除通讯录滚动锚点记录
		this.$storage.removeABScrollTop();
		getApp().globalData.communicationPageData.isLoadAddressBook = false;
	},
	onShow() {
		this.storeId = storage.getAppUserInfo().currentStoreId;
	},
	computed: {
		ttl() {
			let arr = [{
				title: '通话记录',
				idx: 0
			}, {
				title: '通讯录',
				idx: 1
			}];
			// iOS拿不到通话记录
			if (this.$cw.isiOS()) {
				arr = arr.filter(v => v.title != '通话记录')
				// 手动调用一遍
				this.onactive(arr[0].idx)
			}
			this.isactive = this.isactive == -1 ? arr[0].idx + '' : this.isactive;
			return arr;
		}
	},
	methods: {
		onactive(data) {
			this.isactive = data;
			if (this.isactive == 1) {
				if (getApp().globalData.communicationPageData.isLoadAddressBook == false) {
					getApp().globalData.communicationPageData.isLoadAddressBook = true;
					this.isLoadAddressBook = true;
				}
			}
		},
		// 导航返回
		onBack() {
			// 清除通讯录滚动锚点记录
			this.$storage.removeABScrollTop();
			getApp().globalData.communicationPageData.isLoadAddressBook = false;
			uni.navigateBack({
				delta: 1
			});
		},
	},
	watch: {
		isactive(val) {
			if (val == 0) {
				this.$refs.callRecords && (this.$refs.callRecords.getCallRecords());
			}
		}
	}
};
