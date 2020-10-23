import yytSegmentedControl from '@/components/yyt-segmented-control/uni-segmented-control.vue';
import CY67 from '@/service/CY/CY67AppService.js';
import storage from '@/common/unistorage/index.js';
export default {
	data() {
		return {
			current: 0, //选项卡转换
			storID: storage.getAppUserInfo() ? storage.getAppUserInfo().currentStoreId : '', //门店ID.
			marketID: storage.getAppUserInfo() ? storage.getAppUserInfo().marketerId : '', //客户经理id
			reserveList: [], //预订通知模板/
			followList: [], //跟踪短信
			isClue: 0, //是否是预订进来 isClue==3
		}
	},
	components: {
		yytSegmentedControl
	},
	async onLoad(option) {
		//只有从预订进来 才显示预订短信
		this.isClue = option.isClue;
		this.current = option.isClue == 3 ? 0 : 1;
		let res = await CY67.GetMessageTemplate({
			storID: this.storID,
			marketID: this.marketID
		});
		let data = res.templateList;
		if (data.length != 0) {
			for (let n = 0; n < data.length; n++) {
				if (data[n].typeName == '跟踪短信') {
					this.followList = data[n].templateList
				} else if (data[n].typeName == '预订通知') {
					this.reserveList = data[n].templateList
				}
			}
		}


	},
	methods: {
		onClickItem(n) { //更改选项卡
			if (this.current !== n) {
				this.current = n;
			}
		},
		checkMsg(msg) { //选择模板
		getApp().globalData.sendMsgPageData.MsgMould=msg;
			uni.navigateBack({
				delta: 1
			})
		}
	},
	computed: {
		compileInfo() {
			// 高亮替换参数
			return function(item) {
				let titleString = item.messageTemplateContent;
				if (!titleString) {
					return '';
				}
				if (item.messageTemplateContent.length > 0) {
					titleString = titleString.replace(/\【[^\)]*\】/g, function(val) {
						console.log(val);
						return '<span class="mark" style="color: #0183ff;">' + val + '</span>'
					});
				}
				return titleString;
			}
		}
	}
}
