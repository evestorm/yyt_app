<script>
import Vue from 'vue';
import storage from '@/common/unistorage/index.js';
import moment from '@/lib/moment/moment.min.js'
import UR01 from '@/service/UR/UR01AppService.js';
import cw from '@/common/ceiwei/common.js';
import CY57 from '@/service/CY/CY57AppService.js'
export default {
	globalData: {
		regId: '', // app的registerId
		PicDomain: 'https://pic.cwyyt.cn',
		fileOnlineRead: 'http://view.xdocin.com/xdoc?_xdoc=', //XDOC文档在线预览
		userInfo: storage.getAppUserInfo(), // 用户信息
		// 公共的全局参数 用于多个页面公用的全局数据
		commonPageData:{
			isIOSAddressAuth:false,//ios是否授权使用通讯录
		},
		banquetPageData: {
			// 宴会页面全局参数
			isLoadLead: false, // 是否加载线索
			isLoadOrder: false // 是否加载订单
		},
		banquetDetailPageData: {
			execSortLike: 2 // 默认排序规则：1项目排序;2时间排序
		},
		customerPageData: {
			// 客户页面全局参数
			isLoadFollow: false, // 是否加载跟踪页
			isLoadList: false ,// 是否加载列表页
			isFollowGo:false,//是否是客户跟踪进入发短信/打电话
			fllowData:{
				customerFollowID:'',//客户跟踪单id
				phone:'',//跟踪单电话  用于多人发短信时判断是否是当前人 
			},
		},
		sendMsgPageData:{//发送短信页面全局参数
			sendRealContent:[],//发送的正式内容 用于msgTip页面YYT发短信（电话+短信内容）
			MsgMould:{},//存储 选择的短信模板
		},
		reservePageData: {
			// 预订页面全局参数
			isLoadTable: false, // 是否加载卡片
			isLoadList: false // 是否加载列表
		},
		communicationPageData: {
			// 页面全局参数
			isLoadCallRecords: false, // 是否加载通话记录
			isLoadAddressBook: false, // 是否加载通讯录
		},
		editConditionsPageData: {
			//条件编辑页面参数
			editJsonString: '' //条件数组字符串
		},
		homePageData: {
			isLoad: false,
		},
		isLogin: false,
		isGetAll: 0 ,// 0:获取个人;1:获取全部
		recordsData:{},//获取通讯录信息（仅在程序启动时获取）
		searchObj:{},//搜索页面返回预订时缓存
		banquetFllowPageData:{
			pageData:{},//页面展示数据
		},//我的线索跳转到=>线索跟踪需要的数据
		phoneCallData:{//仅在安卓情况下：记录打电话的时间和号码，只要调用打电话 就更新该参数，APP onshow时上传cy57 刷新跟踪列表
			phone:'',
			isNotFollow:'',
			beginTime:''
		}
	},
	async onLaunch() {
		// 获取权限
		cw.RequestPermissions(); // 获取授权
		let userId = storage.getAppUserId();
		if (userId) {
			// 重新登陆逻辑
			let result = await UR01.JudgeLoginAgain({ id: userId });

			if (result.isNeedAppReLogin == 1) {
				cw.logout();
			}
		}
		// 注册全局JS事件
		cw.initGlobalMethods();
		// cw.injectIOSAlias();
		// cw.injectAndroidAlias();
		
		// sendMsg页面要清空发短信的数据 这个要做gobalData方式去弄
		// storage.removeCustomers();
		// storage.removeMsgMould();
		
		//启动获取通讯录
		cw.getRecordsData();//获取通讯录   启动更新全局IOS授权信息
		
		// 清除iOS角标
		cw.cleanBadge();
	},
	async onShow() {
		let userId = storage.getAppUserId();
		if (!userId) {
			uni.reLaunch({
				url: '/pages/homePageSub/login/login'
			});
		}
		//在安卓时 phoneCallData如果有值时 需要请求上传cy57
		if(cw.isApp(false)&&cw.isAndroid()&&getApp().globalData.phoneCallData.phone!=''&&getApp().globalData.phoneCallData.beginTime!=''){
			let phone=getApp().globalData.phoneCallData.phone;
			let beginTime=getApp().globalData.phoneCallData.beginTime;
			let phoneRes=JSON.parse(YYT.GetPhoneCallSucceedResult(phone,beginTime,'2999-12-30 00:00:00'));
			if(!this._.isEmpty(phoneRes)){
				let seconds=phoneRes[0].talkTime;
				let userInfo = storage.getAppUserInfo()
				let data = {
					customerId: '',
					storeId: userInfo.currentStoreId,
					cWCompanyId: userInfo.userCWCompanyID,
					marketerId: userInfo.marketerId,
					callType: 2, // 1-呼入，2-呼出，3-短信 4-电话未接通 5-微信发送 6-收到短信
					phone: phone,
					beginTime: moment().format('YYYY-MM-DD HH:mm:ss'),
					endTime: moment().add(seconds || 0, 's').format('YYYY-MM-DD HH:mm:ss'), // 5s后
					talkTime: seconds || 0,
					isNotFollow:getApp().globalData.phoneCallData.isNotFollow,//是否跟踪
				}
				let res=await CY57.CreateByDto(data)
				if(res){
					//清空
					getApp().globalData.phoneCallData.phone='';
					getApp().globalData.phoneCallData.beginTime='';
					getApp().globalData.phoneCallData.isNotFollow='';
					uni.$emit('refreshCustomFollow'); //跟新跟踪列表
				}
			}
		}
	}
};
</script>

<style lang="less">
@import 'lib/colorui/main.css';
@import 'lib/colorui/icon.css';
/* #ifndef APP-PLUS-NVUE */
/* uni.css - 通用组件、模板样式库，可以当作一套ui库应用 */
@import './common/css/uni.css';
/* iconfont.css  */
@import './common/css/iconfont.css';
/* 自定义 checkbox 样式 */
@import './common/css/checkbox-style.css';
/* UI基础库 */
@import '/common/css/ui-main.css';
/* 原项目中common.css */
@import './common/css/common.css';
@import './common/css/yyt-common.less';

/* 解决 v-show 无法控制显示隐藏的bug */
view[hidden],
navigator[hidden] {
	display: none !important;
}

/* 以下样式用于 hello uni-app 演示所需 */
page {
	background-color: #f2f2f2;
	height: 100%;
	font-size: 28upx;
	line-height: 1.8;
	user-select: text;
}

.uni-header-logo {
	padding: 30upx;
	flex-direction: column;
	justify-content: center;
	align-items: center;
	margin-top: 10upx;
}

.uni-header-image {
	width: 100px;
	height: 100px;
}

.uni-hello-text {
	color: #7a7e83;
}

.uni-hello-addfile {
	text-align: center;
	line-height: 300upx;
	background: #fff;
	padding: 50upx;
	margin-top: 10px;
	font-size: 38upx;
	color: #808080;
}
.uni-page-head-ft {
	margin-right: 30rpx;
}
.uni-progress-inner-bar {
	border-radius: 12rpx !important;
}
uni-checkbox .uni-checkbox-input {
	border-radius: 20% !important;
	color: #ffffff !important;
}

uni-checkbox .uni-checkbox-input.uni-checkbox-input-checked {
	color: #fff;
	border-color: #0183ff;
	background: #0183ff;
}
uni-checkbox .uni-checkbox-input.uni-checkbox-input-checked:after {
	font-size: 18px;
}
uni-radio::before,
uni-checkbox::before {
	font-weight: bolder;
}
.uni-list-cell {
	justify-content: flex-start;
}
.uni-list-cell-pd {
	padding: 22rpx 44rpx;
	border-bottom: 1px solid #f3f3f3;
}
// 更改进度条圆角
.uni-progress-bar {
	border-radius: 12rpx !important;
}
/* #endif*/
</style>
