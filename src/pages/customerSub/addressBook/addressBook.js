//------------------------------ mock数据引入 ---------------------------
import addressBookMock from './addressBook_mock.js';

// --------------------------- 网络请求 ------------------------
import CY19 from '@/service/CY/CY19AppService.js';

// -------------------------- 组件 -----------------------------
import addressBookItem from './addressBookItem/addressBookItem.vue';
import virtualList from './virtualList/virtualList.vue';

// -------------------------- 工具 ------------------------
import cw from '@/common/ceiwei/common.js';
import util from '@/common/util.js';

const app = getApp();

export default {
	computed: {
		// 预估每组联系人高度172==>220
		estimatedItemSize() {
			return uni.upx2px(220);
		}
	},
	data() {
		return {
			picDomain: app.globalData.PicDomain,
			bookList: [],
			bookQuerydata: [],
			list: ['A', 'B', 'C', 'D', 'E', 'F', 'G', 'H', 'I', 'J', 'K', 'L', 'M', 'N', 'O', 'P', 'Q', 'R', 'S', 'T', 'U', 'V',
				'W', 'X', 'Y', 'Z'
			],
			listCur: '', //右侧导航点击选择文字
			hidden: true, //隐藏点击显示的文字
			listCurID: '',
			boxTop: '', // indexBar-box 索引容器的top值
			searchStr: '', //筛选
			isShow: false,
			Allarr: [], //筛选联系人数组
			searchDataList: [], //筛选后的结果
			isNoSearch: false, //没有搜索结果
			cacheForIndex: [], // 缓存所有元素的位置信息
			str: '', // 联系人json
		};
	},
	watch: {
		"searchStr": {
			handler: function(val, oldval) {
				this.getSearchData(val);
			}
		},
		"str": {
			handler(val) {
				if (val) {
					this._(val).forOwn((value, key) => {
						let obj1 = {};
						obj1.customSaveName = value;
						obj1.phone = key;
						this.bookQuerydata.push(obj1);
					})
					if (this.bookQuerydata.length == 0) {
						uni.showToast({
							title: '无联系人'
						})
					} else {
						this.refresh();
					}
					this.listCur = this.list[0];
				}
			}
		}
	},
	// onHide() {
	// 	if (window.bounceTouchmove) {
	// 		window.removeEventListener('touchmove', window.bounceTouchmove);
	// 	}
	// },
	created() {
		// 由于隔壁通话记录用了mescroll，导致android下通讯录无法滚动。
		// 无法滚动原因是mescroll会判断当前页面的 uni-page 是否有 use_mescroll 属性，有就拦截touchmove自己处理
		// 所以在进入此页面的时候，得把这个属性时删除
		let uniPage = document.querySelector('uni-page');
		uniPage.removeAttribute('use_mescroll');
		// 判断是不是app且用户是否授权获取通讯录
		if (this.$cw.isApp(true)) {
			if (this.$cw.isiOS()) {
				this.$cw.canGetAddressBook((auth) => {
					if (auth) {
						this.$cw.getContacts((data) => {
							this.str = data;
							getApp().globalData.recordsData = data;
						});
					}
				});
			} else {
				this.$cw.getContacts((data) => {
					this.str = data;
					getApp().globalData.recordsData = data;
				});
			}
		} else {
			this.isShowContacts = true;
			this.str = addressBookMock.getContacts();
		}
	},
	mounted() {
		uni.$on('addContactsFromCallRecords', () => {
			// 刷新页面,关闭搜索操作
			this.refresh();
			this.cancel();
		});
		uni.$on('communicationScroll', (e) => {
			this.handleScroll(e);
		});
		uni.createSelectorQuery().select('.indexBar-box').boundingClientRect((res) => {
			if (res) {
				this.boxTop = res.top
				console.log(`indexBar-item的@touchend触发setCur`, this.boxTop);
			}
		}).exec();
	},
	components: {
		addressBookItem,
		virtualList
	},
	methods: {
		// 获取联系人
		getContacts(msg) {
			return JSON.parse(msg);
		},
		// 请求通讯录详情
		async refresh() {
			let res = await CY19.GetAddressBookInformation({
				"cwCompanyID": this.$storage.getAppUserInfo().cwCompanyID, //企业ID(UR07001)
				"customerData": this.bookQuerydata,
				"getInfoType": 1, //1 是通讯录 二是通讯记录
			});
			if (res) {
				// 聚合成一个数组
				this.bookList = res.userData.reduce((pre, cur) => {
					return pre.concat([{
						groupName: cur.groupName
					}, ...cur.customerDataList])
				}, []);

				this.list.forEach(v => {
					let filter = this.bookList.find(i => i.groupName == v);
					if (filter) {
						this.$refs[v][0].$el.className = 'indexBar-item active';
					}
				});
				let tempArr = [];
				// 第一个元素距离搜索栏高度
				let curTop = 0;
				this.bookList.forEach((v, idx) => {
					// 计算高度 = 如果是索引，高度为100，联系人item则为172==>220
					let height = v.groupName ? uni.upx2px(100) : uni.upx2px(220);
					// 计算完整锚点：
					tempArr.push({
						top: curTop,
						bottom: curTop + height,
						index: idx
					});
					// 当前分组top
					curTop = curTop + height;
				});
				this.cacheForIndex = tempArr;
				// let arr = [];
				// this._(this.bookList).forEach(x => {
				// 	arr = arr.concat(x.customerDataList)
				// })
				this.Allarr = this.bookList;
			}
		},
		searchClick() { //点击搜索
			this.isShow = true;
			this.searchDataList = [];
		},
		cancel() { //取消搜索
			this.isShow = false;
			this.searchStr = '';
			this.searchDataList = [];
			this.isNoSearch = false;
		},
		//搜索
		getSearchData(str) {
			if (str == '') {
				this.searchDataList = [];
				return;
			}
			let arr = [];
			this._(this.Allarr).forEach(item => {
				if (item.phone) { //排除ABC字母
					item = this.$util.null2str(item);
					this._(item).forOwn((value, key) => {
						if (key == 'customSaveName' || key == 'customerName' || key == 'phone') {
							console.log(value, str)
							let n = value.indexOf(str);
							console.log(n)
							if (n >= 0) {
								arr.push(item)
							}
						}
					})
				}
			})
			// this.searchDataList = arr;
			this.searchDataList = this._.uniqBy(arr, 'phone');
			if (arr.length == 0) {
				this.isNoSearch = true;
			} else {
				this.isNoSearch = false;
			}
			// console.log(this.searchDataList.length)
		},
		//去客户详情
		goCustomerInfo(id) {
			if (id) {
				uni.navigateTo({
					url: `/pages/_common/customInfo/customInfo?customerId=${id}&from=addressBook`,
				});
				this.searchStr = '';
				this.isShow = false;
			}
		},
		//去发短信
		goMessage(obj) {
			// console.log(obj)
			obj = this.$util.null2str(obj);
			let url =
				`/pages/customerSub/sendMsg/sendMsg?phone=${obj.phone}&customSaveName=${obj.customSaveName}&isClue=2&from=addressBook`;
			uni.navigateTo({
				url,
			});
		},
		//去打电话
		goCall(obj) {
			if (cw.isApp(true)) cw.callPhone(obj.phone,0);
		},
		//去新增客户
		goAdd(obj) {
			// console.log(obj)
			let cu = this.$util.null2str(obj);
			let url =
				`/pages/_common/addCustomerInfo/addCustomerInfo?customerName=${cu.customSaveName}&customerPhone=${cu.phone}&from=addressBook`;
			uni.navigateTo({
				url,
			});
			// this.isShow = false;
		},
		//---------------------------------右侧快捷导航栏--------------------------------
		//获取文字信息
		getCur(e) {
			this.hidden = false;
			this.listCur = this.list[e.target.id];
			console.log(`indexBar-item的@touchstart触发getCur:${e}`, this.listCur)
		},
		setCur(e) {
			this.hidden = true;
		},
		//滑动选择Item
		tMove: util.debounce(function(e) {
			let y = e.touches[0].clientY, // 当前手指y坐标
				offsettop = this.boxTop,
				that = this;
			console.log(`indexBar-box的@touchmove触发tMove`, {
				offsettop,
				y,
			});
			// this.$refs.indexToast.$el.style.top = y - uni.upx2px(100) / 2 + 'px';
			//判断选择区域,只有在选择区才会生效
			if (y > offsettop) {
				console.log(y, offsettop);
				let num = parseInt((y - offsettop) / 16);
				this.listCur = that.list[num];
				this.listCurID = this.listCur;
				if (num > that.list.length) {
					that.hidden = true;
				}
			}
		}, 0),
		//触发全部开始选择
		tStart() {
			console.log("indexBar-box的@touchstart触发tStart")
			this.hidden = false
		},
		//触发结束选择
		tEnd(e) {
			console.time('tEnd');
			console.log(`indexBar-box的@touchend触发tEnd:${e}`);
			this.hidden = true;
			this.listCurID = this.listCur;

			console.log("右侧导航栏外tEnd", this.listCurID);

			let scrollTop = -1;
			// 目标分组索引
			let targetGroupIdx = this.bookList.findIndex(v => v.groupName == this.listCurID);
			if (targetGroupIdx !== -1) {
				// 找到存储的对应top值
				scrollTop = this.cacheForIndex.find(v => v.index == targetGroupIdx).top;
			}
			this.$refs.virtualList.updateLocation(scrollTop);
			console.timeEnd('tEnd');
		},
	}
}
