import short from '@/components/yyt-short/yyt-short.vue';
import GK10 from '@/service/GK/GK10AppService.js';
import CY67 from '@/service/CY/CY67AppService.js';
import CY69 from '@/service/CY/CY69AppService.js';
import swIcon from '@/components/uni-icon/uni-icon.vue';
import storage from '@/common/unistorage/index.js';
const app = getApp();

// 「预订通知」两个都显示；「跟踪短信」只显示常规

export default {
	data() {
		return {
			picDomain: app.globalData.PicDomain,
			title: '', //标题
			//传过来的id值
			id: '',
			num: 0, // 模板类型索引
			// shortModal: false,
			messageTemplateTitle: ['预订通知', '跟踪短信'],
			rulesCode: [], //模板跟踪规则
			//接口获取的参数
			messageTemplateForm: {
				storeID: storage.getAppUserInfo().currentStoreId,
				messageTemplateType: 1,
				messageTemplateContent: '',
				isEnable: 1,
				// ruleCode: '',//跟踪规则 暂时废弃
				messageTemplateTitle: '',
			},
			cursorPos: -1, // 光标位置
			isFocus: false, // 是否聚焦
			// --------------------分享模板参数---------------------
			shareType: [{
					lable: '营销页',
					value: 1
				},
				{
					lable: '会员卡',
					value: 2
				},
				{
					lable: '优惠券',
					value: 3
				}
			], //分享码类型
			shareQueryData: { //请求参数
				cWCompanyID: this.$storage.getAppUserInfo() ? this.$storage.getAppUserInfo().cwCompanyID : '', //企业ID(UR07001)
				pageIndex: 1,
				pageSize: 999,
				storeId: this.$storage.getAppUserInfo() ? this.$storage.getAppUserInfo().currentStoreId : '', //门店id(GZH09001)
				type: 1 //类型(1 营销页，2会员卡，3优惠券)
			},
			selShareData: { //选择的分享参数
				shareCodeId: '', //活动id
				// shareCodeType:0//分享码类型
			},
			shareDataList: {}, //分享码数据
			// ---------------------插入参数组件相关参数------------------------
			isNormalParame: true, //是否插入常规参数
			isAddParame: true, //是否插入附加参数
			// ---------------------短信预览相关相关参数------------------------
			simulationTemplate: '此处展示模拟短信内容', //预览短信内容
			isShowTSimulation: false, //是否显示预览数据
		};
	},
	components: {
		short,
		swIcon
	},
	onLoad(payload) {
		if (payload.id) {
			this.id = payload.id;
		} else {
			this.id = '';
		}
		let id = this.id;
		if (id) {
			this.title = "编辑模板"
			this.getTempletInfo(id);
		} else {
			this.title = "新增模板"
			// this.getRulesCode();
			//如果没有id时默认请求type为1时的活动
			this.selShareData.shareCodeType = 1;
			this.getShareInfo();
			
		}
	},
	methods: {
		onBack() {
			uni.navigateBack({
				delta: 1
			})
		},
		//是否选择的switch
		changeSex(e) {
			const Idx = e.detail.value;
			this.messageTemplateForm.isEnable = Idx ? 1 : 0;
		},
		selectShare() {
			this.$refs.selShare.open();
		},
		// 获取模板信息
		async getTempletInfo(id) {
			let self = this;
			let data = id;
			let result = await CY67.GetDto(data);
			self.messageTemplateForm.id = result.id;
			self.messageTemplateForm.isEnable = result.isEnable;
			self.messageTemplateForm.messageTemplateType = result.messageTemplateType;
			// self.messageTemplateForm.ruleCode = result.ruleCode;
			self.messageTemplateForm.messageTemplateTitle = result.messageTemplateTitle;
			self.messageTemplateForm.messageTemplateContent = result.messageTemplateContent;
			self.num = self.messageTemplateForm.messageTemplateType - 1;
			let isStartUse = self.messageTemplateForm.isEnable;
			// self.getRulesCode(self.messageTemplateForm.ruleCode);
			//获取得到的分享码类型和id:
			this.selShareData.shareCodeId = result.shareCodeID ? result.shareCodeID : '';
			this.selShareData.shareCodeType = result.shareCodeType ? result.shareCodeType : 1;
			//获取分享码活动信息
			this.shareQueryData.type = result.shareCodeType ? result.shareCodeType : 1;
			this.getShareInfo();
			this.isAddParame = self.num == 1 ? false : true;
		},
		// 获取模板跟踪规则
		// async getRulesCode(ruleCodes) { // ruleCode: "CR005,CR006"
		// 	let self = this;

		// 	let ruleCodeArry = ruleCodes ? ruleCodes.split(',') : null;
		// 	for (let i in ruleCodeArry) {
		// 		for (let j in self.rulesCode) {
		// 			if (ruleCodeArry[i] == self.rulesCode[j].code) {
		// 				this.$set(self.rulesCode[j], 'active', true);
		// 			}
		// 		}
		// 	}
		// 	// 获取
		// 	let result = await CY69.GetAllStoreSettingTemplate({});

		// 	self.rulesCode = result.items;
		// 	// 非H5先用假数据
		// 	// self.rulesCode = this.getMockData();

		// 	let ruleCodeArrytwo = ruleCodes ? ruleCodes.split(',') : null;
		// 	for (let i in ruleCodeArrytwo) {
		// 		for (let j in self.rulesCode) {
		// 			if (ruleCodeArrytwo[i] == self.rulesCode[j].code) {
		// 				this.$set(self.rulesCode[j], 'active', true);
		// 			}
		// 		}
		// 	}

		// 	// //接口为get，异常报错，等接口改为post再改
		// 	// SalesTargetSetting.ruleconfig({}, result => {
		// 	// 	// H5才支持 eval
		// 	// 	// #ifdef H5
		// 	// 	self.rulesCode = eval('(' + result + ')').items;
		// 	// 	// #endif
		// 	// 	// 非H5先用假数据
		// 	// 	self.rulesCode = this.getMockData();

		// 	// 	let ruleCodeArry = ruleCodes ? ruleCodes.split(',') : null;
		// 	// 	for (let i in ruleCodeArry) {
		// 	// 		for (let j in self.rulesCode) {
		// 	// 			if (ruleCodeArry[i] == self.rulesCode[j].code) {
		// 	// 				this.$set(self.rulesCode[j], 'active', true);
		// 	// 			}
		// 	// 		}
		// 	// 	}
		// 	// })
		// },
		// 上面方法的假数据，到时候请求变成POST且JSON为标准格式时去掉该方法
		// getMockData() {
		// 	return [{
		// 			code: 'CR001',
		// 			name: '宴会追踪', //规则名称
		// 			targetType: '1', //1宴会 2客户 3散客
		// 			isLoss: false, //是否计算流失
		// 			desc: '设置宴会机会的追踪次数和间隔',
		// 			weight: 0,
		// 			params: [{
		// 					key: 'v1',
		// 					name: '目标次数'
		// 				},
		// 				{
		// 					key: 'v2',
		// 					name: '跟踪间隔'
		// 				},
		// 				{
		// 					key: 'v3',
		// 					name: '提前月份'
		// 				}
		// 			]
		// 		},
		// 		{
		// 			code: 'CR002',
		// 			name: '机会挖掘', //规则名称
		// 			targetType: '1', //1宴会 2客户 3散客
		// 			isLoss: false, //是否计算流失
		// 			desc: '设置销售自己挖掘补充到系统的宴会机会提前通知天数',
		// 			params: [{
		// 				key: 'v1',
		// 				name: '提前通知天数'
		// 			}]
		// 		},
		// 		{
		// 			code: 'CR003',
		// 			name: '客户池流失', //规则名称
		// 			targetType: '2', //1宴会 2客户 3散客
		// 			isLoss: true, //是否流失
		// 			desc: '设置客户池流失分摊的天数',
		// 			params: [{
		// 				key: 'v1',
		// 				name: '均分天数'
		// 			}]
		// 		},
		// 		{
		// 			code: 'CR004',
		// 			name: '客户池未到店', //规则名称
		// 			targetType: '2', //1宴会 2客户 3散客
		// 			isLoss: false, //是否流失
		// 			desc: '设置客户池中未到店客户的追踪平均分摊到前几天进行跟踪',
		// 			params: [{
		// 				key: 'v1',
		// 				name: '均分天数'
		// 			}]
		// 		},
		// 		{
		// 			code: 'CR005',
		// 			name: '生日宴', //规则名称
		// 			targetType: '1', //1宴会 2客户 3散客
		// 			isLoss: false, //是否流失
		// 			desc: '设置生日宴提醒的规则',
		// 			params: [{
		// 					key: 'v1',
		// 					name: '提醒生日（多个,号隔开）'
		// 				},
		// 				{
		// 					key: 'v2',
		// 					name: '提前天数'
		// 				}
		// 			]
		// 		},
		// 		{
		// 			code: 'CR006',
		// 			name: '生日提醒', //规则名称
		// 			targetType: '1', //1宴会 2客户 3散客
		// 			isLoss: false, //是否流失
		// 			desc: '设置生日提醒的规则',
		// 			params: [{
		// 				key: 'v1',
		// 				name: '提前天数'
		// 			}]
		// 		},
		// 		{
		// 			code: 'CR007',
		// 			name: '散客流失', //规则名称
		// 			targetType: '2', //1宴会 2客户 3散客
		// 			isLoss: false, //是否流失
		// 			desc: '设置散客流失提醒规则，相比上月少于多少次进行提醒',
		// 			params: [{
		// 					key: 'v1',
		// 					name: '流失次数'
		// 				},
		// 				{
		// 					key: 'v2',
		// 					name: '均分天数'
		// 				}
		// 			]
		// 		},
		// 		{
		// 			code: 'CR008',
		// 			name: '价值流失', //规则名称
		// 			targetType: '2', //1宴会 2客户 3散客
		// 			isLoss: false, //是否流失
		// 			desc: '设置价值客户流失提醒',
		// 			params: [{
		// 				key: 'v1',
		// 				name: '无参数'
		// 			}]
		// 		}
		// 	];
		// },
		// 保存模板信息
		async saveTempletInfo(id) {
			let self = this;
			let data = self.messageTemplateForm;
			// data.isEnable = data.isEnable == 1 ? '1' : '0';
			data.messageTemplateContent = self.messageTemplateForm.messageTemplateContent;
			// data.ruleCode = self.messageTemplateForm.messageTemplateType == 2 ? data.ruleCode.replace(/,$/g, '') : '';
			if (!data.messageTemplateTitle || data.messageTemplateTitle == null) {
				uni.showToast({
					title: '请输入模板标题',
					icon: 'none'
				});
				return;
			}
			if (!data.messageTemplateContent) {
				uni.showToast({
					title: '请输入模板内容',
					icon: 'none'
				});
				return;
			}
			if (!data.messageTemplateType) {
				uni.showToast({
					title: '请选择模板类型',
					icon: 'none'
				});
				return;
			}
			// if (data.messageTemplateType == '2') {
			// 	if (!data.ruleCode || data.ruleCode == 'null') {
			// 		uni.showToast({
			// 			title: '请选择可用跟踪规则',
			// 			icon: 'none'
			// 		});
			// 		return;
			// 	}
			// }
			if (id) {
				data.id = id;
				let res = await CY67.UpdateByDto(data);
				if (res) {
					uni.showToast({
						title: '编辑模板成功',
						duration: 2000
					});
					uni.$emit('refreshTempleList', 'refresh');
					uni.navigateBack({
						delta: 1
					})
				}


			} else {
				let res = await CY67.CreateByDto(data);
				if (res) {
					uni.showToast({
						title: '新增模板成功',
						duration: 2000
					});
					uni.$emit('refreshTempleList', 'refresh');
					uni.navigateBack({
						delta: 1
					})
				}
			}
		},
		bindTextAreaBlur(e) {
			const {
				value,
				cursor
			} = e.detail;
			this.cursorPos = cursor;
			this.isFocus = false;
		},
		// 获取光标的位置
		insertInputTxt(id, insertTxt) {
			const elInput = this.$refs[id + 'Ref'];

			if (this.cursorPos == -1) {
				this.messageTemplateForm.messageTemplateContent = this.messageTemplateForm.messageTemplateContent + insertTxt;
			} else {
				let txt = elInput.value;
				this.messageTemplateForm.messageTemplateContent = txt.substring(0, this.cursorPos) + insertTxt + txt.substring(this
					.cursorPos);
				this.isFocus = true;

				this.$nextTick(() => {
					this.cursorPos = this.cursorPos + insertTxt.length;
				});
			}
		},
		// 选择模板类型
		selectTemplateStyle(index) {
			this.num = index;
			this.messageTemplateForm.messageTemplateType = this.num == 0 ? '1' : '2';
			this.isAddParame = index == 0 ? true : false;
		},
		// // 选择模板跟踪规则
		// selectFollowRules(item) {
		// 	if (item.active) {
		// 		this.$set(item, 'active', false);
		// 	} else {
		// 		this.$set(item, 'active', true);
		// 	}
		// 	let ruleCode = '';
		// 	// for (let i in this.rulesCode) {
		// 	// 	if (this.rulesCode[i].active == true) {
		// 	// 		ruleCode += this.rulesCode[i].code + ',';
		// 	// 	}
		// 	// }
		// 	this.messageTemplateForm.ruleCode = ruleCode;
		// },
		changeSelType(type) { //改变选择分享类容类型
			this.shareQueryData.type = type;
			this.selShareData.shareCodeType = type;
			this.getShareInfo();
		},
		async getShareInfo() { //获取营销页详情
			let radata = await GK10.GetShareInfo(this.shareQueryData);
			if (radata) {
				this.shareDataList = radata;
			}
		},

		//关闭分享码弹窗
		shareCancel() {
			this.$refs.selShare.close();
		},
		async shareConform() {
			if (this.selShareData.shareCodeId != '') {
				let isHas = this._.includes(this.messageTemplateForm.messageTemplateContent, '【分享内容】');
				if (!isHas) {
					this.insertInputTxt('textareaContent', '【分享内容】');
					this.messageTemplateForm.shareCodeType = this.selShareData.shareCodeType;
					this.messageTemplateForm.shareCodeId = this.selShareData.shareCodeId;
				} else {
					let [error, res] = await uni.showModal({
						content: '一次只能选择一个活动，确认要替换之前的活动吗？'
					});
					if (res.confirm) {
						this.messageTemplateForm.shareCodeType = this.selShareData.shareCodeType;
						this.messageTemplateForm.shareCodeId = this.selShareData.shareCodeId;
					}
				}

			} else {
				uni.showToast({
					title: '请选择分享的活动内容',
					icon: 'none'
				})
			}
			this.$refs.selShare.close();

		},
		//-------------------------------------------插入参数模板相关事件-------------------------------------------
		getParameter(data) {
			this.insertInputTxt('textareaContent', data);
		},
		//-------------------------------------------短信预览相关事件-------------------------------------------
		async getPreview() { //点击预览按钮 获取预览内容
			//获取预览数据
			let res = await CY67.GetSimulationTemplate({
				content: this.messageTemplateForm.messageTemplateContent
			});
			if (res) {
				this.simulationTemplate = res.content;
			}
			//显示预览视图
			this.isShowTSimulation = true
		
		}
	},
	computed: {
		sharepageList() {
			if (this.shareDataList.type) {
				let arr = [];
				switch (this.shareDataList.type) {
					case 1:
						let arr1 = this.shareDataList.marketSet.dataList;
						arr1.forEach((item, index) => {
							let obj = {}
							obj.text = item.marketSetName;
							obj.shareCodeId = item.marketSetID;
							arr.push(obj);
						})
						break;
					case 2:
						let arr2 = this.shareDataList.hyCard.dataList;
						arr2.forEach((item, index) => {
							let obj = {}
							obj.text = item.hyCardTitle;
							obj.shareCodeId = item.hyCardID;
							arr.push(obj);
						})
						break;
					case 3:
						let arr3 = this.shareDataList.smallProgramCard.dataList;
						arr3.forEach((item, index) => {
							let obj = {}
							obj.text = item.cardName;
							obj.shareCodeId = item.smallProgramCardID;
							arr.push(obj);
						})
						break;
					default:
						break;
				}
				return arr;
			}
		}
	},
	watch: {
		// 'shareQueryData.type': {
		// 	handler: function(val, old) {
		// 		console.log(val)
		// 		if (val) {
		// 			this.messageTemplateForm.shareCodeType=val;
		// 			this.getShareInfo();
		// 		}
		// 	}
		// }
	}
};
