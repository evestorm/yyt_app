<template>
	<view class="sales-record">
		<view class="container">
			<view class="yyt_yyt_cardContentInfo">
				<mescroll-uni class="customerFocusInfo" :down="downOption" @down="downCallback" :up="upOption" @up="upCallback" >
					<view class="mui-table-view inner" id="inner">
						<view class="mui-table-view-cell"
							v-for="(GetSalesRecodeInfoOutDtoItem, index) in GetSalesRecodeInfoOutDto" :key="index">
							<view class="customerFocusCard">
								<view class="customerFocusCard_top">
									<view class="customerFocusCard_top_left">
										<a class="customerFocusCard_top_left_l" v-on:click="gotoCustom(GetSalesRecodeInfoOutDtoItem)">
											<view class="customerFocusCard_top_left_l_picArea" v-if="GetSalesRecodeInfoOutDtoItem.customerPoolMarketName">
												<image
													class="salespersonPic"
													:src="GetSalesRecodeInfoOutDtoItem.headImg ? GetSalesRecodeInfoOutDtoItem.headImg : 'https://pic.cwyyt.cn/upload/yytApp/images/salesperson.png'"
													v-if="GetSalesRecodeInfoOutDtoItem.customerPoolMarketName"
												></image>
												<view class="salespersonNamePic">
													<text>{{ GetSalesRecodeInfoOutDtoItem.customerPoolMarketName }}</text>
												</view>
											</view>
											<image
												class="salespersonPic"
												:src="GetSalesRecodeInfoOutDtoItem.headImg ? GetSalesRecodeInfoOutDtoItem.headImg : 'https://pic.cwyyt.cn/upload/yytApp/images/salesperson.png'"
												v-else
											></image>
											<view class="salespersonInfo">
												<text class="salespersonName">{{ GetSalesRecodeInfoOutDtoItem.customerName }}</text>
												<image
													class="salesrankPic"
													v-if="GetSalesRecodeInfoOutDtoItem.customerLevelImgUrl"
													:src="$cw.ImgServerUrl + GetSalesRecodeInfoOutDtoItem.customerLevelImgUrl"
												></image>
											</view>
										</a>
										<view class="customerFocusCard_top_left_r">
											<view class="telphoneInfo">
												<image class="telphonePic" :src="picDomain + '/upload/yytApp/images/DH.png'"></image>
												<text v-on:click="$cw.callPhone(GetSalesRecodeInfoOutDtoItem.customerPhone)">
													{{ GetSalesRecodeInfoOutDtoItem.customerPhone }}
												</text>
											</view>
											<view class="adressInfo">
												<view class="adress_area" v-show="!GetSalesRecodeInfoOutDtoItem.bookOrderID">
													<image class="addressPic" :src="picDomain + '/upload/yytApp/images/address.png'"></image>
													<text class="address_company">{{ GetSalesRecodeInfoOutDtoItem.company || '暂无单位' }}</text>
												</view>
												<view class="adress_area" v-show="GetSalesRecodeInfoOutDtoItem.bookOrderID">
													<image class="dateWeekPic" :src="picDomain + '/upload/yytApp/images/dateWeek.png'"></image>
													<text class="date">{{ GetSalesRecodeInfoOutDtoItem.time | parseShortDate }}</text>
													<text>{{ GetSalesRecodeInfoOutDtoItem.time | parseShortWeek }}</text>
												</view>
											</view>
											<view class="orderInfo">
												<text class="dateTime" v-show="!GetSalesRecodeInfoOutDtoItem.bookOrderID">
													{{ GetSalesRecodeInfoOutDtoItem.time | parseShortDate }}
												</text>
												<text class="dateTime" v-show="!GetSalesRecodeInfoOutDtoItem.bookOrderID">{{ GetSalesRecodeInfoOutDtoItem.time | parseTime }}</text>
												<text class="dateTime" v-show="!GetSalesRecodeInfoOutDtoItem.bookOrderID">
													{{ GetSalesRecodeInfoOutDtoItem.time | parseShortWeek }}
												</text>
												<text v-show="GetSalesRecodeInfoOutDtoItem.bookOrderID">{{ GetSalesRecodeInfoOutDtoItem.bookOrderTypeName }}</text>
												<text v-show="GetSalesRecodeInfoOutDtoItem.bookOrderID">{{ GetSalesRecodeInfoOutDtoItem.diningTypeName }}</text>
												<text v-show="GetSalesRecodeInfoOutDtoItem.bookOrderID">{{ GetSalesRecodeInfoOutDtoItem.bookTableNum }}桌</text>
												<text v-show="GetSalesRecodeInfoOutDtoItem.bookOrderID">￥{{ GetSalesRecodeInfoOutDtoItem.fee | currency }}元</text>
											</view>
										</view>
										<view class="upperRightCorner">
											<image :src="picDomain + '/upload/yytApp/images/tui.png'" class="tuiPic" v-if="GetSalesRecodeInfoOutDtoItem.isYYTCome"></image>
											<image :src="picDomain + '/upload/yytApp/images/geng.png'" class="gengPic" v-if="GetSalesRecodeInfoOutDtoItem.isFollowCome"></image>
										</view>
									</view>
									<view class="customerFocusCard_top_right">
										<view class="customerFocusCard_top_right_t">
											<text v-if="!GetSalesRecodeInfoOutDtoItem.bookOrderID">
												{{ GetSalesRecodeInfoOutDtoItem.callType | parseCallType }}
												<!--显示消费状态-->
											</text>
											<text class="consume" v-else>消费</text>
										</view>
										<view class="customerFocusCard_top_right_b">
											<image :src="picDomain + '/upload/yytApp/images/follow.png'" v-if="!GetSalesRecodeInfoOutDtoItem.bookOrderID" class="followPic"></image>
											<image :src="picDomain + '/upload/yytApp/images/kefu.png'" v-else class="kefuPic"></image>
											<text>{{ GetSalesRecodeInfoOutDtoItem.marketerName }}</text>
										</view>
									</view>
								</view>
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
import CY57 from '@/service/CY/CY57AppService.js';
const app = getApp();
export default {
	data() {
		return {
			picDomain: app.globalData.PicDomain,
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
			GetSalesRecodeInfoInDto: {}, // 查询参数
			ToolTips: '',
			GetSalesRecodeInfoOutDto: [], // 列表数据
		};
	},
	components: {
		// MescrollUni
	},
	onLoad(payload) {
		this.customerId = payload.customerId;
		this.GetSalesRecodeInfoInDto = {
			pageIndex: 1,
			pageSize: 10,
			order: "beginTime desc",
			storeID: storage.getAppUserInfo().currentStoreId,
			customerId: this.customerId, // 页面接受参数
			consumeType: 0,
			filter: {
				type: "and",
				conditions: [
					{
						attribute: "callRecordCWCompanyId",
						datatype: "nvarchar",
						operatoer: "eq",
						value: storage.getAppUserInfo().cwCompanyID
					},
					{
						attribute: "customerId",
						datatype: "nvarchar",
						operatoer: "eq",
						value: this.customerId
					}
				]
			}
			//customerId: $.cw.getQueryString("customerId"),
			//storeId: $.cw.getUserInfo().currentStoreId,
			//month: $.cw.getQueryString("month") ? $.cw.getQueryString("month") : ""
		};
		var self = this;
		
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
			self.getSalesRecodeInfo(pageNum, pageSize, function (curPageData, totalPage) {
				// curPageData=[]; //打开本行注释,可演示列表无任何数据empty的配置

				//如果是第一页需手动置空列表
				if (pageNum == 1) self.GetSalesRecodeInfoOutDto = [];

				//更新列表数据
				self.GetSalesRecodeInfoOutDto = self.GetSalesRecodeInfoOutDto.concat(curPageData);

				//联网成功的回调,隐藏下拉刷新和上拉加载的状态;
				//mescroll会根据传的参数,自动判断列表如果无任何数据,则提示空;列表无下一页数据,则提示无更多数据;
				console.log("pageNum=" + pageNum + ", pageSize=" + pageSize + ", curPageData.length=" + curPageData.length + ", self.GetSalesRecodeInfoOutDto.length==" + self.GetSalesRecodeInfoOutDto.length);

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
		// 获取跟踪记录
		async getSalesRecodeInfo (pageNum, pageSize, successCallback, errorCallback) {
			const self = this;
			const data = self.GetSalesRecodeInfoInDto;
			data.pageIndex = pageNum;
			data.pageSize = pageSize;
			let result=await CY57.GetCallAndConsumeLog(data);
				// console.log(result);
				successCallback && successCallback(
					result.dataList,
					Math.ceil(result.rowCount / self.GetSalesRecodeInfoInDto.pageSize)
				);
			
		},
		gotoCustom (item) {
			// var herf = "/Phone/Customer/CustomerInfo?" + $.param(query);
			// window.location.href = herf;
			const url = `/pages/_common/customInfo/customInfo?customerId=${item.customerId}`;
			uni.navigateTo({
				url,
			})
		},
	},
	computed: {
		//fullName: {
		//    get: function () {
		//        return this.firstName + ' ' + this.lastName
		//    },
		//    set: function (newValue) {
		//        var names = newValue.split(' ')
		//        this.firstName = names[0]
		//        this.lastName = names[names.length - 1]
		//    }
		//}
		// vm.fullName = 'John Doe'
	},
	filters: {
		parseCallType (value) {
			if (value == 0) {
				return "消费"
			}
			if (value == 1) {
				return "电话呼入"
			}
			else if (value == 2) {
				return "电话跟踪"
			}
			else if (value == 3) {
				return "短信跟踪"
			}
			else if (value == 4) {
				return "电话未接通"
			}
			else if (value == 5) {
				return "微信跟踪"
			}
			else if (value == 6) {
				return "接收短信"
			}
		}
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
};
</script>

<style lang="less" scoped>
@import url('salesRecord.less');
</style>
