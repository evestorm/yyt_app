// 作者:杨亮

//------------------------------mock数据引入---------------------------
import recordItem from './recordItem_mock.js';

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
	},
	// 组件创建生命周期 这个时候 vue对象已经创建好 可以访问data和method数据
	created() {},
	// 负责程序中需要进行set的数据
	data() {
		return {
			//---------------------常量------------------------
			PageConstData,

			//---------------------接口输入输出 接口名称+in/out 命名 列如接口名称是getStudentList----------------------
			//getStudentListIn: {
			//    pageIndex: 1, // 第几页
			//    pageSize: 5, // 每页多少条
			//    sarchValue: '', // 查询条件  目前是根据学生姓名和班级姓名查找
			//    isAppend: true // 控制是滚动底部刷新 还是上拉加载
			//},
			//// 列表数据参数 对应 demoIndexMock.getStudentListOut
			//getStudentListOut: {
			//    dataList: [], // 返回的data数据
			//    pageCount: 0, // 多少页
			//    rowCount: 0 // 总共多少数据
			//},

			//-----------------------------页面参数------------------------
			title: {},
		};
	},
	// 负责和页面事件进行交互
	methods: {
		// 注册事件 注意 暴露给外面的事件 以_on开头 里面的事件不用
		_onClick() {
			this.$emit('onClick');
		},
	},
	// 不要set的数据 统一用computed实现(能用computed 实现的 尽量用他实现 不要用data和method处理) 
	computed: {
		items() {
			return this._.cloneDeep(this.inputItems);
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
