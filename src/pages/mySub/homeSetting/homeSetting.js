import {
	mapState,
	mapMutations,
	mapActions
} from 'vuex';
import storage from '@/common/unistorage/index.js';
import moment from '@/lib/moment/moment.min.js';
import cw from '@/common/ceiwei/common.js';
import UR01 from '@/service/UR/UR01AppService.js';
import {
	swMenuList,
	swOperateSettingsList
} from '@/static/mock/home.js';

export default {
	data() {
		return {
			// 对应需要显示的标题
			props: {
				label: 'name'
			},
			userInfo: storage.getAppUserInfo(),
			tempList: [],
		};
	},
	computed: {
		// ...mapState({
		// 	menuList: state => {
		// 		return state.user.userInfo.appInJson.configs
		// 	},
		// 	operationList: state => {
		// 		return state.user.userInfo.userHomeConfig.configs
		// 	},
		// });
		menuList() {
			// 每次把已经设置为展示的模块顺序展示在非展示模块以前
			let configs = this._.cloneDeep(storage.getAppUserInfo().appInJson.configs).sort((a, b) => {
				return Number(b.isOpen) - Number(a.isOpen)
			});
			let isOpens = configs.filter(v => v.isOpen == 1).sort((a, b) => Number(a.sort) - Number(b.sort));
			let isUnOpens = configs.filter(v => v.isOpen == 0).sort((a, b) => Number(a.sort) - Number(b.sort));
			let concat = [...isOpens, ...isUnOpens];
			return concat;
		},
		operationList() {
			return storage.getAppUserInfo().userHomeConfig.configs
		},
	},
	onLoad() {
		let userInfo = storage.getAppUserInfo();
		console.log('[homeSettings,onLoad]', userInfo);
		this.setUserInfo(userInfo);
		this.userInfo = userInfo;
		this.use
		// 重置图标后调用
		// this.initSettingsIcon();
		// console.log({swMenuList, swOperateSettingsList });
	},
	components: {},
	methods: {
		...mapMutations(['setUserInfo']),
		// 拖动事件
		/**
		 * @description 快速菜单/运营板块排序事件
		 * @param {Object} e {data: 操作的数据, frontData: 插到谁后面}
		 * 		@note 如果 frontData 为undefined,代表操作的数据插入到了第一行,因为第一行前面没有数据了,所以为undefined
		 * @param {String} board 板块名 哪个板块触发的排序事件
		 */
		onDragChange(e, board) {
			let configs;
			switch (board) {
				case 'menuList':
					configs = this.userInfo.appInJson.configs.sort((a, b) => {
						return Number(b.isOpen) - Number(a.isOpen)
					});
					break;
				case 'operationList':
					configs = this.userInfo.userHomeConfig.configs;
				default:
					break;
			}

			let index = configs.findIndex(v => v.code == e.data.code);
			let find = configs.find(v => v.code == e.data.code);
			let tindex = e.data.index;
			console.log(`当前拖动元素下标: ${index}, 拖动到的位置下标: ${tindex}`);

			if (index > tindex) {
				//如果当前元素在拖动目标位置的下方，先将当前元素从数组拿出，数组长度-1，我们直接给数组拖动目标位置的地方新增一个和当前元素值一样的元素，
				//我们再把数组之前的那个拖动的元素删除掉，所以要len+1  
				configs.splice(tindex, 0, configs[index]);
				configs.splice(index + 1, 1);
				configs.forEach((v, idx) => {
					v.sort = idx + 1;
				});
			} else {
				//如果当前元素在拖动目标位置的上方，先将当前元素从数组拿出，数组长度-1，我们直接给数组拖动目标位置+1的地方新增一个和当前元素值一样的元素，  
				//这时，数组len不变，我们再把数组之前的那个拖动的元素删除掉，下标还是index  
				configs.splice(tindex + 1, 0, configs[index]);
				configs.splice(index, 1);
				configs.forEach((v, idx) => {
					v.sort = idx + 1;
				});
			}
			this.tempList = configs;
		},
		// 板块switch展示隐藏
		triggerOpenStatus(code) {
			let configs;
			
			configs = this.userInfo.appInJson.configs;
			// console.log(code);
			if (configs) {
				if (code.indexOf('m') > -1) {
					configs.map((item, index) => {
						if (item.code == code) {
							item.isOpen = item.isOpen == '1' ? '0' : '1';
						}
					});
				} else if (code.indexOf('o') > -1) {
					configs.map((item, index) => {
						if (item.code == code) {
							item.isOpen = item.isOpen == '1' ? '0' : '1';
						}
					});
				}
			} else {
				// console.log({
				// 	userInfo
				// });
			}
			configs.forEach((v, idx) => {
				v.sort = idx + 1;
			});
			this.tempList = configs;
		},
		onBack() {
			uni.navigateBack({
				delta: 1
			})
		},
		// 保存配置
		async saveTheConfig() {
			console.log(this.userInfo.appInJson);
			console.log(this.tempList);
			// debugger
			let data = {
				uR01ID: this.userInfo.id,
				// appInJson: JSON.stringify(this.userInfo.appInJson),
				appInJson: JSON.stringify({configs: this.tempList}),
				appOperateJson: JSON.stringify(this.userInfo.userHomeConfig),
				storeId: this.userInfo.currentStoreId
			};
			let result = await UR01.SetAppHomeConfig(data);
			console.log(result);
			if (result) {
				// 更新storage+vuex
				storage.setAppUserInfo(this.userInfo);
				this.setUserInfo(this.userInfo);
				uni.showToast({
					title: '保存成功~',
					success: function() {
						setTimeout(() => {
							uni.navigateBack({
								delta: 1
							})
						}, 2000)
					},
					duration: 2000
				});
			}
		},
		// 配置更新或者更改icon后调用此方法,配置信息在 /static/mock/home.js 中更改
		initSettingsIcon() {
			// 快速菜单
			let configs = this.userInfo.appInJson.configs;
			for (let i = 0; i < configs.length; i++) {
				for (let j = 0; j < swMenuList.length; j++) {
					// console.log(configs[i].code, swMenuList[j].code)
					if (configs[i].code == swMenuList[j].code) {
						configs[i].icon = swMenuList[j].icon
					}
				}
			}

			// 运营概况
			let configs2 = this.userInfo.userHomeConfig.configs;
			for (let i = 0; i < configs2.length; i++) {
				for (let j = 0; j < swOperateSettingsList.length; j++) {
					if (configs2[i].code == swOperateSettingsList[j].code) {
						configs2[i].icon = swOperateSettingsList[j].icon
					}
				}
			}
		},
	}
}
