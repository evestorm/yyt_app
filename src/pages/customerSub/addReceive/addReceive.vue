<template>
	<view class="add-task">
		<view class="add-task-top">
			<view class="order-input">
				<uni-icons type="search" size="35r"></uni-icons>
				<input type="text" placeholder="请输入客户姓名、电话、查询码" v-model="pageData.nameOrPhone" @input="updateSearchkeyword" />
			</view>
			<view class="all-check">
				<label class="label" @tap="allCheck">
					<checkbox :checked="isAllCheck" style="transform:scale(0.7)" />
					<text class="all-text">全选</text>
					<text>已选：{{ customers.length || 0 }}条, 共 {{ rowCount }}条</text>
				</label>
				<image :src="picDomain + '/upload/yytApp/banquet/shaixuan.png'" class="saixuan-img" @tap="showDrawer"></image>
			</view>
		</view>
		<!-- 收件人列表 -->
		<mescroll-uni :down="downOption" @down="downCallback" :up="upOption" @up="upCallback" :top="200" class="receive-list">
			<view class="receive-list">
				<checkbox-group class="">
					<label class="receive-list-item" v-for="item in receiveList" :key="item.customerID" @tap="changeCheckbox(item)">
						<view class="list-top">
							<view class="top-left">
								<checkbox :value="item.customerID" :checked="item.checked" style="transform:scale(0.6)" />
								<text class="item-name">{{ item.customerName }}</text>
								<text class="item-vip-name" v-if="item.msgName">(尊称：{{ item.msgName }})</text>
							</view>
							<view class="item-name top-right">{{ item.phone }}</view>
						</view>
						<view class="checkbox-label" v-if="item.remark">{{ item.remark }}</view>
					</label>
				</checkbox-group>
			</view>
		</mescroll-uni>

		<!-- 右侧筛选弹窗 -->
		<uni-drawer :visible="isShowSidebar" @close="closeDrawer" mode="right" class="position-relative">
			<scroll-view scroll-y="true" class="right-popup">
				<view class="popup-title">客户分类</view>
				<view class="popup-list">
					<view class="popup-list-item popup-list-unsel " :class="{ popupListSel: isCheckAllCustomer == 0 }" @tap="checkAllCustomer(0)">待跟踪客户</view>
					<view class="popup-list-item popup-list-unsel " :class="{ popupListSel: isCheckAllCustomer == 1 }" @tap="checkAllCustomer(1)">所有客户</view>
				</view>
				<!-- <view class="" v-if="isCheckAllCustomer == 0">
					<view class="popup-title">跟踪分类</view>
					<view class="popup-list">
						<view class="" v-for="(item, tagIndex) in tagDetails" :key="tagIndex">
							<view class="popup-list-item popup-list-unsel" :class="{ popupListSel: isTags == item.code }" @tap="checkTags(item.code)">{{ item.name }}</view>
						</view>
					</view>
				</view> -->
				<view class="" v-if="$cw.canSeeAllCustomer()">
					<view class="popup-title">客户经理</view>
					<view class="popup-list">
						<view class="" v-for="(item, marIndex) in marketerList" :key="marIndex">
							<view
								class="popup-list-item popup-list-unsel"
								:class="{ popupListSel: pageData.marketerID == item.marketerID }"
								@tap="pageData.marketerID = item.marketerID"
							>
								{{ isCheckAllCustomer == 1 ? item.marketerName : item.name }}
							</view>
						</view>
					</view>
				</view>
				
				<view class="not-show-five-day">
					<label @tap="selFiveDay">
						<checkbox color="#FFCC33" value="" :checked="isNotShowFiveDay" style="transform:scale(0.7)" />
						去除
						<text class="radius-20 text-white bg-primary" style="padding:8rpx 20rpx"  @tap.stop="pageData.days>1&&pageData.days--">-</text>
						<text class="mx-1">{{pageData.days}}</text>
						<text class="radius-20 text-white bg-primary" style="padding:8rpx 20rpx"  @tap.stop="pageData.days++">+</text>
						天内联系过的
					</label>
				</view>
				<view style="width: 100%;height: 20rpx;"></view>
				
				<view class="">
					<view class="popup-tags" @tap="goCustomerLabel">
						<view class="popup-title">标签</view>
						<image class="arrowRight" :src="picDomain + '/upload/yytApp/images/arrowRight.png'"></image>
					</view>
					<view class="tag-detail">
						<view class="tag-detail-title">已选：</view>
						<view class="tag-detail-tags">
							<!-- <text v-for="(item, labelIndex) in labelList" :key="labelIndex">{{ item || '' }}</text> -->
							<text>{{ currentAddReceiveTagsObj.content }}</text>
						</view>
					</view>
				</view>
				
				<view style="width: 100%;height: 140rpx;"></view>
			
			</scroll-view>
			<view class="popup-foot">
				<button type="primary" class="foot-btn w-bg" @tap="reSet()">重置</button>
				<button type="primary" class="foot-btn b-bg" @tap="getPagedList()">完成</button>
			</view>
		</uni-drawer>
	</view>
</template>

<script>
export { default } from './addReceive.js';
</script>

<style lang="less" scoped>
@import url('addReceive.less');
</style>
