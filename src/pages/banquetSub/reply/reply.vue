<template>
    <view>
        <!--头部-->
        <view id="PageHeader">
			<view class="top-left">{{projectTitle}}</view>
			<view class="top-right">{{orderTitle}}&nbsp;&nbsp;&nbsp;{{orderTime}}</view>
		</view>

        <!--内容-->
        <view id="PageContent">
			<view class="customer-rate">
				<view class="title">客户</view>
				<view class="rate">
					<text class="title-left">评分：</text>
					<sx-rate :value='getData.cstScore' :default-color="'#FC4732'" :active-color="'#FC4732'"></sx-rate>
				</view>	
				<view class="title-left-text">评价：</view>
				<view class="rate-text">
					{{getData.cstComment}}
				</view>
			</view>
			<view class="my-reply">
				<view class="title">我的回复</view>
				<textarea v-model='getData.commentReplyContent' class="textarea-text" maxlength='300' placeholder-style="font-size:22rpx" placeholder="客户已评价,正在等待您的回复!" />
				<text class="textarea-length">{{getData.commentReplyContent.length}}/300</text>
			</view>
		</view>


        <!--底部-->
        <view id="PageBottom"></view>
    </view>
</template>

<script>
    export { default } from './reply.js';
</script>

<style lang="less" scoped>
    @import url('reply.less');
</style>
