<template>
	<!-- 该页面跳转来源为【客户详情页面点击《客户标签》】 -->
	<!-- 该页面顶部为【客户 link 经理】 -->
	<view class="edit-customer-label">
		<view class="content">
			<!-- 关联区域 -->
			<view class="customer-info-top" v-if="fromCustomDetail">
				<!-- 左边客户 -->
				<view class="customer-info-top-l">
					<view class="customer-info-top-l-pic-area" v-if="CustomDetailOutData.customerPoolMarketName">
						<image class="customer-pic" v-if="CustomDetailOutData.headImg" :src="getCustomerImg(CustomDetailOutData)"></image>
						<image class="customer-pic" :src="picDomain + '/upload/yytApp/images/salesperson.png'" v-else></image>
						<view class="sales-person-name-pic">
							<span>{{ CustomDetailOutData.customerPoolMarketName }}</span>
						</view>
					</view>
					<view class="customer-info-top-l-area" v-else>
						<image class="customer-pic" v-if="CustomDetailOutData.headImg" :src="getCustomerImg(CustomDetailOutData)"></image>
						<image class="customer-pic" :src="picDomain + '/upload/yytApp/images/salesperson.png'" v-else></image>
					</view>
					<view class="customer-name">
						<span>{{ CustomDetailOutData.customerName }}</span>
						<span>客户</span>
					</view>
				</view>
				<!-- 关联图片 -->
				<view class="contact-area"><image :src="picDomain + '/upload/yytApp/images/contact.png'" alt="" class="contact-pic"></image></view>
				<!-- 右边客户经理 -->
				<view class="customer-info-top-r">
					<view class="sales-person-name">
						<span>{{ CustomDetailOutData.marketerName }}</span>
						<span>客户经理</span>
					</view>
					<!-- <image class="img sales-person-pic" :src="getSalesImg(CustomDetailOutData)" /> -->
				</view>
			</view>

			<!-- 标签区域 -->
			<view class="customer-info-main">
				<!-- 已有标签 -->
				<view class="tag-list">
					<view class="tag-list-top">
						<view class="tag-list-top-l"><span class="title">已有标签</span></view>
						<view class="tag-list-top-r" @tap="clearTag">
							<image class="img" src="https://pic.cwyyt.cn/upload/yyticons/142403243_label-del.png" />
							<span>清空</span>
						</view>
					</view>
					<view class="tag-list-info  ">
						<span v-for="(item, index) in existTag" :key="item.label + index" class="tag-list-item tab-item-active">
							{{ item.label }}
							<image class="img del-pic" :src="picDomain + '/upload/yytApp/images/deletePic.png'" @tap="delSelectTag(item, index, allTag)" />
						</span>
					</view>
				</view>
				<!-- 动态标签 -->
				<view class="tag-list" v-for="(item, index) in allTag" :key="index">
					<view class="tag-list-top">
						<view class="tag-list-top-l">
							<span class="title">{{ item.tagTypeName }}</span>
							<image class="add-img" src="https://pic.cwyyt.cn/upload/yyticons/1416261626_label-add.png" mode="" @tap="addTag(item)"></image>
							<!-- <span v-if="isEdit" class="iconfont icon-jiahao add-tag-icon" @tap="addTag(item)"></span> -->
						</view>
					</view>
					<view class="tag-list-info">
						<span
							@tap="selectTag(innerItem, existTag)"
							class="tag-list-item"
							:class="innerItem.selected ? 'tab-item-active' : ''"
							v-for="(innerItem, index) in item.data"
							:key="index"
						>
							{{ innerItem.label }}
						</span>
					</view>
				</view>
			</view>
		</view>
		<!-- 底部logo -->
		<view class="logoPic"><image src="https://pic.cwyyt.cn/upload/yyticons/0952195219_logo.png" class="bot-logo"></image></view>
		<!-- 底部按钮 -->
		<!-- <div class="customer-info-footer"> -->
		<!-- <button type="button" class="btn label-cancel" @tap="cancelTag">取消</button> -->
		<!-- <button type="button" class="btn label-save" @tap="saveTag">保存</button> -->
		<!-- </div> -->

		<!-- 添加标签的弹窗modal -->
		<!-- <yyt-neil-modal
			:show="lableModal"
			@cancel="cancelLabel"
			@confirm="saveLabel"
			:auto-close="false"
			title="添加常用标签" confirm-text="确定" cancel-text="取消">
			<view class="cu-form-group">
				<view class="title">标签描述</view>
				<input placeholder="请输入标签信息" name="input" v-model="lableTitle"></input>
		    </view>
		</yyt-neil-modal> -->
		<uni-popup ref="cancelPopup" type="bottom" class="cancel-popup">
			<view class="cancel-popup-title">添加常用标签</view>
			<view class="cancel-popup-mid">
				<text class="mid-text">标签描述</text>
				<input placeholder-style="fontSize:22rpx" class="mid-input" type="text" v-model="lableTitle" placeholder="请输入标签信息" />
			</view>
			<view class="bot">
				<view class="btn qx" @tap="cancelLabel()">取消</view>
				<view class="btn qd" @tap="saveLabel()">确定</view>
			</view>
		</uni-popup>
	</view>
</template>

<script>
export { default } from './editCustomerLabel.js';
</script>

<style lang="less" scoped>
@import url('./editCustomerLabel.less');
</style>
