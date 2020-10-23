<template>
	<view id="today-chance">
		<!-- 客户来源 -->
		<view class="cu-bar bg-white margin-top customer-source"
			 @tap="gotoCustomerSource">
			<view class="action">
				<text class="cuIcon-friend text-blue"></text> 客户来源
			</view>
			<view class="action" style="max-width: 60%;">
				<text class="text-cut" style="width: 100%;">{{ customerSource || '请输入客户来源' }}</text>
			</view>
		</view>
		<!-- 机会日期 -->
		<view class="cu-bar bg-white margin-top chance-date">
			<view class="action">
				<text class="cuIcon-time text-blue"></text> 机会日期
			</view>
			<view class="action text-right picker-wrapper">
				<picker class="picker" mode="date" :value="date" @change="chooseDate($event)">
					<view class="picker">
						{{date}}
					</view>
				</picker>
			</view>
		</view>
		<!-- 机会备注 -->
		<view class="cu-bar bg-white margin-top chance-note"
			 @tap="gotoChanceNote">
			<view class="action">
				<text class="cuIcon-edit text-blue"></text> 机会备注
			</view>
			<view class="action" style="max-width: 60%;">
				<text class="text-cut" style="width: 100%;">{{ chanceNote || '请输入机会备注' }}</text>
			</view>
		</view>
		<!-- 确认按钮 -->
		<view class="padding flex flex-direction">
			<button @tap="tapAddChanceBtn" class="cu-btn block bg-blue margin-tb-sm lg" type="" :disabled="customerSource.length === 0 && chanceNote.length === 0">确定</button>
		</view>
	</view>
</template>

<script>
	import cw from '@/common/ceiwei/common.js';
	import { mapState, mapMutations } from 'vuex';
	import CY27 from '@/service/CY/CY27AppService.js';
	export default {
		data() {
			return {
				customerSource: '', // 客户来源
				date: cw.pikerGetDate(), // 机会日期
				chanceNote: '', // 机会备注
				bookID: '', // 订单id
				bookObj: {}, // 订单详情
			};
		},
		computed: {
			...mapState(['todayChance', 'area']),
		},
		onLoad(payload) {
			const self = this;
			// console.log(payload.bookID);
			
			self.bookID = payload.bookID;
			// console.log(this.area);
			this.area.map(item => {
				item.tableList.map(table => {
					table.orderList.map(order => {
						if (order.bookID === self.bookID) {
							self.bookObj = order;
							// console.log(self.bookObj);
							return;
						}
					})
				})
			})
		},
		onShow() {
			console.log('todayChance', this.todayChance);
			this.customerSource = this.todayChance.customerSource;
			this.chanceNote = this.todayChance.chanceNote;
		},
		methods: {
			...mapMutations(['setTodayChance']),
			// 跳转到客户来源编辑页
			gotoCustomerSource() {
				uni.navigateTo({
					// url: '/pages/myapp/customerSource/customerSource?note=' + this.customerSource,
					url: '/pages/homePageSub/customerSource/customerSource?note=' + this.customerSource,
				});
			},
			// 更改机会日期
			chooseDate(e) {
				this.date = e.target.value;
			},
			// 跳转到机会备注编辑页
			gotoChanceNote() {
				uni.navigateTo({
					url: '/pages/_common/chanceNote/chanceNote?note=' + this.chanceNote,
				});
			},
			// 点击了添加机会按钮
			async tapAddChanceBtn() {
				// console.log('确认添加机会');
				// console.log(this.todayChance);
				
				const { bookID, bookOrderTypeID, customerID, customerName, company, phone, cwCompanyID } = this.bookObj;
				// 获取门店storeID
				const storeID = this.$storage.getAppUserInfo().currentStoreId;
				const data = {
					bookOrderID: bookID,
					bookOrderTypeID: bookOrderTypeID,
					customerID: customerID,
					customerName: customerName,
					company: company,
					phone: phone,
					expectOn: this.date + " 00:00:00", // 目标日期
					cWCompanyID: cwCompanyID,
					storeID: storeID,
					remark: this.todayChance.chanceNote, // 机会备注
					cstFromRemark: this.todayChance.customerSource // 客户来源备注
				}
				let res=await CY27.CreateByDto(data);
				if(!res)
				{
					uni.showToast({
						title: '添加失败，请稍后重试',
						duration: 1000
					});
				}
				else
				{
					// console.log(result);
					uni.showToast({
						title: '添加成功！',
						duration: 1000
					});
					this.customerSource = '';
					this.chanceNote = '';
					this.setTodayChance({
						customerSource: '',
						chanceNote: '',
					});
					setTimeout(() => {
						uni.navigateBack({
							delta: 1
						});
					}, 1000);
				}
					
				
			}
		}
	}
</script>

<style lang="less" scoped>
@import url('todayChance.less');
</style>
