import YHThemeConf from '@/service/YH/YHThemeConfAppService.js'
import YHBanquetOrder from '@/service/YH/YHBanquetOrderAppService.js'
import storage from '@/common/unistorage/index.js'
const app = getApp();
export default {
	// 右上角保存按钮
	async onNavigationBarButtonTap(e) {
		// this.themeId
		let data={
			storeId:storage.getAppUserInfo().currentStoreId,//门店idId
			modifiedName:storage.getAppUserInfo().userName,//操作人
			banquetOrderGUID:this.banquetOrderGUID,//宴会单id
			themeConfGUID:this.themeId,//主题id
			themeConfName:this.themeConfName,//主题名称
		}
		//创建主题
		let res=await YHBanquetOrder.CreateBanquetExectue(data);
			// console.log(res)
			// 通知宴会详情已经新增成功 by evestorm
			uni.$emit('changeThemeForBanquetDetail');
			uni.navigateBack({
				delta:1
			})
			// uni.redirectTo({
			// 	url: `/pages/banquetSub/banquetDetail/banquetDetail?banquetId=${this.banquetOrderGUID}&banquetInfoSelected=${2}`
			// });
		
	},
	data() {
		return {
			picDomain: app.globalData.PicDomain,
			banquetOrderGUID:'',//宴会单id
			storeId:storage.getAppUserInfo().currentStoreId,//门店idId
			themeConfListItem:[],//主题列表
			typeId:0,//宴会类型点击切换控制class
			themeId:0,//主题切换class;选择的主题id
			themeConfName:'',//选择的主题名称
			
		}
	},
	async onLoad(option){
		// console.log(option)
//?????获取宴会单id=?
		this.banquetOrderGUID=option.banquetOrderGUID;
		// this.banquetOrderGUID='b35919a5-cd1f-ea11-ba53-fc0e03bf8d3e';
		//获取宴会主题信息
		let res=await YHThemeConf.GetThemeConfList({storeId:this.storeId});
			this.themeConfListItem=res.getThemeConfListItems;
			this.typeId=this.themeConfListItem[0].bookOrderTypeID;
		
	},
	methods: {
		changeOrderType(id){//选择宴会类型
		console.log(id);
			this.typeId=id;
		},
		changeTheme(id,name){//选择主题
			this.themeId=id;
			this.themeConfName=name
			console.log(name,id);
		},
	}
}