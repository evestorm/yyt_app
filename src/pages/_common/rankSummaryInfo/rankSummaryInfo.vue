<template>
	<view class="rank-summary-info">
		<view class="container">
			<view class="customerFocusInfo">
				<mescroll-uni class="customerFocusInfo" :down="downOption" @down="downCallback" :up="upOption" @up="upCallback" >
				<view class="mui-table-view">
					<view class="mui-table-view-cell"
						v-for="(rankSummaryData, index) in rankSummaryData" :key="index">
						<view class="customerFocusCard">
							<view class="customerFocusCard_top">
								<view class="customerFocusCard_top_left">
									<view class="customerFocusCard_top_left_l" v-on:click="gotoCustom(rankSummaryData)">
										<view class="customerFocusCard_top_left_l_picArea" v-if="!rankSummaryData.customerPoolMarketName">
											<image class="salespersonPic" :src="getCustomerImg(rankSummaryData)"></image>
											<view class="salespersonNamePic">
												<text>{{ rankSummaryData.customerPoolMarketName }}</text>
											</view>
										</view>
										<view class="yyt_customerInfo_top_l_Area" v-else>
											<image class="salespersonPic" v-if="rankSummaryData.customerImgUrl" :src="getCustomerImg(rankSummaryData)"></image>
											<image class="salespersonPic" :src="picDomain + '/upload/yytApp/images/salesperson.png'" v-else></image>
										</view>
										<view class="salespersonInfo">
											<text class="salespersonName">{{ rankSummaryData.customerName }}</text>
											<image class="salesrankPic" :src="getCustomLevelImgUrl(rankSummaryData)"></image>
										</view>
									</view>
									<view class="customerFocusCard_top_left_r">
										<view class="consumeItem">
											<text class="title">月消费(￥):</text>
											<text class="desc">{{ rankSummaryData.monthFeeAmount | currency }}</text>
										</view>
										<view class="consumeItem">
											<text class="title">人均消费(￥):</text>
											<text class="desc">{{ rankSummaryData.monthAvgFeeAmount | currency }}</text>
										</view>
										<view class="consumeItem">
											<text class="title">桌均(￥):</text>
											<text class="desc">{{ rankSummaryData.monthTableFeeAmount | currency }}</text>
										</view>
										<view class="consume_averageNum">
											<view class="consumeItem">
												<text class="title">次数(次):</text>
												<text class="desc">{{ rankSummaryData.monthConsumeNum }}</text>
											</view>
											<view class="consumeItem">
												<text class="title">桌数(桌):</text>
												<text class="desc">{{ rankSummaryData.monthTableNum }}</text>
											</view>
										</view>
									</view>
									
									<!-- <text class="rankIcon">{{ index + 1 }}</text> -->
									
								</view>
								<view class="customerFocusCard_top_right">
									<view class="customerFocusCard_top_right_t">
										<text>{{ rankSummaryData.year + '.' + rankSummaryData.month }}</text>
									</view>
									<view class="customerFocusCard_top_right_b">
										<image class="img" :src="picDomain + '/upload/yytApp/images/salesIconPersonal.png'"></image>
										<text>{{ rankSummaryData.customerPoolMarketName }}</text>
									</view>
								</view>
								<view></view>
							</view>
							<!-- 									<view class="customerFocusCard_bottom">
											<view class="customerFocusCard_bottom_t">
												<img src="https://pic.cwyyt.cn/upload/yytApp/images/clock.png" alt="" class="clockPic">
												<view class="customerFocusCard_bottom_r" v-if="rankSummaryData.consumLog">
													<text>{{rankSummaryData.consumLog.consumDateTime|parseShortDate}}</text>
													<text>{{rankSummaryData.consumLog.diningTypeName}}</text>
													<text>{{rankSummaryData.consumLog.onsumType}}</text>
													<text>{{rankSummaryData.consumLog.marketerName}}</text>
													<text>¥{{rankSummaryData.consumLog.consumAmount|currency}}元</text>
												</view>
												<view class="customerFocusCard_bottom_r" v-if="!rankSummaryData.consumLog"
													 style="font-size: 0.28rem; color: #323232;">
													&nbsp;&nbsp; 暂无消费
												</view>
											</view>
											<view class="customerFocusCard_bottom_b">
												<view class="customerFocusCard_bottom_b_left">
													<view class="customerFocusCard_bottom_b_left_l">
														<img :src="picDomain + '/upload/yytApp/images/footer.png'" alt="" class="footerPic">
														<view class="customerFocusCard_bottom_r" v-if="rankSummaryData.attrackLog">
															<text>{{rankSummaryData.attrackLog.marketerName}}</text>
															<text>{{rankSummaryData.attrackLog.attrackDateTime|parseShortDate}}</text>
															<text>{{rankSummaryData.attrackLog.attrackDateTime|parseShortTime}}</text>
															<text>{{rankSummaryData.attrackLog.attrackType}}</text>
														</view>
														<view class="customerFocusCard_bottom_r" v-if="!rankSummaryData.attrackLog"
															 style="font-size: 0.28rem; color: #323232;">
															&nbsp;&nbsp; 暂无跟踪
														</view>
													</view>
													<view class="customerFocusCard_bottom_b_right">
														<img src="https://pic.cwyyt.cn/upload/yytApp/images/notes.png" alt="" class="notesPic" v-on:click="showFollow(rankSummaryData.customerId)">
													</view>
												</view>
											</view>
		
									</view>
 -->
						</view>
					</view>
				</view>
				</mescroll-uni>
			</view>
		</view>
	</view>
</template>

<script>
// import MescrollUni from "@/components/yyt/mescroll-uni/mescroll-uni.vue"; // 拷贝到components的,则引入.vue文件 (注意.vue后缀不能省)
import storage from '@/common/unistorage/index.js';
import CY19 from '@/service/CY/CY19AppService.js';
const app = getApp();
export default {
	data() {
		return {
			picDomain: app.globalData.PicDomain,
			customerId: '', // 接受参数
			rankSummaryQuery: {
			},
			rankSummaryData: [],
			pageText: "",
			bodyHeight: '',
			
			// 下拉刷新的常用配置
			downOption: { 
				use: true, // 是否启用下拉刷新; 默认true
				auto: true, // 是否在初始化完毕之后自动执行下拉刷新的回调; 默认true
			},
			// 上拉加载的常用配置
			upOption: {
				use: true, // 是否启用上拉加载; 默认true
				auto: true, // 是否在初始化完毕之后自动执行上拉加载的回调; 默认true
				page: {
					num: 0, // 当前页码,默认0,回调之前会加1,即callback(page)会从1开始
					size: 10 // 每页数据的数量,默认10（别忘了和请求参数中的pageSize一样）
				},
				noMoreSize: 5, // 配置列表的总数量要大于等于5条才显示'-- END --'的提示
				empty: {
					tip: '暂无相关数据'
				},
				textNoMore: '没有更多啦~'
			},
		};
	},
	onLoad(payload) {
		this.customerId = payload.customerId;
		this.rankSummaryQuery = {
			customerID: this.customerId,
			cWCompanyId: storage.getAppUserInfo().cwCompanyID,
			isGetChartStat: false,
			isGetMonthStat: true,
			storeID: storage.getAppUserInfo().currentStoreId
		};
	},
	components: {
		// MescrollUni
	},
	methods: {
		/*下拉刷新的回调, 有三种处理方式: */
		downCallback(mescroll){
			// 第2种: 下拉刷新和上拉加载调同样的接口, 那以上请求可删, 直接用mescroll.resetUpScroll()代替
			mescroll.resetUpScroll(); // 重置列表为第一页 (自动执行 page.num=1, 再触发upCallback方法 )
		},
		//上拉回调 page = {num:1, size:10}; num:当前页 ,默认从1开始; size:每页数据条数,默认10
		upCallback(mescroll) {
			//联网加载数据
			const self = this;
			let pageNum = mescroll.num; // 页码, 默认从1开始
			let pageSize = mescroll.size; // 页长, 默认每页10条
			self.getRankSummaryInfo(pageNum, pageSize, function (curPageData, totalPage) {
				// curPageData=[]; //打开本行注释,可演示列表无任何数据empty的配置
		
				//如果是第一页需手动置空列表
				if (pageNum == 1) self.rankSummaryData = [];
		
				//更新列表数据
				self.rankSummaryData = self.rankSummaryData.concat(curPageData);
		
				//联网成功的回调,隐藏下拉刷新和上拉加载的状态;
				//mescroll会根据传的参数,自动判断列表如果无任何数据,则提示空;列表无下一页数据,则提示无更多数据;
				console.log("pageNum=" + pageNum + ", pageSize=" + pageSize + ", curPageData.length=" + curPageData.length + ", self.rankSummaryData.length==" + self.rankSummaryData.length);
		
				// 后台接口有返回列表的总页数 totalPage
				mescroll.endByPage(curPageData.length, totalPage); //必传参数(当前页的数据个数, 总页数)
		
				//提示:curPageData.length必传的原因:
				// 1.判断是否有下一页的首要依据: 当传的值小于page.size时,则一定会认为无更多数据.
				// 2.比传入的totalPage, totalSize, hasNext具有更高的判断优先级
				// 3.使配置的noMoreSize生效
		
			}, function () {
				// 失败隐藏下拉加载状态
				mescroll.endErr();
			});
		},
		// 获取统计信息
		async getRankSummaryInfo (pageNum, pageSize, successCallback, errorCallback) {
			var self = this;
			var data = self.rankSummaryQuery;
			data.pageIndex = pageNum;
			data.pageSize = pageSize;
			let result=await CY19.GetCustomerConsumeStat(data);
				// console.log(result);
				successCallback && successCallback(
					result.monthStats,
					1 // 月统计信息就一页，定死的
				);
			
		},
		// 获得客户图像
		getCustomerImg (item) {
			if (item.customerImgUrl) {
				return item.customerImgUrl;
			} else {
				return "https://pic.cwyyt.cn/upload/yytApp/images/salesperson.png"
			}
		},
		//获取等级图片
		getCustomLevelImgUrl (item) {
			if (item.customerLevelImgUrl) {
				return item.customerLevelImgUrl;
			} else {
				return "https://pic.cwyyt.cn/upload/yytApp/images/level_D.png"
			}
		},
		gotoCustom (item) {
			// var herf = "/Phone/Customer/CustomerInfo?" + $.param(query);
			// window.location.href = herf;
			const url = `/pages/_common/customInfo/customInfo?customerId=${item.customerID}`;
			uni.navigateTo({
				url,
			})
		},
		// 弃用方法
		showFollow (customerId) {
			var query = {
				customerId: customerId,
				//month: $.cw.getQueryString('month'),
			}
			var herf = "/Phone/Sales/SalesRecode?" + $.param(query);
			window.location.href = herf;
		},

	},
	// mounted: function () {
	// 	this.getRankSummaryInfo();
	// 	this.bodyHeight = $(window).height() - $('.mui-bar ').height();
	// },
	computed: {

	},
	filters: {
	},
	watch: {

	}
};
</script>

<style lang="less" scoped>
@import url('rankSummaryInfo.less');
</style>
