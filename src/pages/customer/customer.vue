<template>
	<view class="customer-wrapper" @tap="hideMask">
		<z-nav-bar
			class="z-nav-bar"
			ref="zNavBar"
			:isactive="isactive"
			@onactive="onactive"
			:back="false"
			:titleswitch="true"
			bgColor="#0782ff"
			fontColor="#FFF"
			:titles="ttl"
		>
		<!-- 查看报表按钮 -->
		<navigator url="/pages/_common/statList/statList" hover-class="none" open-type="navigate" class="left-selector"
			slot="left">
		<text class="icon iconfont icon-tongji" style="font-size: 24rpx;"></text>
		</navigator>
			<sw-icon type="plusempty" color="#fff" size="60r" slot="right" @tap="showMore"></sw-icon>
		</z-nav-bar>
		
		<!-- 切换顶部展示不同组件 -->
		<view v-show="isactive == 0">
			<custom-list
				v-if="$storage.getSalesAuthority().isShowCstList"
				ref="customList"
				:payload="payload"
			
			></custom-list>
		</view>
		<view v-show="isactive == 1">
			<custom-follow
				v-if="$storage.getSalesAuthority().isCustomerTrack"
				ref="followList"
				:payload="payload"
			></custom-follow>
		</view>

		<!-- 右上角弹窗 -->
		<uni-popup
			bubble="right"
			class="nav-popup"
			ref="morePopup"
			type="position"
			posi="top: 50px; right: 0; display: flex; justify-content: flex-end;"
			:custom="true"
			:mask-click="true"
		>
			<view class="wrapper" style="margin-right: 20rpx;">
				<view class="item" @tap="addCustomer">
					<image class="img" :src="picDomain + '/upload/yytApp/customer/add-customer.png'"></image>
					<view class="title">新增客户</view>
				</view>
				<view class="item" @tap="sendMsgAll" v-if="$cw.groupSentMessage()">
					<image class="img" :src="picDomain + '/upload/yytApp/customer/send-all.png'"></image>
					<view class="title">群发消息</view>
				</view>
				<!-- <view class="item" @tap="setTraceList" v-if="salesAuthority.isShowCY57Track">
					<image class="img" :src="picDomain + '/upload/yytApp/customer/shezhigenzongqingdan.png'"></image>
					<view class="title">设置跟踪清单</view>
				</view> -->
				<view class="item" @tap="refreshTraceOpt" v-if="$cw.canRefreshTrackOpportunities()">
					<image class="img" :src="picDomain + '/upload/yytApp/customer/shuaxingenzongjihui.png'"></image>
					<view class="title">刷新跟踪机会</view>
				</view>
				<view class="item" @tap="labelManagement" v-if="$cw.canSeeLabelManagement()">
					<image class="img" :src="picDomain + '/upload/yyticons/1357135713_label-management.png'"></image>
					<view class="title">标签管理</view>
				</view>
			</view>
		</uni-popup>
		<!-- 【刷新跟踪机会】选择年月 -->
		<yyt-picker
			mode="yearMonth"
			:startYear="startYear"
			:endYear="endYear"
			:defaultVal="defaultYear"
			:current="true"
			@confirm="onConfirmYear"
			ref="yearMonth"
			themeColor="#007AFF"
			
		></yyt-picker>
	</view>
</template>

<script>
export { default } from './customer.js';
</script>

<style lang="less">
@import url('customer.less');
</style>
