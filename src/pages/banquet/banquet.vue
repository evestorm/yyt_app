<template>
	<div>
		<z-nav-bar
			class="z-nav-bar"
			ref="zNavBar"
			:isactive="selectIndex"
			@onactive="onactive"
			:back="false"
			:titleswitch="true"
			bgColor="#0782ff"
			fontColor="#FFF"
			:titles="tabAry"
		>
			<!-- 查看报表按钮 -->
			<navigator url="/pages/_common/statList/statList" hover-class="none" open-type="navigate" class="left-selector"
				slot="left">
			<text class="icon iconfont icon-tongji" style="font-size: 24rpx;"></text>
			</navigator>
			<sw-icon
				type="plusempty"
				v-if="$storage.getSalesAuthority().isShowYHBanquetOrder || $storage.getSalesAuthority().isShowYHClue"
				color="#fff"
				size="60r"
				slot="right"
				@tap="goAddBanquet()"
			></sw-icon>
		</z-nav-bar>
		<view v-show="selectIndex==0">
			<banquet-cue ref='banquetCue' :banquetReload="banquetReload" :storeId="storeId" :payload="payload"></banquet-cue>
		</view>
		<view v-show="selectIndex==1">
			<banquet-order ref='banquetOrder' :storeID="storeId" :payload="payload"></banquet-order>
		</view>
		<!-- 左上角报表弹窗 -->
		<!-- <uni-popup class="nav-popup" bubble='left' ref="reportPopup" type="position" posi="top: 50px; right: 0; display: flex; justify-content: flex-start;" :custom="true" :mask-click="true">
			<view class="wrapper" style="margin-left: 20rpx;">
				<navigator 
					v-for="(item,reportIndex) in leftReport" 
					hover-class="none"
					:url="item.url"
					class="item"
					:key="reportIndex"
					>
						<image class="img left" :src="item.icon"></image>
						<view class="title">{{item.text}}</view>
					</navigator>
			</view>
		</uni-popup> -->
		<!-- 右上角弹窗 -->
		<uni-popup
			class="more-popup"
			ref="morePopup"
			bubble="right"
			type="position"
			posi="top: 50px; right: 0; display: flex; justify-content: flex-end;"
			:custom="true"
			:mask-click="true"
		>
			<view class="wrapper" style="margin-right: 20rpx;">
				<view class="item" @tap="addBanquetCue" v-if="$storage.getSalesAuthority().isShowYHClue">
					<image class="img" :src="picDomain + '/upload/yytApp/banquet/add-fllow.png'"></image>
					<view class="title">新增宴会线索</view>
				</view>
				<view class="item" @tap="digBanquetClues" v-if="$cw.canSeeMiningYHClue()">
					<image class="img" :src="picDomain + '/upload/img/20200528/1027512751_dig-banquet-clues.png'"></image>
					<view class="title">挖掘宴会线索</view>
				</view>
				<view class="item" @tap="addBanquetOrder" v-if="$storage.getSalesAuthority().isShowYHBanquetOrder">
					<image class="img" :src="picDomain + '/upload/yytApp/banquet/add-order.png'"></image>
					<view class="title">新增宴会订单</view>
				</view>
			</view>
		</uni-popup>
	</div>
</template>

<script>
export { default } from './banquet.js';
</script>

<style lang="less" scoped>
@import url('banquet.less');
</style>
