<!--作者:杨亮-->
<template>
    <view class="label-management">
		<!-- 标签组 -->
        <view class="label-group"
			v-for="item in labelGroups" :key="item.tagTypesID"
			>
        	<view class="header d-flex j-sb a-center py-2 px-3">
        		<text class="title font-weight font-32">{{ item.tagTypeName }}</text>
				<navigator v-if="$cw.canEditLabelManagement()" class="d-flex a-center" :url="`/pages/customerSub/editLabel/editLabel?tagTypesID=${item.tagTypesID}`">
					<image style="width: 36rpx; height: 36rpx;" :src="picDomain + '/upload/yyticons/1416261626_label-add.png'"></image>
				</navigator>
        	</view>
			<!-- 该组下标签列表 -->
			<view class="label-list bg-white">
				<view class="label-list-item d-flex j-sb a-center py-2 px-3"
					v-for="v in item.data" :key="v.companyCustomerLabelID"
					>
					<view class="label-left">
						<text class="label-name font-28" @tap="gotoCustomerList(v)">{{ v.label }}（{{ v.userCount }}人）</text>
					</view>
					<view class="label-right d-flex a-center">
						<image v-if="v.isShowRefresh" @tap="showRefreshWindow(v)" class="mx-2" style="width: 36rpx; height: 36rpx;" :src="picDomain + '/upload/yyticons/1422542254_label-refresh.png'"></image>
						<navigator v-if="$cw.canEditLabelManagement()" class="d-flex a-center" :url="`/pages/customerSub/editLabel/editLabel?id=${v.companyCustomerLabelID}`">
							<image class="mx-2" style="width: 36rpx; height: 36rpx;" :src="picDomain + '/upload/yyticons/1423542354_label-edit.png'"></image>
						</navigator>
						<image v-if="$cw.canEditLabelManagement()" @tap="showDelWindow(v)" class="ml-2" style="width: 36rpx; height: 36rpx;" :src="picDomain + '/upload/yyticons/142403243_label-del.png'"></image>
					</view>
				</view>
			</view>
        </view>
		<!-- 刷新提示框 -->
		<uni-popup ref="refreshPopup" type="center" class="tip-popup" :custom="true">
			<view class="wrapper">
				<view class="popup-top">
					<text>刷新提示</text>
					<!-- <image class="popup-top-img" :src="picDomain + '/upload/yytApp/banquet/quxiao.png'" mode="" @tap="cancelOrder()"></image> -->
				</view>
				<!-- popup中部 -->
				<view class="popup-mid">
					<image class="popup-mid-img" src="https://pic.cwyyt.cn/upload/yyticons/1553265326_info.png" mode=""></image>
					<text>点击刷新会自动清除原标签用户，给满足的条件的用户打上此标签！</text>
				</view>
				<view class="popup-bot">
					<view class="cancel" @tap="cancelRefreshPopupWindow()">取消</view>
					<view class="confirm" @tap="confirmRefreshLabel()">确定</view>
				</view>
			</view>
		</uni-popup>
		<!-- 删除提示框 -->
		<uni-popup ref="delPopup" type="center" class="tip-popup" :custom="true">
			<view class="wrapper">
				<view class="popup-top">
					<text>删除提示</text>
					<!-- <image class="popup-top-img" :src="picDomain + '/upload/yytApp/banquet/quxiao.png'" mode="" @tap="cancelOrder()"></image> -->
				</view>
				<!-- popup中部 -->
				<view class="popup-mid">
					<image class="popup-mid-img" :src="picDomain + '/upload/yytApp//banquet/error.png'" mode=""></image>
					<text>您确定要删除此标签？</text>
				</view>
				<view class="popup-bot">
					<view class="cancel" @tap="cancelDelPopupWindow()">取消</view>
					<view class="confirm" @tap="confirmDelLabel()">确定</view>
				</view>
			</view>
		</uni-popup>
    </view>
</template>

<script src="./labelManagement.js"></script>

<style lang="less" scoped>
    @import url('labelManagement.less');
</style>
