import YHBanquetTask from '@/service/YH/YHBanquetTaskAppService.js'

import yytReportTable from "@/components/yyt-report-table/yyt-report-table.vue";

import storage from '@/common/unistorage/index.js';
export default {
	data() {
		return {
			taskReportData: {}, //页面数据
			titleList: ['客户经理', '任务总量', '今日待办', '三日待办', '逾期', '未完成', '已完成'], //table表头数据
			tableDataList: [], //table表内容数据
		};
	},
	components: {
		yytReportTable
	},
	onLoad() {
		this.getBanquetTaskReport();
	},
	computed: {
		
	},

	methods: {
		//获取宴会报表数据
		async getBanquetTaskReport() {
			let data = {
				storeID: storage.getAppUserInfo().currentStoreId
			}
			let rdata = await YHBanquetTask.GetBanquetTaskReport(data);
			if (rdata) {
				this.taskReportData = this.$util.null2str(rdata.allData);
				this.tableDataList = rdata.marketData.markerData;
				this.titleList=rdata.marketData.typeName
			}
		},

	},
	watch: {

	}
}
