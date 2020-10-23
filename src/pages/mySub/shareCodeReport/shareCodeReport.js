// 作者:杨亮
import CY17 from '@/service/CY/CY17AppService.js';
import GK10 from '@/service/GK/GK10AppService.js';
import util from "@/common/util.js";
import * as mockMulData from './mock-mul.js';
import { cardData, generalData, sendPeopleData, detailData } from './mock-mul.js';
import mockJSONFromService from '@/service/GK/GK10AppService.json';

const app = getApp();
const initDate = util.curDate;
export default {
	data() {
		return {
			navTitle: '分享码数据',
			urlOptions: {}, // 页面传参
			picDomain: app.globalData.PicDomain,
			tabArr: [{
					label: '营销页',
					selected: true,
					value: 0,
					curDateIdx: 2,
					startTime: initDate,
					endTime: initDate,
				},
				{
					label: '会员卡',
					selected: false,
					value: 1,
					curDateIdx: 2,
					startTime: initDate,
					endTime: initDate,
				},
				{
					label: '优惠券',
					selected: false,
					value: 2,
					curDateIdx: 2,
					startTime: initDate,
					endTime: initDate,
				},
				{
					label: '商城', // 商城单独拆出来了，上面三个在的时候，不显示商城；显示了商城的时候，不显示上面三个
					selected: false,
					value: 3,
					curDateIdx: 2,
					startTime: initDate,
					endTime: initDate,
				}
			], // 顶部tab数组
			curTabIdx: 0, // 顶部tab高亮
			queryData: {
				storeID: this.$storage.getAppUserInfo().currentStoreId,
				type: 1, // 类型(1.营销页,2.会员卡,3.优惠券,4.商城)
				dateType: 3, // 日期类型(1.今日,2.近七日,3.近30日,4.自定义)
				startTime: initDate,
				endTime: initDate,
			},
			// 时间范围picker的默认值设置(开始范围[str],结束范围[str],默认范围[arr])
			startDateStr: this.$moment().subtract(10, 'years').format('YYYY'),
			endDateStr: this.$moment().add(10, 'years').format('YYYY'),
			// ['2010','01','01','-','2030','01','01']
			defaultDateRangeArr: [...this.$moment().format('YYYY-MM-DD').split('-'), '-', ...this.$moment().format('YYYY-MM-DD')
				.split('-')
			],
			// dataArr: mockMulData.cardData.carditem,
			dataArr: [],
			storeData: { // 商城数据
				generalData, // 数据概览
				sendPeopleData, // 推广专员数据
				detailData, // 数据详情
			},
			attachShowTypeArr: [{
					label: '柱状图',
					selected: true,
					value: 0,
				},
				{
					label: 'Excel表',
					selected: false,
					value: 1,
				}
			], // 推广专员数据的类型控制
			curAttachShowType: 0,
			attachTitleList: ['推广专员', '总金额', '总访问数', '下单次数', '转化率'], // 推广专员excel表title
			attachEchartsTypeArr: [{
				label: '总金额',
				selected: true,
				value: 'amount,¥,0',
			}, {
				label: '总访问',
				selected: false,
				value: 'visitCount,次,1',
			}, {
				label: '下单次数',
				selected: false,
				value: 'orderCount,次,1',
			}, {
				label: '转化率',
				selected: false,
				value: 'ratio,%,100',
			}], // 推广专员数据的echarts类型控制
			curAttachEchartsType: 'amount,¥,0',
			dataDetailsShowTypeArr: [{
					label: '曲线图',
					selected: true,
					value: 0,
				},
				{
					label: 'Excel表',
					selected: false,
					value: 1,
				}
			], // 推广专员数据的类型控制
			curDataDetailsShowType: 0,
			dataDetailsTitleList: ['日期', '新增金额', '新增访问', '新增下单'], // 数据详情excel表title
			dataDetailsEchartsTypeArr: [{
				label: '新增金额',
				selected: true,
				value: 'amount,date,#FF0000,0',
			}, {
				label: '新增访问',
				selected: false,
				value: 'visitCount,dataTime,#0183FF,1',
			}, {
				label: '新增下单',
				selected: false,
				value: 'orderCount,date,#FF4E00,1',
			}], // 推广专员数据的echarts类型控制
			curDataDetailsEchartsType: 'amount,date,#FF0000,0'
		};
	},
	// 页面加载事件
	onLoad(urlOptions) {
		this.urlOptions = urlOptions;
		if (this.urlOptions.idx !== undefined) {
			this.curTabIdx = this.urlOptions.idx;
			let item = this.tabArr.find((v, idx) => idx == this.urlOptions.idx);
			this.onSelectTab(null, item);
			if (this.urlOptions.idx == 3) this.navTitle = '商城数据分析';
		}
		// 用户信息
		const userInfo = this.$storage.getAppUserInfo();
		this.requestData();
	},
	methods: {
		// 顶部选项卡切换
		onSelectTab(e, item) {
			if (item.selected) return;
			this.tabArr.forEach((item) => item.selected = false);
			item.selected = true;
			this.curTabIdx = item.value;
			// 切换顶部选项卡时，同步对应 queryData 的相关参数
			this.queryData.type = this.curTabIdx + 1;
			this.queryData.dateType = this.tabArr[this.curTabIdx].curDateIdx + 1;
			this.queryData.startTime = this.tabArr[this.curTabIdx].startTime;
			this.queryData.endTime = this.tabArr[this.curTabIdx].endTime;
		},
		// 时间选择
		/**
		 * @param {Object} e event事件
		 * @param {Object} 选中item
		 * @param {Object} 选中item的数组索引
		 */
		selectDate(e, item) {
			this.tabArr[this.curTabIdx].curDateIdx = item.value;
			this.queryData.dateType = item.value + 1;
		},
		// 确认时间范围
		confirmDateRange(val) {
			let tFrom = val.from + ' 00:00:00';
			let tTo = val.to + ' 00:00:00';
			this.tabArr[this.curTabIdx].startTime = tFrom;
			this.tabArr[this.curTabIdx].endTime = tTo;
			this.queryData.startTime = tFrom;
			this.queryData.endTime = tTo;
			this.queryData.dateType = 4;
			this.tabArr[this.curTabIdx].curDateIdx = 3;
		},
		cancelPickerSelect() {
			// console.log('点击了取消');
		},
		// 推广专员数据展示类型（echarts柱状图，excel表）
		onSelectAttachShowType(e, item) {
			if (item.selected) return;
			this.attachShowTypeArr.forEach((item) => item.selected = false);
			item.selected = true;
			this.curAttachShowType = item.value;
		},
		// 推广专员数据echarts类型控制
		onSelectAttachEchartsType(e, item) {
			if (item.selected) return;
			this.attachEchartsTypeArr.forEach((item) => item.selected = false);
			item.selected = true;
			this.curAttachEchartsType = item.value;
		},
		// 数据详情展示类型（echarts柱状图，excel表）
		onSelectDataDetailsShowType(e, item) {
			if (item.selected) return;
			this.dataDetailsShowTypeArr.forEach((item) => item.selected = false);
			item.selected = true;
			this.curDataDetailsShowType = item.value;
		},
		// 数据详情echarts类型控制
		onSelectDataDetailsEchartsType(e, item) {
			if (item.selected) return;
			this.dataDetailsEchartsTypeArr.forEach((item) => item.selected = false);
			item.selected = true;
			this.curDataDetailsEchartsType = item.value;
		},
		// 数据请求
		async requestData() {
			let result = await GK10.GetSharedDataReport(this.queryData);
			// let result = mockMulData; // 假数据
			if (result) {
				// 类型(1.营销页,2.会员卡,3.优惠券,4.商城)
				if (this.queryData.type !== 4) { // 列表
					const {
						count, // 多少篇
						carditem // 具体列表（Array）
					} = result.cardData;
					this.dataArr = carditem;
				} else { // echarts图表
					this.storeData = result;
				}
			}
		}
	},
	computed: {
		// 数据概览
		generalData() {
			return this.storeData.generalData;
		},
		// 推广专员echarts柱状图原数据
		sendPeopleData() {
			return this.storeData.sendPeopleData;
		},
		// 数据详情原数据
		detailData() {
			return this.storeData.detailData.reverse().map(v => {
				let dataTime = v.dataTime.slice(0, 10);
				v.dataTime = dataTime;
				return v;
			});
		},
		// 推广专员excel表 表格数据
		attachTableDataList() {
			return this.storeData.sendPeopleData.reduce((accr, v, idx) => [...accr, [v.name, v.amount, v.visitCount, v.orderCount,
				v.ratio
			]], []);
		},
		// 数据详情excel表 表格数据
		dataDetailsTableDataList() {
			return this.storeData.detailData.reduce((accr, v, idx) => [...accr, [v.date, v.amount, v.visitCount, v.orderCount]],
				[]);
		},
	},
	filters: {
	},
	watch: {
		"queryData": {
			handler: function() {
				this.requestData();
			},
			deep: true,
		},
	}
	// ## 方法
};
