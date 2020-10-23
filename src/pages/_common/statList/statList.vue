<!--作者:杨亮-->
<template>
    <view class="statList">
		<scroll-view :scroll-y="true" class="scroll-view-wrapper">
			<view class="group"
				v-for="(group, idx) in calcGroupList" :key="idx">
				<view class="group-header d-flex justify-start align-center" v-if="group.name">
					{{ group.name }}
				</view>
				<view class="group-item d-flex justify-between align-center"
					v-for="(item, index) in group.group"
					:key="index"
					@tap="itemNavigateTo(item)"
				>
					<view class="title">{{ item.value }}</view>
					<view class="arrow">
						<text class="icon iconfont icon-jiantou02" style="font-size: 24rpx;"></text>
					</view>
				</view>
			</view>
		</scroll-view>
    </view>
</template>

<script src="./statList.js"></script>

<style lang="less" scoped>
    @import url('statList.less');
</style>
