<!--作者:杨亮-->
<template>
    <view class="join-detail" ref="joinDetail">
		<view class="main-wrapper">
			<scroll-view :scroll-top="scrollTop" scroll-y="true" class="scroll-view-wrapper" @scroll="scroll" :scroll-with-animation="true">
				<!--任务详情卡片-->
				 <taskCard :taskDetail="taskDetail" @onConfirm="onConfirm" @gotoReport="gotoReport" @report="report"></taskCard>
				<!--气泡聊天item--> 
				 <chatBubbles :chatList="taskDetail.xtTaskReplyDetails"></chatBubbles>
			</scroll-view>
			<!-- 回到顶部 -->
			<view class="go-top d-flex justify-center align-center" v-show="old.scrollTop > 200" @tap="goTop">↑</view>
		</view>		<view class="bottom-wrapper" ref="bottomWrapper">
			<!--消息提交-->
			 <submitMsg ref="submitMsg" @onSendAMsg="onSendAMsg" @onInput="onInput"></submitMsg>
		</view>
    </view>
</template>

<script src="./joinDetail.js"></script>

<style lang="less" scoped>
    @import url('joinDetail.less');
</style>
