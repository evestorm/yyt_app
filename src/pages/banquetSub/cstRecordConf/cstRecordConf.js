import {
	mapState,
	mapMutations,
	mapActions
} from 'vuex';
import storage from '@/common/unistorage/index.js';
import uniPopup from "@/components/uni-popup/uni-popup.vue"

import YHCstRecordConf from '@/service/YH/YHCstRecordConfAppService.js'
export default {
	
	// 右上角保存按钮
	onNavigationBarButtonTap(e) {
		var self=this;
		if(self.cstRecordConfGUID=="")
		{
			uni.showToast({
			  title: '请选择要填写的档案',
			  icon: 'none'
			});
		}
		else
		{
			// uni.showToast({
			//   title: '添加成功',
			//   icon: 'none'
			// });
			uni.redirectTo({
				url: `/pages/banquetSub/writeFile/writeFile?cstRecordConfGUID=${this.cstRecordConfGUID}&banquetOrderGUID=${this.banquetOrderGUID}&banquetInfoSelected=${this.banquetInfoSelected}`
			});
		}
	
	},
	components: {
		uniPopup
	},
	data() {
		return {
			banquetInfoSelected:-1,
			banquetOrderGUID:"083B59EA-E92E-4402-B932-08D781F316B7",
			CstRecordList:[],
			titletext:'请选择需要填写的档案',
			cstRecordConfGUID:"", 
		};
	},
	
	onLoad(data) {
	  let self=this;
	  if(data.banquetOrderGUID)
	  {
		  self.banquetOrderGUID=data.banquetOrderGUID;
	  }
	  if(data.banquetInfoSelected)
	  {
	  		  self.banquetInfoSelected=data.banquetInfoSelected;
	  }
	
	  self.GetCstRecord();
	},
	computed: {
		
	},
	
	methods: {
		//点击
		radioChange(evt){
			this.cstRecordConfGUID=evt.detail.value;
		},
		//获取档案类型
	    async GetCstRecord(){
			var self=this;
			let res=await YHCstRecordConf.GetCstRecordConf({
			           "banquetOrderGUID": self.banquetOrderGUID,
			           });
					   // console.log(res);
							self.CstRecordList=res.recordConfList;
							
				
			
		}
		
		
	},
	watch: {
		
	}
}