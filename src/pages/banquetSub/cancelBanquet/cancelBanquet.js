import storage from '@/common/unistorage/index.js';
import YHClue from '@/service/YH/YHClueAppService.js';
import FWBizOption from '@/service/FW/FWBizOptionAppService.js';
import uniPopup from "@/components/uni-popup/uni-popup.vue"
const app = getApp();
export default {
	async onNavigationBarButtonTap(val) { //保存按钮
		let self = this;
		// this.getUpFllow(this.queryFllow);
		this.queryData.clueStatus = 2;
		this.queryData.modifiedName = this.$storage.getAppUserInfo().userName;
		let res=await YHClue.UpdateByDto(this.queryData); 
			// console.log(res)
			if (res.length != 0) {
				let id = res.id;
				uni.$emit('reloadMyBanquePage', 'refresh');
				uni.navigateBack({
					delta: 1
				});
			}
		
	},
	components: {
		uniPopup
	},
	data() {
		return {
			picDomain: app.globalData.PicDomain,
			queryData: {
				id: '', //主键
				clueCancleReason: '', //取消原因
			}, //请求数据
			textearaLength: 0, //	texteara显示输入字数
			edits: [],
			isEdit: false, //是否启动编辑
			editInput: '', //快捷数据输入框数据
			storeId: '',
			remark: '', //备注
			delId:'',//删除快捷备注的id
		}
	},
	onLoad(option) {
		this.queryData.id = option.id;
		// if (option.clueCancleReason == 'null') {
		// 	this.queryData.clueCancleReason = '';
		// } else {
		// 	this.queryData.clueCancleReason = option.clueCancleReason;
		// 	this.textearaLength = option.clueCancleReason.length;
		// }
		this.storeId = this.$storage.getAppUserInfo().currentStoreId;
		this.getGridDto();
	},
	watch: {
		'queryData.clueCancleReason': { //texteara显示输入字数
			handler: function(val, old) {
				// console.log(val.length)
				this.textearaLength = val.length;
			}
		}
	},
	methods: {
		// 返回上一页
		onBack() {
			// #ifdef H5
			// 当前有多少个uniapp页面栈实例，就返回多少次历史记录条数
			if (getCurrentPages().length == 1) {
				cw.backToHome(getCurrentPages().length);
			} else {
				uni.navigateBack({
					delta: 1
				})
			}
			// #endif
		},
		showEdit() { //点击编辑按钮
			this.isEdit = this.isEdit == true ? false : true;
		},
		pushRemark(str) { //点击快捷备注文字
			if (this.queryData.clueCancleReason.length == 0) {
				this.queryData.clueCancleReason = str
			} else {
				this.queryData.clueCancleReason += ',' + str
			}
		},
		delRemark(id){//删除快捷备注
			this.delId=id;
			this.$refs.delRemarkItem.open();
		},
		addPopup() {
			this.$refs.cancelPopup.open();
		},
		//获取快捷备注
		async getGridDto() {
			let data = {
				"order": "OrderCode  desc",
				"viewName": "view_FW_BizOption",
				"filter": `{"Type":"and","conditions":[{"Attribute":"buUnitGUID","Datatype":"nvarchar","Operatoer":"eq","Value":'${this.storeId}'},{"Attribute":"bizParamCode","Datatype":"nvarchar","Operatoer":"eq","Value":"ClueCancelRemark"}]}`,
				"page": 1,
				"rows": 20,
				"select": "id,BizOptionName"
			};
			// data.storeId=this.storeId
			// data.bizParamCode='ClueCancelRemark';
			let res=await FWBizOption.GetGridDto(data);
				// console.log(res)
				if (res) {
					this.edits = res.rows;
					// console.log(this.edits.length,this.isEdit)
					if(this.edits.length==0){
						this.isEdit=false;
					}
				}
			
		},
		//添加快捷备注
		async qdChangCustomer() {
			let data = {};
			data.storeId = this.storeId;
			data.bizParamCode = 'ClueCancelRemark';
			data.bizOptionName = this.editInput;
			if (this.editInput.length != 0) {
				let res=await FWBizOption.CreateDictOption(data);
					// console.log(res)
					if (res) {
						this.$refs.cancelPopup.close();
						this.getGridDto();
						this.editInput = '';
					}
				
			} else {
				uni.showToast({
					title: '添加失败,快捷备注不能为空!',
					icon: 'none'
				});
				this.$refs.cancelPopup.close();
			}

		},
		//删除快捷备注
		async deleteByDto() {
			let data = {};
			data.id = this.delId;
			let res=await FWBizOption.DeleteByDto(data);
				this.$refs.delRemarkItem.close();
				this.getGridDto();
				
			
		},
		closePopup(){
			this.$refs.delRemarkItem.close();
		},
		//取消快捷备注
		qxChangCustomer() {
			this.$refs.cancelPopup.close();
		}
	}

}
