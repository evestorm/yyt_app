<template>
	<view class="more-wrapper">
		<view class="bubble-list" v-show="isShowList">
			<view class="bubble-item text-blue" v-for="(item, index) in list" :key="index"
				@click.stop="selMenu($event, item)"
			>{{ item.label }}</view>
		</view>
		<uni-icons type="more-filled" size="40r" color="#9c9c9c" @click="triggleList()"></uni-icons>
	</view>
</template>

<script>
export default {
	name: 'yyt-bubble-menu',
	data() {
		return {
			isShowList: false,
		}
	},
	props: {
		// 气泡菜单列表
		list: {
			type: Array,
			default: () => []
		},
		// 额外数据
		extraData: {
			type: Object,
			default: () => {},
		},
		selectMenu: {
			type: Function,
		},
	},
	methods: {
		// 选中了某个菜单项
		selMenu(e, item) {
			this.$emit('selectMenu', item, this.extraData);
			this.triggleList();
		},
		// trigger菜单的显示与否
		triggleList() {
			this.isShowList = !this.isShowList;
		}
	}
};
</script>

<style lang="less" scoped>
/* 气泡 */
.more-wrapper {
	position: relative;
	z-index: 11;

	.bubble-list {
		min-width: 200rpx;
		position: absolute;
		right: 0;
		top: 80rpx;
		margin: 0 0 0 0;
		padding: 6rpx 0 6rpx 0;
		background: #fff;
		border-radius: 6rpx;
		box-shadow: 0px 0px 5px #e8e8e8;
		// &:after {
		// 	content: '';
		// 	position: absolute;
		// 	bottom: -14rpx;
		// 	left: 50%;
		// 	margin-left: -8rpx;
		// 	width: 0;
		// 	height: 0;
		// 	border-style: solid;
		// 	border-width: 0 12rpx 14rpx 12rpx;
		// 	border-color: transparent transparent #fff transparent;
		// }
		.bubble-item {
			font-size: 22rpx;
			font-weight: 400;
			margin: 0 20rpx;
			text-align: center;
			line-height: 2.4em;
			border-bottom: 1rpx solid rgba(241, 241, 241, 0.62);
			&:last-of-type {
				border-bottom: none;
			}
		}
	}
}
</style>
