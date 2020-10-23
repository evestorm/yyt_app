import {
	mapState,
	mapMutations,
	mapActions
} from 'vuex';
import storage from '@/common/unistorage/index.js';
import uniPopup from "@/components/uni-popup/uni-popup.vue"
// import {
// 	GetCstRecord
// } from '@/service/YH/YHCstRecordAppService.js'
import YHCstRecord from '@/service/YH/YHCstRecordAppService.js'
export default {
	
	// 右上角保存按钮
	onNavigationBarButtonTap(e) {
		
	uni.navigateTo({
		url: '/pages/banquetSub/addBanquetInfo/addBanquetInfo'
	});
	},
	components: {
		uniPopup
	},
	data() {
		return {
			banquetOrderGUID:"083B59EA-E92E-4402-B932-08D781F316B7",
			CstRecordList:[],
			titletext:'请选择需要填写的档案',
			          
		};
	},
	
	onLoad() {
	  let self=this;
	
	},
	computed: {
		
	},
	
	methods: {
		//点击
		radioChange(){
			
		},
		//获取档案类型
	    async getCstRecord(){
			var self=this;
			let res=await YHCstRecord.GetCstRecord({
			           "banquetOrderGUID": self.banquetOrderGUID,
			           });
					   // console.log(res);
							self.CstRecordList=res.recordConfList;
							
				
			
		}
		
		
	},
	watch: {
		
	}
}