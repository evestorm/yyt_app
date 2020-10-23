import YHCstRecordConf from '@/service/YH/YHCstRecordConfAppService.js'
import storage from '@/common/unistorage/index.js';
//组件
export default {
	onNavigationBarButtonTap(val) {
		// console.log('发送选择档案请求')
		
		//跳转填写档案页面
		if(this.fileId!=''){
			uni.redirectTo({
				url: `/pages/banquetSub/writeFile/writeFile?fileId=${this.fileId}&cstRecordConfName=${this.cstRecordConfName}`
			});
		}
		
	
	},
	onLoad(){
		// //获取获取档案类别
		// YHCstRecordConf.GetRecordConfList(this.fileQuery,res=>{
		// 	console.log('获取档案列表',res)
		// 	this.files=res.getRecordConfItems
		// })
	},
	data() {
		return {
			files: [{id:1,
			         value:2}],//档案列表
				fileQuery:{//获取档案的参数
					storeId:storage.getAppUserInfo().currentStoreId//门店id
				},
				fileId:'',//选中的档案id
				cstRecordConfName:'',//选中档案名称
				current: ''
		}
	},
	components: {},
	computed: {},
	methods: {
		radioChange(evt) {
			// console.log(evt.target)
			for (let i = 0; i < this.files.length; i++) {
				if (this.files[i].id === evt.target.value) {
					this.current = i;
					this.cstRecordConfName=this.files[i].cstRecordConfName
					break;
				}
			}
			this.fileId=evt.target.value;
		}
	}
}