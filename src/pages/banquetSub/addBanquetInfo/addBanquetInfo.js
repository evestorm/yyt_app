import {
	mapState,
	mapMutations,
	mapActions
} from 'vuex';
import YHClue from '@/service/YH/YHClueAppService.js'
import CY26 from '@/service/CY/CY26AppService.js'
import CY22 from '@/service/CY/CY22AppService.js';

export default {
	async onNavigationBarButtonTap() {
		let data = this._.cloneDeep(this.banquetFormData);
		data.clueLevel = parseInt(data.clueLevel) + 1;
		data.clueUserCompany = this.companyNameText;
		data.clueUserBirthdayDate = data.clueUserBirthdayDate && data.clueUserBirthdayDate + ' 00:00:00';
		data.clueScheduleDate = data.clueScheduleDate && data.clueScheduleDate + ' 00:00:00';
		if (data.clueUserName && data.clueUserPhone) { //验证电话格式和用户名不能为空去掉空格,
			let telReg1 = new RegExp(/^[0]\d{2}([-]?)\d{8}$|^[0]\d{3}([-]?)\d{7,8}$/);
			let telReg2 = new RegExp(/^1[1234576890]\d{9}$/);
			//获取门店id
			data.buUnitGUID = this.$storage.getAppUserInfo().currentStoreId;
			data.createdName = this.$storage.getAppUserInfo().userName;
			if (!telReg1.test(data.clueUserPhone) && !telReg2.test(data.clueUserPhone)) {
				uni.showToast({
					title: '号码格式错误',
					icon: 'none'
				})
			} else {
				let res = await YHClue.CreateByDto(data);
				if (res) {
					//跳转
					uni.$emit('reloadPage', 'refresh');
					uni.switchTab({
						url: '/pages/banquet/banquet'
					});
				}
			}
		} else {
			uni.showToast({
				title: '请输入必填字段',
				icon: 'none'
			})
		}
	},
	data() {
		return {
			picDomain: getApp().globalData.PicDomain,
			// ------------------------------------页面显示线索参数-----------------------------
			banquetFormData: { //线索信息
				clueUserName: "", //线索姓名
				clueUserPhone: "", //线索电话
				clueUserCompany: "", //单位
				clueUserBirthdayDate: "", //生日
				clueUserAddress: "", //用户住址
				clueRemark: "", //备注
				clueSourceType: '1', //线索来源（1,手动录入;2,表单;3,三方平台)
				marketerID: '', //跟进人ID(CY17001)
				clueLevel: 0, //线索成交率(1,低C;2,中B;3,高 A)
				levelText: 'C',
				clueStatus: "1", //线索状态(1,跟进中;2,已取消;3,成交)
				clueScheduleDate: "", //档期
				clueTableCount: "", //桌数
				bakTableCount: "", //备桌数
				buUnitGUID: "", //门店id
				createdName: "", //创建人名称
				coordinatorId: '',
				bookOrderTypeID: '', //宴会类型
			},
			// ------------------------------------picker弹窗相关数组-----------------------------
			levels: [{ //线索等级
				value: '0',
				text: 'C'
			}, {
				value: '1',
				text: 'B'
			}, {
				value: '2',
				text: 'A'
			}], //线索等级
			marketers: [], //跟进人列表
			index: '', //选择的跟进人下标
			readyTableNumLen: 100, //选择备用桌数限制
			readyTableNum: 100, //选择桌数限制
			// 线索宴会类型
			bookOrderList: [],
			bookOrderIndex: '', //跟进人索引
			companyNameText: '', //搜索单位
			companys: [], // 单位列表
			isCompanysShow: false, //是否显示单位列表
		};
	},
	async onLoad() {
		this.marketers = this.$storage.getBanquetMarketers() && this.$storage.getBanquetMarketers().slice(2);
		//初始化选择的客服经理---picker定位
		this.banquetFormData.marketerID = this.$storage.getAppUserInfo().marketerId;
		this.index = this._.findIndex(this.marketers, x => this.banquetFormData.marketerID == x.marketerID);
		this.GetViewPageSelect(); //获取宴会类型
	},
	computed: {
		...mapState({
			userInfo: state => state.user.userInfo,
		}),
		marketerText() { //选择跟进人展示
			if (this.banquetFormData.marketerID) {
				let result = this._.filter(this.marketers, x => x.marketerID === this.banquetFormData.marketerID);
				return result[0].marketerName;
			}
		},
		bookOrderName() { //宴会类型展示
			console.log(this.banquetFormData.bookOrderTypeID)
			if (this.banquetFormData.bookOrderTypeID) {
				let result = this._.filter(this.bookOrderList, x => x.bookOrderTypeID == this.banquetFormData.bookOrderTypeID);
				return result[0].name;
			}
		},
		msg() { //表单显示的桌数和备桌数
			return this.banquetFormData.clueTableCount ?
				`${this.banquetFormData.clueTableCount}桌备${this.banquetFormData.bakTableCount}` : ''
		},
	},
	methods: {
		// 选择生日
		chooseDate(e) {
			this.banquetFormData.clueUserBirthdayDate = e.target.value;
		},
		//公司失去焦点 关闭提示
		closeCompany() {
			setTimeout(() => {
				this.isCompanysShow = false;
			}, 0)
			this.banquetFormData.clueUserCompany = this.companyNameText;
		},
		// 选择单位
		gotoCompany(item) {
			this.companyNameText = item.name;
			setTimeout(() => {
				this.companys = [];
			}, 1000)
		},
		//选择线索宴会类型
		chooseBookOrder(e) {
			this.bookOrderIndex = e.target.value;
			this.banquetFormData.bookOrderTypeID = this.bookOrderList[this.bookOrderIndex].bookOrderTypeID;
		},
		// 选择档期
		chooseScheduleDate(e) {
			this.banquetFormData.clueScheduleDate = e.target.value;
		},
		// 选择跟进人
		chooseMarketer(e) {
			this.index = e.target.value;
			this.banquetFormData.marketerID = this.marketers[this.index].value;
		},
		chooseLevel(e) { //选择线索等级
			let index = e.target.value;
			this.banquetFormData.clueLevel = this.levels[index].value;
			this.banquetFormData.levelText = this.levels[index].text;
		},
		openPopup() { //打开选择桌数弹窗
			this.$refs.addTableCount.openPopup()
		},
		tableNum(obj) { //获取选择桌数弹窗组件传来的桌数
			this.banquetFormData.clueTableCount = obj.tableNum;
			this.banquetFormData.bakTableCount = obj.tableLenNum;
		},
		//搜索单位
		async getSearchCompany() {
			let result = (await CY22.GetFilterEnterprise({
				cWCompanyID: this.$storage.getAppUserInfo().cwCompanyID,
				name_like: this.companyNameText,
				quickCheckCode_like: this.companyNameText,
			})).result;
			this.companys = result.dataList;
			if (this.companys.length > 0) {
				let newName = this.companyNameText;
				this.companys.forEach((item) => {
					if (item.companyID && newName == item.name) {
						this.banquetFormData.clueUserCompany = item.name;
					} else {
						this.banquetFormData.clueUserCompany = '';
					}
				})
			} else {
				this.banquetFormData.clueUserCompany = this.companyNameText;
			}
		},
		async GetViewPageSelect() { //获取线索宴会类型
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
						"value": this.$storage.getAppUserInfo().currentStoreId,
					}]
				}
			}
			let res = await CY26.GetViewPageSelect(data);
			if (res) {
				this.bookOrderList = res.dataList;
			}
		}
	},
	watch: {
		"companyNameText": {
			handler(val, oldval) {
				if (val) {
					this.getSearchCompany();
				}
			}
		},
	}
}
