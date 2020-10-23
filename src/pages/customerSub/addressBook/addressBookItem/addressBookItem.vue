<template>
	<view class="address-book-item"
		>
		<view v-if="item.groupName" class="upper-case">{{ item.groupName }}</view>
		<view v-else class="book-item" @tap="_onGoCustomerInfo(item.customerID)">
			<view class="customer-list">
				<image class="head-img" :src="item.headImg || '/static/common/salesperson.png'" mode=""></image>
				<view class="book-info">
					<view class="info-top">
						<view class="name">{{ item.customSaveName }}</view>
						<view class="leve-name" v-show="item.customerID">
							<image class="leve" :src="picDomain + '/upload/yytApp/customer/' + item.aiLevel + '.png'" mode=""></image>
							<text class="connect-name">姓名：{{ item.customerName }}</text>
						</view>
						<view class="manager" v-show="item.marketer">
							<text class="icon iconfont lines-blue" :class="item.isLockMarket?'icon-suoding1':'icon-weisuoding'" style="font-size: 24rpx;"></text>
							<!-- <image class="manager-img" src="/static/common/kefujingli.png" mode=""></image> -->
							<text class="manager-name">{{ item.marketer }}</text>
						</view>
					</view>
					<view class="info-bottom">
						<view class="connect-phone">{{ item.phone }}</view>
						<view class="icons">
							<image class="message" src="/static/common/duanxin.png" mode="" @tap.stop="_onGoMessage(item)"></image>
							<image class="phone" src="/static/common/phone.png" mode="" @tap.stop="_onGoCall(item)"></image>
							<image
								class="add"
								src="/static/common/add-customer.png"
								mode=""
								@tap.stop="_onGoAdd(item)"
								v-show="item.customerID == '' || item.customerID == null"
							></image>
						</view>
					</view>
					<yyt-allfree :summaryStat='item.summaryStat' v-if='item.customerID'></yyt-allfree>
				</view>
			</view>
		</view>
	</view>
</template>

<script>
export { default } from './addressBookItem.js';
</script>

<style lang="less" scoped>
@import url('addressBookItem.less');
</style>
