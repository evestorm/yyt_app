import YHCstRecord from '@/service/YH/YHCstRecordAppService.js?v=12'
import YHCstRecordConf from '@/service/YH/YHCstRecordConfAppService.js'
import CY22 from '@/service/CY/CY22AppService.js';
import storage from '@/common/unistorage/index.js';
//组件
import uniPopup from '@/components/uni-popup/uni-popup.vue';
const app = getApp();
export default {
	data() {
		return {
			picDomain: app.globalData.PicDomain,
			banquetInfoSelected:-1,
			fileData:{
				id:"",
				cstName:"",//客户姓名
				cstPhone:"",//客户电话
				cstBirthday:"",//客户生日
				cstBirthday_date:'',
				cstJob:"",//客户职业
				cstAge:"",//客户年龄
				cstSex:"1",//客户性别(1,男;2,女)
				cstNationindex:'',
				cstNation:"",//客户民族
				cstAddress:"",//客户地址
				cstCompany:"",//单位
				cstRecordConfGUID:"",//档案配置GUID(YH_CstRecordConf)
				banquetOrderGUID:"",//宴会单GUID(YH_BanquetOrder)
				createdName:""//创建人
			},//页面显示的数据
			btnState:1,//页面按钮显示 1:创建档案(btn提交)  2:点击编辑前(btn删除+编辑) 3:点击编辑后(保存)
			title:'',
			companys:[],
        	isCompanysShow:false,//是否显示单位列表
			NationData:[],
		}
	},
	components: {uniPopup},
	onLoad(option){
		
		//需接收档案类型 宴会单id
		// console.log(option.id)
		var self=this;
		// console.log(storage.getAppUserInfo().userName);
		self.getNationData();
		if(option.banquetInfoSelected)
		{
			self.banquetInfoSelected= option.banquetInfoSelected;
		}
		if(option.id)
		{
			self.GetRecordConfDto(option.id);
			self.btnState=2;
			
			
		}else{
			self.fileData.cstRecordConfGUID=option.cstRecordConfGUID;
			self.fileData.banquetOrderGUID=option.banquetOrderGUID;
		}
		
		//获取档案id  banquetOrderGUID
		
		
	},
	methods: {
		//公司得到焦点 关闭提示
		companysShow(){
			this.isCompanysShow=true;
		},
		//公司失去焦点 关闭提示
		closeCompany(){
			setTimeout(()=>{
				this.isCompanysShow=false;
			}, 0)
			// this.queryFllow.clueUserCompany=this.companyNameText;
		},
		async getSearchCompany() {
					const self = this;
						let result=(await CY22.GetFilterEnterprise({
													cWCompanyID:storage.getAppUserInfo().cwCompanyID,
													name_like:self.fileData.cstCompany,
													quickCheckCode_like:self.fileData.cstCompany,
													})).result;
						self.companys = result.dataList;
					
					
				},
				// 选择单位
				gotoCompany(item) {
					this.fileData.cstCompany = item.name;
					const self = this;
					setTimeout(function() {
						self.companys = [];
					}, 1000)
				},
		//获取数据
		async GetRecordConfDto(id){
			var self=this;
			 let res=await YHCstRecord.GetRecordConfDto({
								            "id": id,
								            });
											self.fileData=res
											self.fileData= self.$util.null2str(self.fileData);
											if(self.fileData.cstBirthday!=null&&self.fileData.cstBirthday!='')
											{
												self.fileData.cstBirthday_date=self.fileData.cstBirthday.substring(0,10);
										    }
											
										
											self.fileData= Object.keys(self.fileData).map(k=>({[k]:(self.fileData[k]||'')})).reduce((d1,d2)=>({...d1,...d2}));
											
											if(self._(self.NationData).some(x=>x.name==self.fileData.cstNation))
														{
																		
													 self.fileData.cstNationindex=self._(self.NationData).findIndex(x=>x.name==self.fileData.cstNation);
																		
														}
							
		},
		//选择性别
		radioChange(evt) {
			// console.log(evt.target.value)
			this.fileData.cstSex=evt.target.value;
		},
		// 选择生日
		chooseDate(e) {
			// console.log(e.target.value)
			this.fileData.cstBirthday = e.target.value + ' 00:00:00';
			this.fileData.cstBirthday_date=e.target.value;
			
			// this.clueUserBirthdayDate = e.target.value;
		},
		async creatFile(){
			//创建档案
			var self=this;
			 delete this.fileData.id;
			 if(!self.checkMobile(self.fileData.cstPhone) )
			 {
				  uni.showToast({
				                             title: '手机号格式错误',
				                             icon: 'none'
				                         });
			 }
			 else{
				 self.fileData.createdName=storage.getAppUserInfo().userName;
				let res=await YHCstRecord.CreateByDto(self.fileData);
					
					uni.redirectTo({
						url: `/pages/banquetSub/banquetDetail/banquetDetail?banquetId=${this.fileData.banquetOrderGUID}&banquetInfoSelected=${this.banquetInfoSelected}`
					});
				
			 }
			
		},
		NationSelect(e) {
		    let index = e.target.value;
		    this.fileData.cstNation = this.NationData[
		        index
		    ].name;
		},
		getNationData()
		{
		this.NationData=[
					{id:1 ,name:'汉族'},
					{id:2 ,name:'蒙古族'},
					{id:3 ,name:'回族'},
					{id:4 ,name:'藏族'},
					{id:5 ,name:'维吾尔族'},
					{id:6 ,name:'苗族'},
					{id:7 ,name:'彝族'},
					{id:8 ,name:'壮族'},
					{id:9 ,name:'布依族'},
					{id:10,name:'朝鲜族'},
					{id:11,name:'满族'},
					{id:12,name:'侗族'},
					{id:13,name:'瑶族'},
					{id:14,name:'白族'},
					{id:15,name:'土家族'},
					{id:16,name:'哈尼族'},
					{id:17,name:'哈萨克族'},
					{id:18,name:'傣族'},
					{id:19,name:'黎族'},
					{id:20,name:'傈僳族'},
					{id:21,name:'佤族'},
					{id:22,name:'畲族'},
					{id:23,name:'高山族'},
					{id:24,name:'拉祜族'},
					{id:25,name:'水族'},
					{id:26,name:'东乡族'},
					{id:27,name:'纳西族'},
					{id:28,name:'景颇族'},
					{id:29,name:'柯尔克孜族'},
					{id:30,name:'土族'},
					{id:31,name:'达翰尔族'},
					{id:32,name:'么佬族'},
					{id:33,name:'羌族'},
					{id:34,name:'布朗族'},
					{id:35,name:'撒拉族'},
					{id:36,name:'毛南族'},
					{id:37,name:'仡佬族'},
					{id:38,name:'锡伯族'},
					{id:39,name:'阿昌族'},
					{id:40,name:'普米族'},
					{id:41,name:'塔吉克族'},
					{id:42,name:'怒族'},
					{id:43,name:'乌孜别克族'},
					{id:44,name:'俄罗斯族'},
					{id:45,name:'鄂温克族'},
					{id:46,name:'德昂族'},
					{id:47,name:'保安族'},
					{id:48,name:'裕固族'},
					{id:49,name:'京族'},
					{id:50,name:'塔塔尔族'},
					{id:51,name:'独龙族'},
					{id:52,name:'鄂伦春族'},
					{id:53,name:'赫哲族'},
					{id:54,name:'门巴族'},
					{id:55,name:'珞巴族'},
					{id:56,name:'基诺族'},
			];
			
		
		},
		editFile(){//编辑档案
			this.btnState=3;
		},
		async updateFile(){//更新档案
		         var self=this;
		         if(!self.checkMobile(self.fileData.cstPhone) )
		         {
		         				  uni.showToast({
		         				                             title: '手机号格式错误',
		         				                             icon: 'none'
		         				                         });
		         }
		         else{
					  self.fileData.createdName=storage.getAppUserInfo().userName;
		         	let res=await YHCstRecord.UpdateByDto(this.fileData);
						
						uni.showToast({
						  title: '修改成功',
						  icon: 'none'
						});
						self.btnState=2;
		         		// uni.redirectTo({
		         		// 	url: `/pages/banquetSub/banquetDetail/banquetDetail?banquetId=${this.fileData.banquetOrderGUID}&banquetInfoSelected=${this.banquetInfoSelected}`
		         		// });
		         
		       	}
		},
		checkMobile(mobile){
				    // return RegExp(/^1[123456789]\d{9}$/).test(mobile);
			return RegExp(/^[0]\d{2}([-]?)\d{8}$|^[0]\d{3}([-]?)\d{7,8}$/).test(mobile) || RegExp(/^1[1234576890]\d{9}$/).test(mobile);
		},
		//删除档案
		delFile(){
			this.$refs.delPopup.open();
		
		},
		cancel(){
			 this.$refs.delPopup.close();
		},
		async confirm()
		{
			var self=this;
			let res=await YHCstRecord.Delete({
				            "id": self.fileData.id,
				            });
							
			uni.redirectTo({
									url: `/pages/banquetSub/banquetDetail/banquetDetail?banquetId=${this.fileData.banquetOrderGUID}&banquetInfoSelected=${this.banquetInfoSelected}`
								});
							
				
			
		},
	},
	watch: {
		
		 'fileData.cstCompany': {
						         handler: function() {
									 var self=this;
									
						           this.getSearchCompany();
						         },
						     },
		 'fileData.cstRecordConfGUID': {
		         async handler() {
					 var self=this;
					 let res=await YHCstRecordConf.GetViewDto({
					            "id": self.fileData.cstRecordConfGUID,
					            });
								self.title=res.cstRecordConfName
					
		           
		         },
		     }
	}
}