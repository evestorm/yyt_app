<!--作者:杨亮-->
<template>
	<view class="edit-label">
		<uni-nav-bar
			left-icon="back"
			@clickLeft="tapLeftFromNav"
			:title="urlOption.id ? '编辑标签' : '新增标签'"
			@clickRight="tapRightFromNav"
			color="#ffffff"
			background-color="#0782ff"
			:fixed="true"
			ref="navbarRef"
		>
			<view slot="right">保存</view>
		</uni-nav-bar>
		<!-- 标签名称 -->
		<view class="header mt-2 bg-white d-flex j-sb a-center px-3 py-2">
			<text class="label-name font-weight font-32">标签名称</text>
			<input class="flex-1 pr-3" style="text-align: right;" type="text" placeholder="请输入标签名称" placeholder-class="place-style" v-model="labelAttr.label" />
		</view>
		<!-- 标签条件设置 -->
		<view class="conditions">
			<view class="title mt-2 px-3 pb-1 font-weight font-32">条件设置</view>
			<view class="panel bg-white d-flex flex-column">
				<view class="d-flex j-sb a-center py-2 pl-4 pr-2">
					<text>{{ urlOption.id && conditionsArr.length ? '满足以下条件：' : '添加条件：'}}</text>
					<image @tap="toEditConditions" class="mx-2" style="width: 36rpx; height: 32rpx;" :src="picDomain + '/upload/yyticons/1423542354_label-edit.png'"></image>
				</view>
				<view class="condition-list d-flex flex-column pl-6 pr-3">
					<text
						v-for="item in conditionsArr" :key="item.id"
						class="py-2 border-top">{{ item.selfConditionName }}</text>
				</view>
			</view>
		</view>
		<!-- 自动刷新 -->
		<view class="refresh bg-white mt-2 py-2 px-4 d-flex j-sb a-center">
			<text>自动刷新标签用户</text>
			<switch :checked="!!labelAttr.isAutoRefresh" @change="toggleRefresh" />
		</view>
		<!-- 提示语 -->
		<view class="tips-wrapper">
			说明：开启自动刷新后，每月会自动为满足条件的用户打上该标签，
			不满足该条件的用户若有此标签，则此标签会消失。
		</view>
	</view>
</template>

<script src="./editLabel.js"></script>

<style lang="less" scoped>
@import url('editLabel.less');
</style>
