<!--作者:杨亮-->
<template>
    <view class="chat-bubbles">
		<!-- 记录 -->
		<view class="chat-wrapper"
			v-for="(v, idx) in chatList" :key="idx"
		>
			<block v-if="!!!v.isReplyMessage">
				<view class="record d-flex justify-start align-start py-2">
					<view class="cu-avatar sm round yyt-margin-right-bg" :style="{ backgroundImage: getImgUrl(v.imgUrl) }"></view>
					<view class="right-wrapper d-flex justify-start align-center flex-wrap">
						<view class="desc">{{ v.taskReplyName }}</view>
						<view class="date yyt-margin-left-bg">{{ v.createTime }}</view>
					</view>
				</view>
			</block>
			<block v-if="!!v.isReplyMessage">
				<view class="chat py-2 d-flex">
					<view class="cu-avatar sm round yyt-margin-right-bg" :style="{ backgroundImage: getImgUrl(v.imgUrl) }"></view>
					<view class="bubble d-flex flex-column">
						<view class="basic d-flex justify-start align-center flex-wrap">
							<view class="name">{{ v.taskReplyName }}</view>
							<view class="date yyt-margin-left-bg">{{ v.createTime }}</view>
						</view>
						<view class="msg yyt-margin-top-small"><pre>{{ v.replyContent }}</pre></view>
					</view>
				</view>
			</block>
		</view>
	</view>
</template>

<script>
    export { default } from './chatBubbles.js';
</script>

<style lang="less" scoped>
    @import url('chatBubbles.less');
</style>
