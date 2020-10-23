<template>
	<view class="container">
		<!-- 顶部导航 -->
		<z-nav-bar class="z-nav-bar" :title="'设置跟踪清单'" :back="true" bgColor="#0782ff" fontColor="#FFF">
			<sw-icon type="back" size="27" slot="left" @tap="onBack" color="#FFF"></sw-icon>
		</z-nav-bar>
		<!-- 主体内容 -->
		<view class="main yyt-margin-top-bg">
			<!-- 指定跟踪条件 -->
			<div class="follow-condition">
				<div class="title">指定跟踪条件</div>
				<div class="condition-list">
					<div class="condition-item"
						v-for="(item,index) in assignFollowInfo"
						:key="index">
						<!-- <text class="tag1" :class="{active:num==index}"
						@tap="selectedAssign(item,index)">{{item.name}}</text>
						<text class="num" v-if="assignFollowNum&&num==index">{{assignFollowNum}}人</text> -->
						<view class='cu-tag round'
							:class="[ num==index ? 'bg-blue' : 'line-blue' ]"
							@tap="selectedAssign(item,index)">{{item.name}}</view>
						<view class="num" v-if="assignFollowNum!=null&&num==index">{{assignFollowNum}}人</view>
					</div>
				</div>
			</div>
			<!-- 权重 -->
			<view class="weight yyt-margin-bottom-bg">
				<div class="title">权重</div>
				<!-- <div class="number-box">
					<uni-number-box :min="0" :max="100" :value="0" @change="changeWeight" />
				</div> -->
				<yyt-number-box :value="1" :min="0" :max="100" :disabled="false" :step="1" @change="changeWeight"></yyt-number-box>
			</view>
			<!-- 描述 -->
			<div class="desc">
				<div class="title">描述：</div>
				<div class="desc-box">
					<textarea placeholder-style="fontSize:22rpx" class="desc-textarea" maxlength="-1" v-model="followListForm.remark" placeholder="请输入描述"></textarea>
				</div>
			</div>
		</view>
		<!-- 提交 -->
		<div class="btn-wrapper">
			<!-- <button type="primary" class="sw-btn" @tap="createFollowList">创建任务跟踪清单</button> -->
			<button class="sw-btn cu-btn round lg bg-blue" @tap="createFollowList">创建任务跟踪清单</button> <!-- bg-blue实心按钮 line-blue 镂空按钮 -->
		</div>
		<view class="logo-bottom">
			<view style="width: 80rpx; height: 2rpx; margin-right: 10rpx; background: rgba(191,191,191,1);"></view>
			<image :src="picDomain + '/upload/yytApp/images/logo-bottom.png'" style="width: 80rpx; height: 40rpx;"></image>
			<view style="width: 80rpx; height: 2rpx; margin-left: 10rpx; background: rgba(191,191,191,1);"></view>
		</view>
	</view>
</template>

<script>
	export { default } from './setFollowList.js';
</script>

<style lang="less" scoped>
@import url('setFollowList.less');
</style>
