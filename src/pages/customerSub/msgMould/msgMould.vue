<template>
	<view class="">
		<view class="tabs">
			<text @tap="onClickItem(0)" class="tab" :class="{ tabSel: current === 0 }" v-show="isClue==3">预订通知</text>
			<text @tap="onClickItem(1)" class="tab" :class="{ tabSel: current === 1 }">跟踪短信</text>
		</view>
		<!-- 选项卡内容 -->
		<view class="content">
			<view v-show="current === 0 && isClue==3">
				<view class="content-list" v-for="(item, reserveIndex) in reserveList" :key="reserveIndex">
					<view class="content-title">{{ item.messageTemplateTitle }}</view>
					<view class="content-info" @tap="checkMsg(item)">
							<rich-text   :nodes="item.messageContent"></rich-text>
					</view>

				<!-- 	<view class="content-info" @tap="checkMsg(item)">{{ item.messageTemplateContent }}</view> -->
				</view>
				<!-- 底部logo -->
				<!-- <view class="logoPic"><image :src="picDomain + '/upload/yytApp/banquet/logo.png'" class="bot-logo"></image></view> -->
			</view>
			<view v-show="current === 1">
				<view class="content-list" v-for="(item, followIndex) in followList" :key="followIndex">
					<view class="content-title">{{ item.messageTemplateTitle }}</view>
						<view class="content-info" @tap="checkMsg(item)" style="word-break: break-all;">
								<rich-text  :nodes="item.messageContent"></rich-text>
						</view>

					<!-- <view class="content-info" @tap="checkMsg(item)">{{ item.messageTemplateContent }}</view> -->
				</view>
				<!-- 底部logo -->
				<!-- <view class="logoPic"><image :src="picDomain + '/upload/yytApp/banquet/logo.png'" class="bot-logo"></image></view> -->
			</view>
		</view>
	</view>
</template>

<script>
export { default } from './msgMould.js';
</script>

<style lang="less" scoped>
@import url('msgMould.less');
</style>
