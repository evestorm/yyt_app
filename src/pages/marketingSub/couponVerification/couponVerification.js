// 作者:杨亮
//-------------------------Service引入----------------------------------
import GK07 from '@/service/GK/GK07AppService.js';

// 常量
let PageConstData = {
    // 卡券信息列表
	listArr: [{
		value: '昵称',
		key: 'nickName',
	},{
		value: '卡号',
		key: 'cardCode',
	},{
		value: '姓名',
		key: 'fullCstName',
	},{
		value: '卡券状态',
		key: 'cardStatusEnumValue',
	},{
		value: '手机号码',
		key: 'phone',
	},{
		value: '卡券类型',
		key: 'cardTypeEnumValue',
	},{
		value: '卡券姓名',
		key: 'cardName',
	}]
}

export default {
    data() {
        return {
            //---------------------常量------------------------
            PageConstData,
            //--------------------- 接口输入输出 ----------------------
            getCodeInfoIn: {
               cardCode: "", // 282020090743885
               order: "SmallProgramCardID desc",
               pageIndex: 1,
               pageSize: 1,
               // SmallProgramCardID: "GK063516700000119", // 不用传这个了
               storeID: this.$storage.getAppUserInfo().currentStoreId,
            },
            // 列表数据参数
            getCodeInfoOut: {
			},
            // --------------------------------------页面参数---------------------------
            urlOption: {}, // url参数
        };
    },
    // 页面加载事件
    onLoad(options) {
        this.urlOption = options;
    },
    methods: {
        // 获取卡券数据
        async getCardInfo() {
			if (!this.getCodeInfoIn.cardCode) return;
            let result = await GK07.GetUserCardList(this.getCodeInfoIn);
			
            // 判断接口是正常返回 没有报错
            if (result && result.dataList.length > 0) {
                this.getCodeInfoOut = result.dataList[0];
            } else {
				this.$cw.showError('您输入的卡券码无效');
				this.getCodeInfoOut = {};
			}
        },
		// 返回上一页
		onBack() {
			uni.navigateBack({
				delta: 1
			})
		},
		// 打开扫码界面
		openScanner() {
			if (this.$cw.isApp()) {
				this.$cw.popupScanner((code) => {
					this.getCodeInfoIn.cardCode = code;
					// this.getCodeInfoIn.cardCode = '2820200809537950';
					// 确认请求
					this.confirmSearch();
				});
			}
		},
		// 请求搜索卡券信息
		confirmSearch() {
			this.getCardInfo();
		},
		// 请求核销
		async triggerVerification() {
			// 核销
			let data = {
				smallProgramCardID: '',
				cardCode: this.getCodeInfoOut.cardCode,
				storeID: this.$storage.getAppUserInfo().currentStoreId,
				userID: this.$storage.getAppUserInfo().userID,
			}
			let result = await GK07.WriteOffTheCard(data);
			if (result) {
				uni.showToast({
					title: '核销成功',
					duration: 1500,
				});
				setTimeout(() => {
					// 刷新状态
					this.getCardInfo();
				}, 2000);
			}
		},
		// 去客户详情
		gotoCustomerInfo() {
			if (!this.getCodeInfoOut['customerID']) return;
			uni.navigateTo({
				url: `/pages/_common/customInfo/customInfo?customerId=${this.getCodeInfoOut.customerID}`,
			});
		},
    },
    computed: {
    },
    // 职责:格式化数据
    filters: {
    },
    // 职责:数据变化后需要和接口交互
    watch: {
        // 监控查询条件的变化 自动请求数据
        //'calcGetStudentListIn': {
        //    handler(val, oldval) {
        //        if (this.$util.isChgForWatch(val, oldval, ['pageIndex', 'sarchValue'])) {
        //            this.getPageList();
        //        }
        //    },
        //    deep: true,
        //    immediate: true,
        //}
    }
};
