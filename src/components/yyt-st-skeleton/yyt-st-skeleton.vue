<!-- 预订selectTable的骨架屏 -->
<template>
	<view>
		<view class="yyt-st-skeleton" :style="{ top: top + 'rpx' }" v-if="show">
			<!-- 区域名称 -->
			<view class="yyt-st-area-name"></view>
			<!-- 桌台列表 -->
			<view class="yyt-st-table-list-wrapper">
				<div></div>
				<div></div>
				<div></div>
				<div></div>
				<div></div>
				<div></div>
				<div></div>
				<div></div>
				<div></div>
				<div></div>
				<div></div>
				<div></div>
			</view>
		</view>
		<view v-else><slot></slot></view>
	</view>
</template>

<script>
import uniTag from '@/components/yyt-st-skeleton/yyt-st-skeleton.vue';
export default {
	name: 'yyt-st-skeleton',
	props: {
		top: {
			type: Number,
			default: 100,
			require: false
		},
		show: {
			type: Boolean,
			default: true,
			require: true
		}
	},
	components: {},
	data() {
		return {};
	},
	methods: {}
};
</script>

<style lang="less" scoped>
@import url('yyt-st-skeleton.less');
</style>
