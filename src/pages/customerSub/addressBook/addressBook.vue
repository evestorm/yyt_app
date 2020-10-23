<template>
	<view class="address-book">
		<!-- 正常页面 -->
		<view class="search">
			<view class="search-top" @tap="searchClick">
				<!-- <uni-icons type="search" size="35r" ></uni-icons> -->
				<image
					class="search-img"
					:src="picDomain + '/upload/yytApp/customer/search.png'"
					mode=""
				></image>
				<text>搜索</text>
				<!-- <input type="text" placeholder="搜索" /> -->
			</view>
		</view>
		<block v-if="bookList.length > 0">
				<virtual-list ref="virtualList" :listData="bookList" :estimatedItemSize="estimatedItemSize" v-slot="slotProps" :bufferScale="5">
					<address-book-item
						:item="slotProps.item"
						@addItemInfo="cachePosition"
						:id="slotProps.item.id"
						@onGoCustomerInfo="goCustomerInfo"
						@onGoMessage="goMessage"
						@onGoCall="goCall"
						@onGoAdd="goAdd"
					/>
				</virtual-list>
		</block>
		<view class="indexBar">
			<view
				class="indexBar-box"
				@touchstart.stop.prevent="tStart"
				@touchend.stop.prevent="tEnd"
				@touchmove.stop.prevent="tMove"
			>
				<view
					class="indexBar-item"
					v-for="(item, index) in list"
					:ref="item"
					:key="index"
					:id="index"
					:data-id="item"
					@touchstart="getCur"
					@touchend="setCur"
				>
					{{ item }}
				</view>
			</view>
		</view>
		<!--选择显示-->
		<view v-show="!hidden" class="indexToast" ref="indexToast">{{ listCur }}</view>
		<!-- 顶部搜索后显示 -->
		<view class="search-res book-list" v-show="isShow">
			<view class="search-flex">
				<view class="search-top">
					<uni-icons type="search" size="35r"></uni-icons>
					<input type="text" placeholder="请输入姓名、电话" v-model="searchStr" />
				</view>
				<view class="qx" @tap="cancel">取消</view>
			</view>
		
			<scroll-view scroll-y :style="[{ height: 'calc(100vh - 210rpx)' }]">
				<view class="book-item">
					<view
						class="customer-list"
						v-for="(m, indexs) in searchDataList"
						:key="indexs"
						@tap="goCustomerInfo(m.customerID)"
					>
						<image
							class="head-img"
							:src="m.headImg || 'https://pic.cwyyt.cn/upload/yytApp/images/salesperson.png'"
							mode=""
						></image>
						<view class="book-info">
							<view class="info-top">
								<view class="name">{{ m.customSaveName }}</view>
								<view class="leve-name" v-show="m.customerID">
									<image
										class="leve"
										:src="picDomain + '/upload/yytApp/customer/' + m.aiLevel + '.png'"
										mode=""
									></image>
									<!-- <image class="leve" :src="'https://pic.cwyyt.cn' + m.customerLevelImgUrl" mode=""></image> -->
									<text class="connect-name">姓名：{{ m.customerName }}</text>
								</view>
								<view class="manager" v-show="m.marketer">
									<!-- <image
										class="manager-img"
										:src="picDomain + '/upload/yytApp/banquet/kefujingli.png'"
										mode=""
									></image> -->
									<text class="icon iconfont lines-blue" :class="m.isLockMarket?'icon-suoding1':'icon-weisuoding'" style="font-size: 24rpx;"></text>
									<text class="manager-name">{{ m.marketer }}</text>
								</view>
							</view>
							<view class="info-bottom">
								<view class="connect-phone">{{ m.phone }}</view>
								<view class="icons">
									<image
										class="message"
										:src="picDomain + '/upload/yytApp/common/duanxin.png'"
										mode=""
										@tap.stop="goMessage(m)"
									></image>
									<image
										class="phone"
										:src="picDomain + '/upload/yytApp/common/phone.png'"
										mode=""
										@tap.stop="goCall(m)"
									></image>
									<image
										class="add"
										:src="picDomain + '/upload/yytApp/common/addcustomer.png'"
										mode=""
										@tap.stop="goAdd(m)"
										v-show="m.customerID == ''"
									></image>
								</view>
							</view>
						</view>
					</view>
					<view class="no-search-data" v-show="isNoSearch">无搜索结果</view>
				</view>
			</scroll-view>
		</view>
	</view>
</template>

<script>
export { default } from './addressBook.js';
</script>

<style lang="less" scoped>
@import url('addressBook.less');
</style>
