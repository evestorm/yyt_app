// 作者:杨亮

//------------------------------importmock数据---------------------------
import digBanquetCluesMock from './digBanquetClues_mock.js';
//------------------------------import组件-------------------------------
import digBanquetCard from './dig-banquet-card/dig-banquet-card.vue';
//-------------------------import请求----------------------------------
import YHClue from '@/service/YH/YHClueAppService.js';
const app = getApp();
const PAGESIZE = 10; // 每页多少条数据

export default {
	components: {
		digBanquetCard, // 线索item
	},
	data() {
		return {
			picDomain: app.globalData.PicDomain,
			// ------------------- data时间选择picker参数 ---------------------------
			// 时间范围picker的默认值设置(开始范围[str],结束范围[str],默认范围[arr])
			startDateStr: this.$moment().subtract(10, 'years').format('YYYY'),
			endDateStr: this.$moment().add(10, 'years').format('YYYY'),
			// ['2010','01','01','-','2030','01','01']
			defaultDateRangeArr: [...this.$moment().format('YYYY-MM-DD').split('-'), '-', ...this.$moment().format('YYYY-MM-DD')
				.split('-')
			],

			// ------------------- data列表数据请求 ----------------
			query: {
				startMonth: this.$moment().format('YYYY-MM'),
				endMonth: this.$moment().format('YYYY-MM'),
				storeId: this.$storage.getAppUserInfo().currentStoreId,
				pageIndex: 1,
				pageSize: PAGESIZE,
			},
			pageList: [], // 请求到的列表原数据
			curListRowCount: 0, // 当前筛选列表总条数

			// ----------------------- data批量操作相关 ----------------------------
			isBatch: false, // 批量操作显示与否
			isAllSel: false, // 底部批量操作的全选按钮选中状态
			ids: [], // 批量选中的挖掘机会id
			chanceDataGUID: '', // 全选打标签等操作时，要传递的id们

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
			navFilterBottom: 260, // 顶部筛选bottom高度,mescroll 距顶高度
			swBottom: 0, // mescroll 距底高度
		};
	},
	// 页面加载事件
	onLoad(options) {

	},
	methods: {
		// methods显示时间范围picker
		clickDateRange() {
			this.$nextTick(() => {
				this.$refs.dateRangePicker.show();
			});
		},
		// 确认时间范围
		onConfirmDateRange(val) {
			// console.log(val);
			this.query.startMonth = this.$moment(val.from).format('YYYY-MM');
			this.query.endMonth = this.$moment(val.to).format('YYYY-MM');
			this.refresh();
		},
		// ---------------------- methods批量操作 --------------------------------
		// 底部切换取消/全选
		toggleAllSel() {
			this.isAllSel = !this.isAllSel;
			let ids = [];
			this.calcPageList.forEach(item => {
				item.selected = this.isAllSel && !item.isAdded;
				// 如果被选中，添加到ids集合中，否则不作任何操作
				item.selected ? ids.push(item.bookOrderID) : false;
			});
			this.ids = ids;
		},
		// 切换批量操作
		toggleBatch() {
			if (!this.calcPageList.length) {
				this.$cw.showError('暂无数据');
				return;
			};
			this.isBatch = !this.isBatch;
		},
		// 批量添加线索
		async addTheClues() {
			let ids = this.getBookOrderIDs();
			if (!ids.length) {
				this.$cw.showError('请选择挖掘线索!', 2000);
				return;
			};
			this.ids = ids;
			// 判断是否全选，全选则传给后端标识
			const chanceDataGUID = this.isAllSel ? this.chanceDataGUID : '';
			const data = {
				chanceIds: this.ids, // id集合 数组
				createdName: this.$storage.getAppUserInfo().userName, // 创建人名称
				chanceDataGUID: chanceDataGUID, // 全选缓存数据id
			};
			const result = await YHClue.BatchAddYHClueByChance(data);
			if (result && result.success !== false) {
				uni.showToast({
					title: '批量添加成功！'
				});
				// 添加成功后，同步修改被选item状态
				this.calcPageList.forEach(v => {
					if (this.ids.includes(v.bookOrderID)) {
						v.isAdded = true;
						v.selected = false;
					}
				});
				// 取消全选状态，清空选中ids
				this.isBatch = false;
				this.ids = [];
				uni.$emit('reloadPage', 'refresh');
				uni.$emit('freshSearch', 'refresh');
			}
		},
		// 返回数组形式的当前选中挖掘线索id们
		getBookOrderIDs() {
			let ids = [];
			this.calcPageList.forEach(item => {
				if (item.selected) {
					ids.push(item.bookOrderID)
				}
			});
			return ids;
		},
		// uni-app复选框事件监听
		checkboxChange(e) {
			this.ids = e.detail.value;
			this.calcPageList.forEach((v, index) => {
				// 设置属性需要通过这种方式设置 不然没办法双向绑定  其他设置为false
				this.$set(v, 'selected', this.ids.includes(v.bookOrderID))
			});
			// 判断是否是全选(先筛选出未跟踪状态的，再看筛选出来的是否都是选中状态)
			var allSelected = this.calcPageList.filter(v => !v.isAdded).every(v => v.selected);
			this.isAllSel = allSelected ? true : false;
		},

		// ---------------------- methods数据请求 ------------------------------
		/*下拉刷新的回调 */
		downCallback(mescroll) {
			this.mescrollSingle = mescroll;
			mescroll.resetUpScroll(); // 重置列表为第一页 (自动执行 page.num=1, 再触发upCallback方法 )
		},
		/*上拉加载的回调*/
		async upCallback(mescroll) {
			// 此时mescroll会携带page的参数:
			let pageNum = mescroll.num; // 页码, 默认从1开始
			let pageSize = mescroll.size; // 页长, 默认每页10条

			let data = this.query;
			data.pageIndex = pageNum;
			data.pageSize = pageSize;
			// 获取客户列表
			// let result = digBanquetCluesMock.pageList;
			let result = await YHClue.GetClueChances(data);
			if (result) {
				let pageData = result.pagedResult;
				this.isAllSel = false;
				this.chanceDataGUID = result.chanceDataGUID ? result.chanceDataGUID : '';
				this.curListRowCount = pageData.rowCount;

				// 接口返回的当前页数据列表 (数组)
				let curPageData = pageData.dataList;
				// 接口返回的总页数 (比如列表有26个数据,每页10条,共3页; 则totalPage值为3)
				let totalPage = Math.ceil(pageData.rowCount / PAGESIZE);
				//设置列表数据
				if (mescroll.num == 1) this.pageList = []; //如果是第一页需手动置空列表
				this.pageList = this.pageList.concat(curPageData); //追加新数据
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
		// --------------- methods其他 -----------------
		// 单独添加线索
		async onAddTheClue(item) {
			// console.log('单独添加线索:', item);
			const data = {
				chanceIds: [item.bookOrderID], // id集合
				createdName: this.$storage.getAppUserInfo().userName, // 创建人名称
				chanceDataGUID: '', // 全选缓存数据id
			};
			const result = await YHClue.BatchAddYHClueByChance(data);
			if (result && result.success !== false) {
				uni.showToast({
					title: '添加成功！'
				});
				item.isAdded = true;
				item.selected = false;
				// 取消全选状态
				this.isBatch = false;
				uni.$emit('reloadPage', 'refresh');
				uni.$emit('freshSearch', 'refresh');
			}
		},
	},
	computed: {
		// 线索列表
		calcPageList() {
			let pageList = this.$util.null2str(this.pageList);
			pageList.forEach(v => {
				v.isAdded = v.isAdded ? true : false; // 0/1转为false/true
				this.$set(v, 'selected', this.ids.includes(v.bookOrderID)) // 初始化选中状态
			})
			return pageList;
		},
		// checkbox已选中所有客户的个数(底部展示用)
		checkboxSelectNum() {
			return this.calcPageList.filter(item => item.selected).length;
		}
	},
	filters: {
		//      formatSplit(value) {
		// return ` ${value} `;
		//      }
	},
	watch: {}
};
