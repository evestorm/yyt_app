//组件
// import MescrollUni from "@/components/yyt/mescroll-uni/mescroll-uni.vue";
//请求
import YHBanquetHistoryLog from '@/service/YH/YHBanquetHistoryLogAppService.js'
export default {
	data() {
		return {
			logList:[],//日志数据
			pageData:{//获取日志请求参数
				pageIndex:'',//页码
				pageSize:"",//数量
				banquetOrderGUID:"",//宴会单GUID(YH_BanquetOrder)
			},
			// 上拉加载的常用配置
			upOption: {
				use: true, // 是否启用上拉加载; 默认true
				auto: true, // 是否在初始化完毕之后自动执行上拉加载的回调; 默认true
				page: {
					num: 0, // 当前页码,默认0,回调之前会加1,即callback(page)会从1开始
					size: 20 // 每页数据的数量,默认10
				},
				noMoreSize: 5, // 配置列表的总数量要大于等于5条才显示'-- END --'的提示
				empty: {
					tip: '暂无相关数据'
				}
			},
			// 下拉刷新的常用配置
			downOption: {
				use: true, // 是否启用下拉刷新; 默认true
				auto: true, // 是否在初始化完毕之后自动执行下拉刷新的回调; 默认true
			}
		}
	},
	components:{
		// MescrollUni
	},
	onLoad(option){
		// console.log(option)
		this.pageData.banquetOrderGUID=option.banquetOrderGUID;
		// this.pageData.banquetOrderGUID='f467ee6c-672b-4623-d9b0-08d7964a6467';
	},
	methods: {
		/*下拉刷新的回调, 有三种处理方式: */
		downCallback(mescroll) {
			mescroll.resetUpScroll(); // 重置列表为第一页 (自动执行 page.num=1, 再触发upCallback方法 )
		},
		/*上拉加载的回调*/
		async upCallback(mescroll) {
			// 此时mescroll会携带page的参数:
			this.pageData.pageIndex = mescroll.num; // 页码, 默认从1开始
			this.pageData.pageSize = mescroll.size; // 页长, 默认每页10条
			let data=await YHBanquetHistoryLog.GetBanquetHistoryLogs(this.pageData);
				// 接口返回的当前页数据列表 (数组)
				let curPageData = data.dataList;
				this._(curPageData).forEach(item => {
					let n=item.orderHistoryLogContent.indexOf(',');
					if(n!=-1){
						item.orderHistoryLogContent.split(',')
						item.historyTitle=item.orderHistoryLogContent.slice(0,n);
						item.historySection=item.orderHistoryLogContent.slice(n+1)
					}else{
						item.historyTitle=item.orderHistoryLogContent
					}
				})
				// 接口返回的总页数 (比如列表有26个数据,每页10条,共3页; 则totalPage值为3)
				let totalPage = data.pageCount;
				// 接口返回的总数据量(比如列表有26个数据,每页10条,共3页; 则totalSize值为26)
				let totalSize = data.rowCount;
				let Pindex = data.pageIndex; //当前页数
				// 接口返回的是否有下一页 (true/false)
				let hasNext = Pindex > totalPage ? true : false
		
				//设置列表数据
				if (mescroll.num == 1) this.logList = []; //如果是第一页需手动置空列表
				this.logList = this.logList.concat(curPageData); //追加新数据
		
				// 成功隐藏下拉加载状态
				//方法一(推荐): 后台接口有返回列表的总页数 totalPage
				mescroll.endByPage(curPageData.length, totalPage);
				// 如果数据较复杂,可等到渲染完成之后再隐藏下拉加载状态: 如
				this.$nextTick(() => {
					mescroll.endSuccess(curPageData.length)
				})
				fail: () => {
					// 失败隐藏下拉加载状态
					mescroll.endErr()
				}
			
		}
	}
}