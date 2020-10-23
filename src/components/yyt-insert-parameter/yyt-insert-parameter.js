// 作者:覃彬
import CY68 from '@/service/CY/CY68AppService.js';
// import GK10 from '@/service/GK/GK10AppService.js';
export default {
	name: 'yyt-insert-parameter',
	// 注册属性
	props: {
		isNormalParame: { //是否获取常规参数
			type: Boolean,
			require: true,
			default: true
		},
		btnStyle: { //按钮样式：蓝背景 blueBackground  蓝色边框白背景blueBorder
			type: String,
			default: 'blueBackground',
			require: false,
		},
		isAddParame: { //是否获取附加参数
			type: Boolean,
			default: false,
			require: false,
		},
		// 营销参数
		// isShareParame: { //是否获取营销页参数
		// 	type: Boolean,
		// 	require: false,
		// },
		
	},
	mounted() {
		// console.log(this.isNormalParame, this.isAddParame)
		// 监听 isAddParame 变化后再请求
		// this.isNormalParame && this.getCommonParameters();
		// this.isAddParame && this.getExtraParameters();
		// this.isShareParame && this.getShareInfo(); （不用调）
	},
	data() {
		return {
			// ----------------------插入参数--------------------
			shortModal: false, //是否打开参数弹窗 默认false
			extraParameters: [],
			commonParameters: [],
			// -----------------------插入分享内容-----------------
			// shareQueryData: { //分享内容请求参数
			// 	cWCompanyID: this.$storage.getAppUserInfo() ? this.$storage.getAppUserInfo().cwCompanyID : '', //企业ID(UR07001)
			// 	pageIndex: 1,
			// 	pageSize: 999,
			// 	storeId: this.$storage.getAppUserInfo() ? this.$storage.getAppUserInfo().currentStoreId : '', //门店id(GZH09001)
			// 	type: 1 //类型(1 营销页，2会员卡，3优惠券)
			// },
			// shareType: [{
			// 		lable: '营销页',
			// 		value: 1
			// 	},
			// 	{
			// 		lable: '会员卡',
			// 		value: 2
			// 	},
			// 	{
			// 		lable: '优惠券',
			// 		value: 3
			// 	}
			// ], //分享码类型
			// selShareData: { //选择的分享参数
			// 	shareCodeId: '', //活动id
			// 	// shareCodeType:0//分享码类型
			// },
			// shareDataList: {}, //分享码数据
		}
	},
	methods: {
		// --------------------------------------插入参数------------------------------------
		// 获取常规数数据
		async getCommonParameters () {
			let data = {
				pageIndex: 1,
				pageSize: 999,
				order: 'MessageTemplateParamID desc',
				paramType: '全部'
			}
			let result = (await CY68.GetTemplateParameterFilter(data,null,null,false)).result.dataList;
			if (result) {
				let index = this._(result).findIndex(x => x.paramDesc == '分享内容'); //删除分享内容
				if (index != -1) {
					result.splice(index, 1);
				}
				this.commonParameters = result;
				// console.log(this.extraParameters);
			}
		},
		//获取附加参数数据
		async getExtraParameters() {
			let data = {
				pageIndex: 1,
				pageSize: 999,
				order: 'MessageTemplateParamID desc',
				paramType: '预订通知'
			}
			let result = (await CY68.GetTemplateParameterFilter(data,null,null,false)).result.dataList;
			if (result) {
				this.extraParameters = result;
				// console.log(this.commonParameters)
			}
		},
		//选择常规参数
		_onSelectCommonParam(item) {
			let addStr = '【' + item.paramDesc + '】';
			this.$emit('addStr', addStr);
			this.shortModal = false;
		},
		//选择附加参数
		_onSelectExtraParam(item) {
			let addStr = '【' + item.paramDesc + '】';
			this.$emit('addStr', addStr);
			this.shortModal = false;
		},

		// ----------------------------------------------插入分享内容--------------------------------
		// async getShareInfo() { //获取营销页详情
		// 	let radata = await GK10.GetShareInfo(this.shareQueryData);
		// 	if (radata) {
		// 		this.shareDataList = radata;
		// 	}
		// },
		// showPopup() {
		// 	this.$refs.selShare.open();
		// },
		// changeSelType(type) { //改变选择分享类容类型
		// 	this.shareQueryData.type = type;
		// 	this.selShareData.shareCodeType = type;
		// 	this.getShareInfo();
		// },
		// //关闭分享码弹窗
		// shareCancel() {
		// 	this.$refs.selShare.close();
		// },
		// //点击插入分享参数 弹窗确认键
		// _onShareParam() {
		// 	this.selShareData.addStr = '【分享内容】'
		// 	this.$emit('shareParame', this.selShareData);
		// }
	},
	computed: {
		// sharepageList() { //营销参数内容
		// 	if (!this._.isEmpty(this.shareDataList)) {
		// 		let arr = [];
		// 		switch (this.shareDataList.type) {
		// 			case 1:
		// 				let arr1 = this.shareDataList.marketSet.dataList;
		// 				arr1.forEach((item, index) => {
		// 					let obj = {}
		// 					obj.text = item.marketSetName;
		// 					obj.shareCodeId = item.marketSetID;
		// 					arr.push(obj);
		// 				})
		// 				break;
		// 			case 2:
		// 				let arr2 = this.shareDataList.hyCard.dataList;
		// 				arr2.forEach((item, index) => {
		// 					let obj = {}
		// 					obj.text = item.hyCardTitle;
		// 					obj.shareCodeId = item.hyCardID;
		// 					arr.push(obj);
		// 				})
		// 				break;
		// 			case 3:
		// 				let arr3 = this.shareDataList.smallProgramCard.dataList;
		// 				arr3.forEach((item, index) => {
		// 					let obj = {}
		// 					obj.text = item.cardName;
		// 					obj.shareCodeId = item.smallProgramCardID;
		// 					arr.push(obj);
		// 				})
		// 				break;
		// 			default:
		// 				break;
		// 		}
		// 		return arr;
		// 	}
		// }
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
		isAddParame: {
			handler(val, oldval) {
				if (val) {
					this.getExtraParameters();
				}
			},
			immediate: true
		},
		isNormalParame: {
			handler(val, oldval) {
				if (val) {
					this.getCommonParameters();
				}
			},
			immediate: true
		}
	}
};
