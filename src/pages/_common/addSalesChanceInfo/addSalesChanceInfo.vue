<!-- 没用了这个页面 -->
<template>
	<view id="add-sales-chance-info">
		<!-- <z-nav-bar title="添加销售机会" bgColor="rgb(248, 248, 248)">
			<sw-icon type="back" size="27" slot="left" @tap="onBack"></sw-icon>
		</z-nav-bar> -->
		<view class="add-item">
			<view class="salse_header">
			    <view class="customerFocusCard_top_left_l_picArea" v-if="customData.customerPoolMarketName">
					<image mode="scaleToFill" class="salespersonPic" :src="getCustomerImg(customData)"></image>
					<view class="salespersonNamePic">
						<text>{{customData.customerPoolMarketName}}</text>
					</view>
				</view>
				<view class="salesPersonPicInfo" v-else>
					<image mode="scaleToFill" class="salespersonPic" v-if="customData.headImg" :src="getCustomerImg(customData)"></image>
					<image mode="scaleToFill" class="salespersonPic" src="https://pic.cwyyt.cn/upload/yytApp/images/salesperson.png" v-else></image>
				</view>
				<view class="salepersonName">
					<text>{{customData.customerName}}</text>
					<image mode="scaleToFill" class="sexPic" :src="picDomain + '/upload/yytApp/images/sex.png'"></image>
				</view>
				<view class="salepersonTel">
					<image mode="scaleToFill" class="telphonePic" :src="picDomain + '/upload/yytApp/images/telphone.png'"></image>
					<text>{{customData.phone}}</text>
				</view>
			</view>
		</view>
		<form @submit="formSubmit($event)">
			<view class="add-item">
				<view class="cu-form-group">
				    <view class="title">客户经理:</view>
				    <view class="set-manager">
				        <picker :value="index" @change="chooseSales" :range="sales" range-key="text">
				            <view class="picker">
				                <!-- <text class="desc" v-if="sales[index]">{{sales[index].marketerName}}</text> -->
				                <text class="desc">{{customData.marketerName}}</text>
				                <text class="text-gray icon iconfont icon-tools "></text>
				            </view>
				        </picker>
				    </view>
				</view>
				<view class="cu-form-group ">
					<!-- 仅做展示，不修改 -->
					<view class="title">客户等级:</view>
					<view class="customer-level-wrapper">
						<view class="customRank_icon">
							<view class="level-container">
								<view class="img-wrapper">
									<image class="level-img" mode="scaleToFill" :src="getLeveImg(customData)"></image>
								</view>
							</view>
						</view>
					</view>
				</view>
				<view class="cu-form-group">
				    <view class="title">生日:</view>
					<text v-if="customData.birthday">{{customData.birthday | parseShortDate}}</text>
				</view>
				<view class="cu-form-group">
				    <view class="title">机会日期:</view>
					<input class="desc" style="display: none;" type="text" name="chanceExpectOn" v-model="potentialPlanCreateDto.expectOn"></input>
					<picker class="desc" mode="date" :value="(potentialPlanCreateDto.expectOn  || '9999-99-99') | parseShortDate" @change="chooseDate($event)">
						<view class="picker">
							{{potentialPlanCreateDto.expectOn | parseShortDate}}
							<text class="text-gray  icon iconfont icon-riqi2"></text>
						</view>
					</picker>
				</view>
				<view class="cu-form-group">
					<label class="title">机会备注:</label>
					<input class="desc" placeholder="请输入机会备注" name="chanceRemark" v-model="potentialPlanCreateDto.remark"></input>
				</view>
			</view>
			<view class="add-item">
				<view class="quick-wrapper">
					<view class="quick-title-wrapper">
						<view class="quick-title">快捷备注</view>
						<view class="right-icon">
							<sw-icon :type="tagListIsOpen ? 'arrowup' : 'arrowdown'" size="20" @tap="changeRemarkWrapper"></sw-icon>
						</view>
					</view>
					<view class="quick-tag-list" :style="{height: tagListIsOpen ? 'auto' : '0'}">
						<view class="quick-tag-item"
							:class="{'active':currentSelectTag.id==cy63TagDataItem.tagID}"
							v-for="(cy63TagDataItem, index) in cy63TagData" :key="index"
							@tap="remarkClick(cy63TagDataItem)">
							{{cy63TagDataItem.tagContent}}
						</view>
					</view>
				</view>
			</view>
			<view class="padding flex flex-direction">
			    <button type="default" class="cu-btn bg-blue lg yyt_customerInfo_bottom" formType="submit">保存</button>
			</view>
		</form>
	</view>
</template>

<script>
	import cw from '@/common/ceiwei/common.js';
	import CY19 from '@/service/CY/CY19AppService.js';
	import CY24 from '@/service/CY/CY24AppService.js';
	import CY27 from '@/service/CY/CY27AppService.js';
	import CY63 from '@/service/CY/CY63AppService.js';
	import storage from '@/common/unistorage/index.js';
	import graceChecker from '@/common/ceiwei/graceChecker.js';
	import moment from '@/lib/moment/moment.min.js';
	const app = getApp();
	export default {
		data() {
			return {
				picDomain: app.globalData.PicDomain,
				// 机会日期
				date: cw.pikerGetDate(),
				startDate: cw.pikerGetDate('start'),
				endDate: cw.pikerGetDate('end'),
				tagListIsOpen: false, // 默认折叠机会面板
				
				customerId: '', // 接受的参数用户id
				customData: {
		
				},
				customerPic: '',
				levelData: {
		
				},
				potentialPlanCreateDto: {
					remark: '',
					expectOn: '',
				},
				cy63TagQuery: {
					PageIndex: 1,
					PageSize: 10000,
					Order: "tagID asc",
					StoreId:storage.getAppUserInfo().currentStoreId,
					TagType:4,
				},
				cy63TagData: [],
				// 当前选择的tag
				currentSelectTag: {
					id: 0,
					tagContent: ''
				},
				currentFollow: {
					value: storage.getAppUserInfo().marketerId,
					text: storage.getAppUserInfo().userName
				},// 当前跟踪人
				// 登录人各种权限
				salesAuthority: storage.getSalesAuthority(),
				sales: storage.getChooseMarketData(), // 销售经理列表
				index: 0, // 销售经理默认索引
			};
		},
		onLoad(payload) {
			this.customerId = payload.customerId;
			this.getCustom();
			//this.getCustomPic()
			this.getcy63TagData();
		},
		mounted() {
		},
		methods: {
			// 返回上一页
			onBack() {
				uni.navigateBack({
					delta:1
				});
			},
			// 折叠面板change事件
			changeRemarkWrapper() {
				this.tagListIsOpen = !this.tagListIsOpen;
			},
			//初始化销售经理选中状态
			getSalesInfo(){
				// console.log(this.customData);
				this.sales.forEach((v, index) => {
					if (v.value === this.customData.customerMarketerID) { // 如果该用户客户经理在经理列表中，就选中
						this.index = index;
					}
				});
			},
			// 提交表单
			formSubmit(e) {
			    //将下列代码加入到对应的检查位置
			    //定义表单规则
			    const rule = [
			        { name: "chanceExpectOn", checkType: "string", checkRule: "1,10", errorMsg: "请选择机会日期" },
			        { name: "chanceRemark", checkType: "string", checkRule: "1,100", errorMsg: "请输入机会备注" },
			    ];
			    //进行表单检查
			    const formData = e.detail.value;
			    const checkRes = graceChecker.check(formData, rule);
			    if (checkRes) {
					this.save();
			    } else {
			        uni.showToast({ title: graceChecker.error, icon: "none" });
			    }
			},
			remarkClick(item) {
				if (item.tagID == this.currentSelectTag.id) {
					this.currentSelectTag = {
						id: 0,
						tagContent: ''
					}
					var remark = this.potentialPlanCreateDto.remark;
					remark = this.potentialPlanCreateDto.remark.replace(item.tagContent, "");
					if (remark[0] == ",") {
						remark = this.potentialPlanCreateDto.remark.replace(item.tagContent + ",", "");
					}
					this.potentialPlanCreateDto.remark = remark;
				} else {
					this.currentSelectTag = {
						id: item.tagID,
						tagContent: item.tagContent
					}
					var remark = this.potentialPlanCreateDto.remark;
					if (remark) {
						remark = item.tagContent + "," + this.potentialPlanCreateDto.remark;
					} else {
						remark = item.tagContent;
					}
					this.potentialPlanCreateDto.remark = remark;
				}
			},
			//getCustom: function () {
			//    var self = this;
			//    var query = self.customQuery;
			//    abp.ajax({
			//        url: '/api/services/app/CY19/GetDto?' + $.param(query),
			//        data: JSON.stringify(query)
			//    }).done(function (result) {
			//        self.customData = result;
			//        //self.getLevel(result.levelID);
			//    });
			//},
			// 获取客户信息
			async getCustom () {
				var self = this;
				var data = {
					customerID: this.customerId
				}

				let result=await CY19.GetCustomDetailById(data);
					self.customData = result;
					// 根据获取的当前客户对应的客户经理，初始化客户经理选中状态
					self.getSalesInfo();
					//self.levelData = result.customerLevelImgUrl
					//self.customerPic = result.headImg
				
			},
			//getLevel: function (levelId) {
			//    var self = this;
			//    var query = {
			//        primaryKey: levelId
			//    };
			//    abp.ajax({
			//        url: '/api/services/app/CY24/GetDto?' + $.param(query),
			//        data: JSON.stringify(query)
			//    }).done(function (result) {
			//        self.levelData = result;
	
			//    });
			//},
			async getcy63TagData () {				
				const self = this;
			      var data = self.cy63TagQuery;
				 let result=(await CY63.GetLabelFilter(self.cy63TagQuery)).result;
			
					// console.log(result);
					// // ↓测试数据
					// result.dataList = Array.from({length: 50}).map((v, index) => {
					// 	return {
					// 	"tagID": "CY630001001" + index,
					// 	"tagType": 4,
					// 	"storeId": "STR00000041",
					// 	"tagContent": "爱吃咸菜" + index,
					// 	"businessName": "双湖园",
					// 	"branchName": "解放路店"
					//   }
					// });
					self.cy63TagData = result.dataList;
			
			},
			// 机会日期
			chooseDate(e) {
				// console.log(e.target.value);
				this.potentialPlanCreateDto.expectOn = e.target.value;
			},
			async save() {
				var self = this;
				var data = self.potentialPlanCreateDto;
				data.marketerId = self.customData.customerMarketerID
				data.customerID = self.customerId;
				data.customerName = self.customData.customerName;
				data.phone = self.customData.phone;
				data.company = self.customData.company;
				data.createOn = self.$moment().format("YYYY-MM-DD HH:mm:ss");
				data.cwCompanyID = self.$storage.getAppUserInfo().cwCompanyID;
				data.remark = data.remark;
				data.storeID = self.$storage.getAppUserInfo().currentStoreId;
				data.expectOn = data.expectOn + " 00:00:00";

				let res=await CY27.CreateByDto(data);
					// console.log({result});
					if (getCurrentPages().length === 1) {
						// var herf = "/Phone";
						// window.location.href = herf;
						this.$cw.backToHome(1);
					} else {
						// window.history.back(-1);
						uni.navigateBack({
							delta: 1
						})
					}
				
			},
			// 更换销售经理
			chooseSales(e) {
				const self = this;
				// console.log(this.salesAuthority);
				if (!this.salesAuthority.isAdjustMarket) {
					uni.showToast({
						title: '您没有权限执行此操作',
						icon: 'none'
					})
					return;
				};
				
				uni.showModal({
				    title: '提示',
				    content: '确定更改客户经理？',
				    success: function (res) {
				        if (res.confirm) {
				            self.index = e.target.value;
				            self.customData.customerMarketerID = self.sales[self.index].value;
							self.customData.marketerName = self.sales[self.index].text;
				        } else if (res.cancel) {
				        }
				    }
				});
			},
			// 获得等级图像
			getLeveImg (item) {
				if (item.customerLevelImgUrl) {
					return this.$cw.ImgServerUrl + item.customerLevelImgUrl;
				}
			},
			// 获得客户图像
			getCustomerImg (item) {
				if (item.headImg) {
					return item.headImg;
				} else {
					return "https://pic.cwyyt.cn/upload/yytApp/images/salesperson.png"
				}
			},
		},
		computed: {
			//fullName: {
			//    get: function () {
			//        return this.firstName + ' ' + this.lastName
			//    },
			//    set: function (newValue) {
			//        var names = newValue.split(' ')
			//        this.firstName = names[0]
			//        this.lastName = names[names.length - 1]
			//    }
			//}
			// vm.fullName = 'John Doe'
		},
		filters: {
			//parseScene: function (value) {
			//}
		},
		watch: {
			//"currentStore.storeId": {
			//    handler: function (val, oldval) {
			//        if (val) {
			//            vmDivItem1.$options.methods.getMonthSummaryData.bind(vmDivItem1)(1, val);
			//            vmDivItem3.$options.methods.getTodyBookData.bind(vmDivItem3)(1, val);
			//        }
			//    }
			//}
		}
	}
</script>

<style lang="less" scoped>
@import url('addSalesChanceInfo');
</style>
