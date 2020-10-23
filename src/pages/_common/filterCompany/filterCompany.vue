<template>
	<view class="filter-company">
		<view class="main">
			<view class="search-wrapper">
				<input class="uni-input search-input" confirm-type="search" placeholder="搜索单位" v-model="query.name" @input="updateSearchkeyword" />
			</view>
			<!-- SW：列表======================== -->
			<view class="company-list-wraper">
				<mescroll-uni :down="downOption" @down="downCallback" :up="upOption" @up="upCallback" :fixed="false">
					<view class="inner" id="inner" v-cloak>
						<view
							class="item"
							v-on:click="selectCompany(item)"
							v-bind:class="{ active: selectedCompany.companyID === item.companyID }"
							v-for="(item, index) in companyList"
							:key="index"
						>
							{{ item.name }}
						</view>
					</view>
				</mescroll-uni>
			</view>
		</view>
		
		<view class="yyt_customerInfo_footer">
			<button type="primary" class="mui-btn label_save" v-on:click="confirm">确定</button>
		</view>
	</view>
</template>

<script>
import storage from '@/common/unistorage/index.js';
import moment from '@/lib/moment/moment.min.js';
import cw from '@/common/ceiwei/common.js';
// import MescrollUni from '@/components/yyt/mescroll-uni/mescroll-uni.vue';
import CY22 from '@/service/CY/CY22AppService.js';
import { mapState, mapMutations, mapActions } from 'vuex';
import util from '@/common/util.js';
const PAGESIZE = 15;
export default {
	data() {
		return {
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
					size: PAGESIZE // 每页数据的数量,默认10（别忘了和请求参数中的pageSize一样）
				},
				noMoreSize: 0, // 配置列表的总数量要大于等于5条才显示'-- END --'的提示
				empty: {
					tip: '暂无相关数据'
				},
				textNoMore: '没有更多啦~'
			},
			mescrollSingle: {}, // 刷新实例
			
			selectedCompany: {
				name: '', // 选中公司名称
				companyID: '', // 选中公司id
				keyword: '', // 搜索关键词（在搜索结果没有时，直接传递关键词给侧边栏）
			},
			companyList: [], // 公司列表
			query: {
				name: '', // 公司名称
				cWCompanyID: storage.getAppUserInfo().cwCompanyID, // 当前登录账号的公司id
				pageIndex: 1,
				pageSize: PAGESIZE
			},
			isLoadFinish: false,
		};
	},
	components: {
		// MescrollUni,
	},
	watch: {
		"query.name": function (val) {
			// this.refresh();
		}
	},
	methods: {
		...mapMutations(['setCurrentCompanyObj']),
		// 刷新列表
		refresh() {
			this.mescrollSingle.resetUpScroll && this.mescrollSingle.resetUpScroll();
		},
		updateSearchkeyword: util.debounce(function(e) {
			this.refresh();
		}, 1000),
		/*下拉刷新的回调 */
		downCallback(mescroll){
			this.mescrollSingle = mescroll;
			mescroll.resetUpScroll(); // 重置列表为第一页 (自动执行 page.num=1, 再触发upCallback方法 )
		},
		//上拉回调 page = {num:1, size:10}; num:当前页 ,默认从1开始; size:每页数据条数,默认10
		upCallback(mescroll) {
			//联网加载数据
			const self = this;
			let pageNum = mescroll.num; // 页码, 默认从1开始
			let pageSize = mescroll.size; // 页长, 默认每页10条
			self.getListDataFromNet(pageNum, pageSize, function (curPageData, totalPage) {
				// curPageData=[]; //打开本行注释,可演示列表无任何数据empty的配置
				// console.log(curPageData);
				//如果是第一页需手动置空列表
				
				
				if (pageNum == 1) {
					self.companyList = curPageData;
				} else {
					self.companyList = self._.concat(self.companyList, curPageData);
				}

		
				//联网成功的回调,隐藏下拉刷新和上拉加载的状态;
				//mescroll会根据传的参数,自动判断列表如果无任何数据,则提示空;列表无下一页数据,则提示无更多数据;
				console.log("pageNum=" + pageNum + ", pageSize=" + pageSize + ", curPageData.length=" + curPageData.length + ", 当前list长度==" + self.companyList.length);

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
		async getListDataFromNet (pageNum, pageSize, successCallback, errorCallback) {
			var self = this;
			var data = self.query;
			data.pageIndex = pageNum;
			let result=await CY22.GetCompany(data);
				// console.log(result);
				if (result.companyList != null) {
					successCallback && successCallback(
						result.companyList,
						Math.ceil(result.count / PAGESIZE),
					);
				}
			
		
		},
		// 点击了某个公司
		selectCompany: function (company) {
			const self = this;
			self.selectedCompany = company;
		},
		// 确认按钮
		confirm: function () {
			const self = this;
			// console.log(parent.$.currentCompanyObj);
			// if (parent.$.currentCompanyObj) {
			// 	console.log(parent.$.currentCompanyObj, self.selectedCompany);
			// 	parent.$.currentCompanyObj.name = self.selectedCompany.name || self.query.name; // 没有选中公司时，用搜索关键词代替
			// 	parent.$.currentCompanyObj.id = self.selectedCompany.companyID;
			// 	parent.$.currentCompanyObj.keyword = self.query.name;
			// }
			// const filterCompany = { "type": "object", "data": { "data": { "filterCompany": this.selectedCompany, }, "timeout": 0, "createTime": 1571640028168 } }
			// localStorage.setItem("filterCompany", JSON.stringify(filterCompany));
			this.setCurrentCompanyObj({
				name: self.selectedCompany.name || self.query.name, // 没有选中公司时，用搜索关键词代替
				id: self.selectedCompany.companyID,
				keyword: self.query.name,
			});
			uni.navigateBack({
				delta: 1
			})
		}
	}
};
</script>

<style lang="less" scoped>
@import url('filterCompany.less');
</style>
