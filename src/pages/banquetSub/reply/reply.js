import YHBanquetProject from '@/service/YH/YHBanquetProjectAppService.js';
import storage from '@/common/unistorage/index.js'
export default {
	// 右上角保存按钮
	async onNavigationBarButtonTap(e) {
		let data={
			id:this.id,
			commentReplyContent:this.getData.commentReplyContent,//评价回复
			commentReplyID:storage.getAppUserInfo().marketerId//评价回复人ID(CY17001)
		};
		let res=await YHBanquetProject.UpdateByDto(data);
			uni.navigateBack({
				delta:1
			})
	
	},
	data() {
		return {
			id:'',//主键id
			projectTitle:'基础项目',//项目名
			orderTitle:'王总婚宴',//宴会订单名
			orderTime:'2020-02-02',//宴会时间
			getData:{//回复请求参数
				cstScore:0,//客户项目评分
				cstComment:"",//客户项目评价
				commentReplyContent:"",//评价回复
				commentReplyID:""//评价回复人ID(CY17001)
			},
		};
	},
	components:{},
	// 页面加载事件
	async onLoad(option) {
		//获取客户评价
//?????获取主键id=?  项目名=? 宴会名=? 宴会时间=?
		this.id=option.projectId;
		this.projectTitle=option.projectTitle;//项目名
		this.orderTitle=option.orderTitle;//宴会订单名
		this.orderTime=option.orderTime.slice(0,10);
		// this.id='E1BFD229-D11F-EA11-BA53-FC0E03BF8D3E';
		let data={
			id:this.id
		};
		//获取客户评价
		let res=await YHBanquetProject.UpdateByDto(data);
			this.getData={
				cstScore:res.cstScore,//客户项目评分
				cstComment:res.cstComment||'',//客户项目评价
				commentReplyContent:res.commentReplyContent||'',//评价回复
			}
		
	},
	methods: {
	
	},
	
	watch: {
		//"currentStore.storeId": {
		//    handler: function (val, oldval) {
		//        if (val) {
		//            vmDivItem1.$options.methods.getMonthSummaryData.bind(vmDivItem1)(1, val);
		//            vmDivItem3.$options.methods.getTodyBookData.bind(vmDivItem3)(1, val);
		//        }
		//    }
		//}
	}
	// ## 方法
};
