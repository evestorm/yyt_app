import CY67 from '@/service/CY/CY67AppService.js';
import storage from '@/common/unistorage/index.js';
// import MescrollUni from "@/components/yyt/mescroll-uni/mescroll-uni.vue";
import uniPopup from '@/components/uni-popup/uni-popup.vue'

const PAGESIZE = 10;
const app = getApp();

export default {
	data() {
		return {
			picDomain: app.globalData.PicDomain,
			// --------------- data顶部筛选 ------------------
			isShowTemplType: false, // 模板类型的下拉菜单展示与否
			templType: [{ // 模板类型
				label: '全部',
				value: '',
				selected: true,
			}, {
				label: '预订通知',
				value: 0,
				selected: false,
			}, {
				label: '跟踪短信',
				value: 1,
				selected: false,
			}],
			isShowEnableType: false, // 是否启用的下拉菜单展示与否
			enableType: [{ // 是否启用
				label: '全部',
				value: '',
				selected: true,
			}, {
				label: '已启用',
				value: 1,
				selected: false,
			}, {
				label: '未启用',
				value: 0,
				selected: false,
			}],
			searchObj: {
				templetStyle: '',
				isStartUse: ''
			},
			// ------------ data数据查询 ---------------
			SMSTempletQuery: {
				pageIndex: 1,
				pageSize: 10,
				order: 'createTime desc'
			}, //CY67.GetViewPage接口要传的值
			smsTtmpletData: [], // 列表数据
			// ---------------------- dataMescroll配置 ---------------------

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
				textNoMore: '没有更多啦~',
				toTop: {
					src: '', // 避免遮挡底部[打标签]按钮触发不了
				}
			},
			// mescroll实例
			mescrollSingle: {},
			topFilterWrapperBottom: 100, // 顶部状态栏bottom高度,mescroll 距顶高度
			swBottom: 0, // mescroll 距底高度
			// ------------- 删除模板 ---------------
			//要删除的id
			waitDelete: "",
			salesAuthority: storage.getSalesAuthority(), //权限
		};
	},
	components: {
		// MescrollUni,
		uniPopup
	},
	computed: {
		// --------------- computed顶部筛选 ---------------
		templText() { // 筛选项模板类型文字格式化(最多显示4个汉字)
			var filters = this.templType.filter(function(item) {
				return item.selected;
			})[0];
			if (filters) {
				if (filters.label == '全部') {
					return '模板类型';
				} else {
					return filters.label.substring(0, 4);
				}
			} else {
				return '';
			}
		},
		enableText() { // 筛选项『是否启用』文字格式化(最多显示4个汉字)
			var filters = this.enableType.filter(function(item) {
				return item.selected;
			})[0];
			if (filters) {
				if (filters.label == '全部') {
					return '是否启用';
				} else {
					return filters.label.substring(0, 4);
				}
			} else {
				return '';
			}
		},
	},
	mounted() {
		this.calcMescrollTop();
		uni.$on('refreshTempleList', res => {
			if (res == 'refresh') {
				this.refresh();
			}
		});
	},
	methods: {
		// ------------- methods导航栏 ---------------
		onBack() {
			// uni.switchTab({
			// 	url: '/pages/my/my'
			// });
			uni.navigateBack({
				delta: 1
			})
		},
		// 新增模板
		goTempletInfo() {
			uni.navigateTo({
				url: '/pages/mySub/TempletInfo/TempletInfo'
			});
		},
		// -------------------- methods顶部筛选 -------------------
		// 触发「模板类型」dropdown的显示隐藏
		templTypeToggle() {
			this.isShowTemplType = !this.isShowTemplType;
		},
		// 选择模板类型
		seleTemplType(item) {
			this.isShowTemplType = false;
			if (item.selected) return;
			this.templType.forEach(function(listItem) {
				listItem.selected = false;
			});
			item.selected = true;
		},
		// 触发「是否启用」dropdown的显示隐藏
		enableTypeToggle() {
			this.isShowEnableType = !this.isShowEnableType;
		},
		// 选择启用类型
		seleEnabelType(item) {
			this.isShowEnableType = false;
			if (item.selected) return;
			this.enableType.forEach(function(listItem) {
				listItem.selected = false;
			});
			item.selected = true;
		},
		// 筛选 mask 遮罩
		hideDropdownAndMask() {
			this.isShowTemplType = false;
			this.isShowEnableType = false;
		},

		//编辑短信模板跳转
		editTemplet(id) {
			//跳转地址
			uni.navigateTo({
				url: '/pages/mySub/TempletInfo/TempletInfo?id=' + id
			});
		},
		// 关闭删除模块
		close() {
			this.$refs.deletePopup.close();
		},
		// 确定删除模块
		async DeleteCY67() {
			let self = this;
			let data = this.waitDelete;
			let result = await CY67.Delete(data);
			this.$refs.deletePopup.close();
			this.refresh();
			this.toast1Tap();

		},
		toast1Tap() {
			uni.showToast({
				title: "删除成功"
			})
		},

		// ------------------- methodsMescroll配置 ------------------------
		/*下拉刷新的回调 */
		downCallback(mescroll) {
			if (this.isShowTemplType || this.isShowEnableType) return;
			this.mescrollSingle = mescroll;
			mescroll.resetUpScroll(); // 重置列表为第一页 (自动执行 page.num=1, 再触发upCallback方法 )
		},
		/*上拉加载的回调*/
		async upCallback(mescroll) {
			// 此时mescroll会携带page的参数:
			let pageNum = mescroll.num; // 页码, 默认从1开始
			let pageSize = mescroll.size; // 页长, 默认每页10条

			let data = this.SMSTempletQuery;
			data.storeID = this.$storage.getAppUserInfo().currentStoreId;
			//控制筛选条件 模板类型/是否启用
			if (this.searchObj.templetStyle !== '') {
				data.messageTemplateType = this.searchObj.templetStyle;
			}else{
				data.messageTemplateType =null;
			}
			if (this.searchObj.isStartUse !== '') {
				data.isEnable = this.searchObj.isStartUse;
			}else{
				data.isEnable =null;
			}

			data.pageIndex = pageNum;
			data.pageSize = pageSize;

			// 获取模板列表
			let result = (await CY67.GetSmsTemplateFilter(data)).result;
			if (result.dataList) {
				// 接口返回的当前页数据列表 (数组)
				let curPageData = result.dataList;
				// 接口返回的总页数 (比如列表有26个数据,每页10条,共3页; 则totalPage值为3)
				let totalPage = Math.ceil(result.rowCount / PAGESIZE);
				//设置列表数据
				if (mescroll.num == 1) {
					this.smsTtmpletData = []; //如果是第一页需手动置空列表
				}
				this.smsTtmpletData = this.smsTtmpletData.concat(curPageData); //追加新数据
				//方法一(推荐): 后台接口有返回列表的总页数 totalPage
				mescroll.endByPage(curPageData.length, totalPage);
			} else {
				// 失败隐藏下拉加载状态
				mescroll.endErr();
			}
		},
		// 刷新列表
		refresh() {
			this.mescrollSingle.resetUpScroll && this.mescrollSingle.resetUpScroll();
		},
		// 删除短信模板
		deleTemplet(id) {
			this.$refs.deletePopup.open();
			this.waitDelete = id
		},
		// ---------------------- methodsUI处理 -------------------------
		// 计算mescroll距离顶部距离
		calcMescrollTop() {
			this.$nextTick(() => {
				const query = uni.createSelectorQuery().in(this);
				query.select('.top-filter-wrapper').boundingClientRect(data => {
					this.topFilterWrapperBottom = data.bottom.toString();
				}).exec();
			});
		}
	},
	filters: {
		parseMessageTemplateType(value) {
			if (value == 1) {
				return '预订通知';
			} else if (value == 2) {
				return '跟踪短信';
			}
		},
		parseIsEnable(value) {
			if (value == 0) {
				return '未启用';
			} else if (value == 1) {
				return '已启用';
			}
		}
	},
	watch: {
		templType: { // 模板类型数组select变化
			deep: true,
			handler(array) {
				array.forEach((item, index) => {
					if (item.selected && item.label != this.searchObj.templetStyle) {
						if (item.label == '全部') {
							this.searchObj.templetStyle = '';
						} else {
							this.searchObj.templetStyle = item.label;
						}
						this.refresh();
					}
				})
			}
		},
		enableType: { // 启用类型数组select变化
			deep: true,
			handler(array) {
				array.forEach((item, index) => {
					if (item.selected && item.value !== this.searchObj.isStartUse) {
						if (item.value === '') {
							this.searchObj.isStartUse = '';
						} else {
							this.searchObj.isStartUse = item.value;
						}
						this.refresh();
					}
				})
			}
		},
	}
};
