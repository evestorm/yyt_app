import Vue from 'vue'
import App from './App'
import pageHead from '@/components/page-head.vue'
import pageFoot from '@/components/page-foot.vue'
import Router, {RouterMount} from 'uni-simple-router';

// uniapp 组件
import swIcon from '@/components/uni-icon/uni-icon.vue'
import uniIcons from "@/components/uni-icons/uni-icons.vue";
import uLink from '@/components/uLink.vue'
import store from '@/store'

// 第三方文件引入(lib目录下的全局引入)
import _ from "@/lib/lodash/lodash.js"
import moment from "@/lib/moment/moment.min.js"

// 自定义开发文件引入(common目录下的全局引入)
import * as filters from '@/common/vue-filter/vue-filters.js'
import cw from '@/common/ceiwei/common.js'
import storage from '@/common/unistorage/index.js'
import util from '@/common/util.js'
import create from '@/common/create.js'

//----------------------------全局引入---------------------
// 扩展vue原型属性
prototypeEx(Vue);
// 添加全局过滤器
let filterObj = {}; // 全局filter obj
Object.keys(filters).forEach(key => {
  Vue.filter(key, filters[key]);
  filterObj[key] = filters[key];
});

import directives from '@/common/vue-directive/vue-directives.js';

// 扩展Vue原型
function prototypeEx(Vue){
	// vue prototype 扩展
	Vue.prototype._ = _; // 加入 lodash使用
	Vue.prototype.$moment = moment; // 加入 moment使用
	Vue.prototype.$cw = cw; // 兼容之前app的cw
	Vue.prototype.$storage = storage; // 用于存储
	Vue.prototype.$store = store; // vuex
	Vue.prototype.$util = util; // 帮助类
	Vue.prototype.$filter = filterObj; // 全局过滤
	Vue.prototype.$create = create; // js调用组件
}


//--------------------------------vue相关---------------------------------
App.mpType = 'app';
Vue.config.productionTip = false;
Vue.component('page-head', pageHead);
Vue.component('page-foot', pageFoot);
Vue.component('uLink', uLink);
Vue.component('swIcon', swIcon);
Vue.component('uniIcons', uniIcons);

//---------------------------处理路由配置-------------------------------
// 参考 http://hhyang.cn/src/router/api/routerInsatll.html#router-%E6%9E%84%E5%BB%BA%E9%80%89%E9%A1%B9
// Vue.use(Router);
// debugger;
// const router = new Router({
//     routes:ROUTES, //路由表
// 	h5:{
// 		 loading:false,
// 	},
// 	routerBeforeEach(e){
// 	},
// 	routerAfterEach(e){
// 	}
// });

// // 全局路由前置守卫
// router.beforeEach((to, from, next) => {
// 	next();
// })

// // 全局路由后置守卫
// router.afterEach((to, from) => {
// 	// 控制页面加入百度统计 统计的需要关联当前门店的ID
// 	if(to.meta&&to.meta.isBaiduCount){
// 		Vue.prototype.$util.baiduPageView(to.path);
// 	}
// })

const app = new Vue({
  store,
  ...App
});
app.$mount(); // 为了兼容小程序及app端必须这样写才有效果

// #ifdef H5
	// RouterMount(app,'#app');
// #endif

// #ifndef H5
//	app.$mount(); // 为了兼容小程序及app端必须这样写才有效果
// #endif

