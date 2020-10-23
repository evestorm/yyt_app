// 作者:覃彬

//------------------------------mock数据引入---------------------------
import editConditionsMock from './editConditions_mock.js';

//-------------------------Service引入----------------------------------
import app from '@/common/request.js';
import CY78 from '@/service/CY/CY78AppService.js';

export default {
	data() {
		return {
			// -----------------------------------条件列表相关---------------------------
			conditionList: [], //获取的条件列表数据
			selectCondition: [], //显示的额列表数据
			isOpen: false, //底部弹窗是否打开 用于进来判断请求getAjsxType 是否已关闭弹窗
		};
	},
	// 页面加载事件
	async onLoad(options) {
		this.gtCustomerConditionConfig();
		// this.conditionList = editConditionsMock.PaeList;
		this.selectCondition = getApp().globalData.editConditionsPageData.editJsonString ? JSON.parse(getApp().globalData.editConditionsPageData
			.editJsonString) : [];
		// 当fieldType"="ajax" 类型可能会更改 需要动态设置
		this.selectCondition.forEach(item => {
			let index = this._(item.fields).findIndex(x => x.fieldType == 'ajax');
			if (index != -1) {
				let ajaxObj = item.fields[index].ajaxOpt;
				this.getAjsxType(item, ajaxObj, index);
			}
		})
	},
	methods: {
		// 导航栏返回
		tapLeftFromNav() {
			uni.navigateBack({
				delta: 1
			});
		},
		// 导航栏保存
		tapRightFromNav() {
			let isBack = false,
				arr = [];
			arr = this._(this.selectCondition).flatMap(x => x.fields).value();
			isBack = this._(arr).some(x => {
				return x.fieldValue == null || x.fieldValue == ''
			})
			if (isBack) {
				uni.showToast({
					title: `请将信息填写完整！`,
					icon: 'none'
				})
			} else {
				this.selectCondition.forEach(item => { //拼接标题
					let str = item.condition;
					item.fields.forEach(x => {
						if (x.fieldValue) {
							x.fieldLabel =x.fieldLabel || x.fieldValue;
							str = this._.replace(str, x.fieldKey, x.fieldLabel)
							item.selfConditionName = str;
						}
					})
				})
				let editJsonString = JSON.stringify(this.selectCondition); //json字符串
				getApp().globalData.editConditionsPageData.editJsonString = editJsonString;
				uni.navigateBack({
					delta: 1
				})
			}
		},
		intBlur(e, index, fIndex) { //input 失去焦点事件 
			this.selectCondition[index].fields[fIndex].fieldValue = e.target.value;
			this.selectCondition[index].fields[fIndex].fieldLabel = e.target.value;
			this.selectCondition.splice(index, 1, this.selectCondition[index]);
		},
		moneyBlur(e, index, fIndex) { //金额失去焦点事件
			this.selectCondition[index].fields[fIndex].fieldValue = e.target.value;
			this.selectCondition[index].fields[fIndex].fieldLabel = e.target.value;
		},
		oepenSelPopup() { //打开选择条件弹窗
			this.$refs.selConditionPopup.open();
			this.isOpen = true;
		},
		closeSelPopup() { //关闭选择条件弹窗
			this.$refs.selConditionPopup.close();
			this.isOpen = false;
		},
		delCondition(index) { //删除列表中的条件
			this.selectCondition.splice(index, 1);
		},
		changeAjaxList(e, index, fIndex) { //picker 选择 index:选择的selectCondition下标；fIndex:选择范围是fields的下标 e
			let n = e.target.value;
			this.selectCondition[index].fields[fIndex].fieldIndex = n;
			this.selectCondition[index].fields[fIndex].fieldLabel = this.selectCondition[index].fields[fIndex].fieldList[n].label;
			this.selectCondition[index].fields[fIndex].fieldValue = this.selectCondition[index].fields[fIndex].fieldList[n].value;
		},
		selectEq(index, fIndex, str) { //选择范围【大于，小于，等于】 index:选择的selectCondition下标；fIndex:选择范围是fields的下标； str:选择的范围
			this.selectCondition[index].fields[fIndex].fieldValue = str;
			this.selectCondition[index].fields[fIndex].fieldLabel = str;
			this.selectCondition.splice(index, 1, this.selectCondition[index]);
		},
		async selCondition(item) { //选择条件 加入列表
			let obj = this._.cloneDeep(item);
			obj.id = Date.now().toString(36);
			//只有fieldType为ajax才发请求 加入类型选择参数
			let index = this._(item.fields).findIndex(x => x.fieldType == 'ajax');
			if (index != -1) {
				let ajaxObj = item.fields[index].ajaxOpt;
				this.getAjsxType(obj, ajaxObj, index);
			} else {
				this.selectCondition.push(obj);
				this.closeSelPopup();
			}
		},
		// 获取配置条件
		async gtCustomerConditionConfig() {
			let result = await CY78.GetCustomerConditionConfig();
			if (result) this.conditionList = result.groupConditionConfigs;
		},
		// 获取筛选类型
		async getAjsxType(obj, ajaxObj, index) {
			let data = {};
			let isStoreId = this._.some(ajaxObj.ajaxParameter, (x) => { //请求参数（暂时只有门店id）
				return x == 'storeID'
			});
			if (isStoreId) {
				data = {
					pageIndex: 1,
					pageSize: 999999,
					order: "storeId desc ",
					filter: {
						type: "and",
						conditions: [{
							attribute: "storeID",
							datatype: "nvarchar",
							operatoer: "eq",
							value: this.$storage.getAppUserInfo().currentStoreId
						}]
					}
				}
			}
			let result = await app.Request({
				url: ajaxObj.ajaxUrl,
				data: data,
				isObj: true,
				isShowLoading: false,
			});
			if (result) {
				//类型筛选条件
				let typeList = [];
				result.dataList.forEach(x => {
					let typeObj = {};
					typeObj = {
						label: x[ajaxObj.selectKeyValue.valueName],
						value: x[ajaxObj.selectKeyValue.keyName]
					}
					typeList.push(typeObj)
				})
				//选择范围数组/选择的值/选择的下标
				obj.fields[index].fieldList = typeList;
				obj.fields[index].fieldValue = obj.fields[index].fieldValue ? obj.fields[index].fieldValue : null;
				obj.fields[index].fieldIndex = obj.fields[index].fieldIndex ? obj.fields[index].fieldIndex : null;
				//判断是否有有该条件 有修改 没有添加
				if (this.selectCondition.length == 0) {
					this.selectCondition.push(obj);
				} else {
					let findIndx = this._(this.selectCondition).findIndex(x => x.id == obj.id);
					if (findIndx != -1) {
						this.selectCondition.splice(findIndx, 1, obj)
					} else {
						this.selectCondition.push(obj);
					}
				}
			}
			if (this.isOpen) {
				this.closeSelPopup();
			}
		}
	},
	computed: {
		pageList() { //接收到的数据转
			let arr = this._.cloneDeep(this.conditionList);
			return arr
		},
	}
};
