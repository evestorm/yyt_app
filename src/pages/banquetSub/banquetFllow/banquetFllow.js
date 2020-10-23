import storage from '@/common/unistorage/index.js';

import CY22 from '@/service/CY/CY22AppService.js';
import CY26 from '@/service/CY/CY26AppService.js';
import YHClue from '@/service/YH/YHClueAppService.js';

import yytCollapse from '@/components/yyt-collapse/uni-collapse/uni-collapse.vue'
import yytCollapseItem from '@/components/yyt-collapse/uni-collapse-item/uni-collapse-item.vue'
import yytLoadImg from '@/components/yyt-loadimg/yyt-loadimg.vue'
import uniPopup from "@/components/uni-popup/uni-popup.vue"
const app = getApp();
export default {
	onNavigationBarButtonTap(val) { //保存按钮
		let self = this;
		console.log(this.regPhone())
		if(!this.regPhone()){
			return;
		}
		this.getUpFllow(this.queryFllow);
	},
	components: {
		yytCollapse,
		yytCollapseItem,
		yytLoadImg,
		uniPopup
	},
	data() {
		return {
			picDomain: app.globalData.PicDomain,
			queryFllow: {
				clueRemark: '', //备注
			}, //请求数据
			banquetInfo: { //获得数据
				id: "", //线索id
				clueUserName: "", //线索姓名
				clueUserPhone: "", //线索电话
				clueUserCompany: "", //单位
				clueUserBirthdayDate: "", //生日
				clueUserAddress: "", //用户住址
				clueRemark: "", //备注
				clueSourceType: '', //线索来源（1,手动录入;2,表单;3,三方平台)
				marketerID: '', //跟进人ID(CY17001)
				marketerName: '',
				clueLevel: "", //线索成交率(1,低;2,中;3,高)
				levelText: '',
				clueStatus: "1", //线索状态(1,跟进中;2,已取消;3,成交)
				clueScheduleDate: "", //档期
				clueTableCount: "", //桌数
				bakTableCount: "", //备桌数
				buUnitGUID: "", //门店id
				createdName: "", //创建人名称
				// 5	clueCancleReason:'',//取消原因
			},
			//更改等级
			index: '',
			markeIndex: '', //更改跟进人
			// clueLevel: '', //成交率
			levelText: '',
			levels: [{
				value: 1,
				text: 'C'
			}, {
				value: 2,
				text: 'B'
			}, {
				value: 3,
				text: 'A'
			}], //线索等级
			isChecked1: 0, //控制选中class
			readyTableNumLen: 2, //选择桌数长度
			isShow: true, //调换桌数和备桌数
			tableNumDesc: '', //桌数
			tableNumDesc2: '', //备桌数
			msg: '', //表单显示的桌数和备桌数
			imgarr: [], //请求图片字符串shuzu
			fllowImgList: [], //上传图片
			marketers: [], //跟进人列表
			marketer: '',
			getSalesAuthority: storage.getSalesAuthority(), //权限
			// 线索宴会类型
			bookOrderList: [],
			bookOrderName: '', //显示跟进人名
			bookOrderIndex: '', //跟进人索引
			companyNameText: '', //搜索单位
			companys: [], // 单位列表
			isCompanysShow: false, //是否显示单位列表
			customerId: '-1'
		}
	},
	async onLoad(option) {
		this.banquetInfo =getApp().globalData.banquetFllowPageData.pageData;
		this.companyNameText = this.banquetInfo.yhClue.clueUserCompany;
		this.queryFllow.id = this.banquetInfo.yhClue.id
		this.queryFllow.modifiedName = this.$storage.getAppUserInfo().userName;
		this.queryFllow.marketerID = this.$storage.getAppUserInfo().marketerID;
		// this.clueLevel = this.banquetInfo.yhClue.clueLevel;
		this.msg = `${this.banquetInfo.yhClue.clueTableCount}桌备${this.banquetInfo.yhClue.bakTableCount}`;
		this.bookOrderName = this.banquetInfo.yhClue.name;

		// this.bookOrderIndex=this.banquetInfo.yhClue.name;
		if (this.banquetInfo.yhClue.marketerName) {
			this.marketer = this.banquetInfo.yhClue.marketerName;
		}
		if (this.banquetInfo.yhClue.clueRemark) {
			this.queryFllow.clueRemark = this.banquetInfo.yhClue.clueRemark;
		}
		res=this.$storage.getBanquetMarketers();
		if(res){
			let marteterArr = [];
			this.marketers = res.slice(2);
			//定位跟进人
			let findIndex = this._(this.marketers).findIndex(x => x.marketerID == this.banquetInfo.yhClue.marketerID);
			if (findIndex == -1) {
				this.index = 0
			} else {
				this.index = findIndex;
			}
		}
		//获取线索宴会类型
		let data = {
			"pageIndex": 1,
			"pageSize": 999999,
			"order": "createTime desc ",
			"select": "new(bookOrderTypeID, name)",
			"filter": {
				"type": "and",
				"conditions": [{
					"attribute": "storeId",
					"datatype": "nvarchar",
					"operatoer": "eq",
					"value": storage.getAppUserInfo().currentStoreId,

				}]
			}

		}
		let res = await CY26.GetViewPageSelect(data);
		this.bookOrderList = res.dataList;
		//定位宴会类型
		let listIndex = this._(this.bookOrderList).findIndex(x => x.bookOrderTypeID == this.banquetInfo.yhClue.bookOrderTypeID);
		if (listIndex == -1) {
			this.bookOrderIndex = 0
		} else {
			this.bookOrderIndex = listIndex;
		}

	},
	methods: {
		// 返回上一页
		onBack() {
			// #ifdef H5
			// 当前有多少个uniapp页面栈实例，就返回多少次历史记录条数
			if (getCurrentPages().length == 1) {
				cw.backToHome(getCurrentPages().length);
			} else {
				uni.navigateBack({
					delta: 1
				})
			}
			// #endif
		},
		getImageSrc(data) { //获取组件图片的地址
			// this.fllowImgList = data;
			console.log('组件接收到得瑟',data)
			this.fllowImgList=data
		},
		nameChange() { //更改姓名
			this.queryFllow.clueUserName = this.banquetInfo.yhClue.clueUserName;
		},
		phoneChange() { //更改电话
			this.queryFllow.clueUserPhone = this.banquetInfo.yhClue.clueUserPhone;
		},
		regPhone() { //验证电话格式
			if (this.banquetInfo.yhClue.clueUserPhone) {
				// let telReg = new RegExp(/^[1][3,4,5,7,8]\d{9}$/);
				let telReg1 = new RegExp(/^[0]\d{2}([-]?)\d{8}$|^[0]\d{3}([-]?)\d{7,8}$/);
				let telReg2 = new RegExp(/^1[1234576890]\d{9}$/);
				if (!telReg1.test(this.banquetInfo.yhClue.clueUserPhone)&&!telReg2.test(this.banquetInfo.yhClue.clueUserPhone)) {
					uni.showToast({
						title: '号码格式错误',
						icon: 'none'
					})
					return false;
				}else{
					return true;
				}
			}else{
				uni.showToast({
					title: '请输入电话号码',
					icon: 'none'
				})
				return false
			}
		},
		// companyChange() { //更改公司
		// 	this.queryFllow.clueUserCompany = this.banquetInfo.yhClue.clueUserCompany;
		// },
		//
		//公司得到焦点 关闭提示
		companysShow() {
			this.isCompanysShow = true;
		},
		//公司失去焦点 关闭提示
		closeCompany() {
			setTimeout(() => {
				this.isCompanysShow = false;
			}, 0)
			this.queryFllow.clueUserCompany = this.companyNameText;
		},
		//搜索单位
		async getSearchCompany() {
			const self = this;
		
			let result=(await CY22.GetFilterEnterprise({
										cWCompanyID:storage.getAppUserInfo().cwCompanyID,
										name_like:self.companyNameText,
										quickCheckCode_like:self.companyNameText,
										})).result;
			self.companys = result.dataList;
			if (self.companys.length > 0) {
				let newName = self.companyNameText;
				self.companys.forEach(function(item) {
					if (item.companyID && newName == item.name) {
						self.queryFllow.clueUserCompany = item.name;
					} else {
						self.queryFllow.clueUserCompany = '';
					}
				})
			} else {
				self.queryFllow.clueUserCompany = self.companyNameText;
			}

		},
		// 选择单位
		gotoCompany(item) {
			this.companyNameText = item.name;
			const self = this;
			setTimeout(function() {
				self.companys = [];
			}, 1000)
		},
		addressChange() { //更改地址
			this.queryFllow.clueUserAddress = this.banquetInfo.yhClue.clueUserAddress;
		},
		// 选择生日
		chooseDate(e) {
			this.banquetInfo.yhClue.clueUserBirthdayDate = e.target.value;
			this.queryFllow.clueUserBirthdayDate = e.target.value + ' 00:00:00';
		},
		// 选择跟进人
		chooseMarketer(e) {
			this.markeIndex = e.target.value;
			this.queryFllow.marketerID = this.marketers[this.markeIndex].value;
			this.queryFllow.marketerName = this.marketers[this.markeIndex].marketerName;
			this.marketer = this.marketers[this.markeIndex].marketerName;
		},
		//选择线索宴会类型
		chooseBookOrder(e) {
			this.bookOrderIndex = e.target.value;
			this.queryFllow.name = this.bookOrderList[this.bookOrderIndex].name;
			this.queryFllow.bookOrderTypeID = this.bookOrderList[this.bookOrderIndex].bookOrderTypeID;
			this.bookOrderName = this.bookOrderList[this.bookOrderIndex].name;
		},
		// 选择档期
		chooseScheduleDate(e) {
			this.banquetInfo.yhClue.clueScheduleDate = e.target.value
			this.queryFllow.clueScheduleDate = e.target.value + ' 00:00:00';
		},
		chooseLevel(e) { //选择线索等级
			this.index = e.target.value;
			this.levelText = this.levels[this.index].text;
			this.queryFllow.clueLevel = this.levels[this.index].value;

		},
		openPopup() {
			this.$refs.tableCountChange.open()
		},
		selectExtraDesknum(num) { //选择桌数
			if (this.isShow) {
				if (this.tableNumDesc.length < 2) {
					this.tableNumDesc += num
				} else {
					uni.showToast({
						title: '超出桌数限制',
						icon: 'none'
					})
				}
			} else {
				if (this.tableNumDesc2.length < 2) {
					this.tableNumDesc2 += num
				} else {
					uni.showToast({
						title: '超出桌数限制',
						icon: 'none'
					})
				}
			}


		},
		confirm1() { //选择桌数确认键
			if (this.isShow) {
				this.isShow = false;
			} else {
				this.banquetInfo.yhClue.clueTableCount = this.tableNumDesc;
				this.banquetInfo.yhClue.bakTableCount = this.tableNumDesc2;
				this.msg = `${this.banquetInfo.yhClue.clueTableCount}桌备${this.banquetInfo.yhClue.bakTableCount}`;
				this.queryFllow.clueTableCount = this.tableNumDesc;
				this.queryFllow.bakTableCount = this.tableNumDesc2;
				this.cancel1();
			}

		},
		cancel1() { //选择桌数取消键
			this.$refs.tableCountChange.close();
			this.tableNumDesc = '';
			this.tableNumDesc2 = '';
			this.isShow = true;
		},
		async getData(i, data) { //上传图片到pic.cwyyt 获取图片地址
			let [error,uploadFileRes] = await uni.uploadFile({
				url: 'https://pic.cwyyt.cn', //仅为示例，非真实的接口地址
				fileType: 'image',
				filePath: data[i],
				name: 'file'
			});

			let path = JSON.parse(uploadFileRes.data).path;
			let str = `https://pic.cwyyt.cn${path}`;
			this.imgarr.push(str);
			this.queryFllow.historyLogImgUrls = this.imgarr.toString();
			if (++i < data.length) {
				this.getData(i, data)
			}
			if (this.imgarr.length == this.fllowImgList.length) {
				let res = await YHClue.UpdateByDto(this.queryFllow);
				if (res.length != 0) {
					//跳转
					// uni.redirectTo({
					// 	url: `/pages/banquetSub/myBanquetInfo/myBanquetInfo?id=${this.queryFllow.id}`
					// })
					uni.$emit('reloadMyBanquePage', 'refresh');
					uni.navigateBack({
						delta: 1
					});
				}

			}

		

	},
	//点击保存按钮
	async getUpFllow() {
		if (this.fllowImgList.length != 0) {
			this.queryFllow.historyLogImgUrls = this.fllowImgList.toString();
		}
		let res=await YHClue.UpdateByDto(this.queryFllow);
			if (!res.error) {
				uni.$emit('reloadMyBanquePage', 'refresh');
				uni.navigateBack({
					delta: 1
				})
			}
	}
},
watch: {
	"companyNameText": {
		handler: function(val, oldval) {
			if (val) {
				this.getSearchCompany();
			}
		}
	},
}

}
