// 作者:杨亮

//------------------------------mock数据引入---------------------------
import recordItem from './item_mock.js';

//-------------------------Service引入----------------------------------
// import CY17 from '@/service/CY/CY17AppService.js';

//-----------------------其他引入-------------------------------------
import storage from '@/common/unistorage/index.js' // 缓存引入

// 常量
let PageConstData = {
	// 缓存数据
	//cacheData: {
	//    userInfo: storage.getUserInfo()
	//}
}

export default {
	name: 'recordItem',
	// 注册属性
	props: {
		item: {
			type: Object,
			require: true,
			default: () => ({}),
		},
		loading: {
			type: Boolean,
			require: false,
			default: false
		}
	},
	// 组件创建生命周期 这个时候 vue对象已经创建好 可以访问data和method数据
	created() {},
	// 负责程序中需要进行set的数据
	data() {
		return {
			//---------------------常量------------------------
			PageConstData,
		};
	},
	// 负责和页面事件进行交互
	methods: {
		// 跳转到对应的页面
		_userMessagePageUrl(item) {
			let pageUrl = item.userMessagePageUrl;
			//跳转的有跳tab页和普通个页面 需要区分开，暂时tab只有banquet/customer/homePage/marketing/my 五个/tab页用switch跳转/普通页面由navigation跳
			if (pageUrl.includes('pages/customer/customer') || pageUrl.includes('pages/banquet/banquet') || pageUrl.includes(
					'pages/homePage/homePage') || pageUrl.includes('pages/marketing/marketing') || pageUrl.includes('pages/my/my')) {
				uni.switchTab({
					url: pageUrl
				})
			} else {
				uni.navigateTo({
					url: pageUrl
				})
			}
			this.$emit('updateItem', item.id)
		},
	},
	// 不要set的数据 统一用computed实现(能用computed 实现的 尽量用他实现 不要用data和method处理) 
	computed: {
		items() {
			return this._.cloneDeep(this.item);
		},
	},
	// 负责格式化数据
	filters: {
		// parseScene(value) {
		// return value+'123';
		// }
	},
	// 负责数据变化后需要和接口交互
	watch: {
		// "currentStore.storeId": {
		//    handler(val, oldval) {
		//        if (val) {
		//        }
		//    }
		// }
	},
};
