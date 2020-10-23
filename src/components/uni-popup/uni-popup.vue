<template>
	<view v-if="showPopup" class="uni-popup">
		<view :class="[ani, animation ? 'ani' : '', !custom ? 'uni-custom' : '']" class="uni-popup__mask" @click="close(true)" />
		<view :class="[type, ani, animation ? 'ani' : '', !custom ? 'uni-custom' : '']" class="uni-popup__wrapper" @click="close(true)">
			<view class="uni-popup__wrapper-box" :style="type == 'position' ? posi : ''" @tap.stop="clear">
				<view :class="bubble"></view>
				<slot />
			</view>
		</view>
	</view>
</template>

<script>
export default {
	name: 'UniPopup',
	props: {
		// 开启动画
		animation: {
			type: Boolean,
			default: true
		},
		// 弹出层类型，可选值，top: 顶部弹出层；bottom：底部弹出层；center：全屏弹出层;right:右边弹出层,position:具体位置
		type: {
			type: String,
			default: 'center'
		},
		//当type为position时的内容的具体位置
		posi: {
			type: String,
			default: 'right:0;top:0px;position:absolute'
		},
		// 是否开启自定义
		custom: {
			type: Boolean,
			default: false
		},
		// maskClick
		maskClick: {
			type: Boolean,
			default: true
		},
		show: {
			type: Boolean,
			default: true
		},
		bubble: {
			type: String,
			default: 'none'
		},
	},
	data() {
		return {
			ani: '',
			showPopup: false
		};
	},
	watch: {
		show(newValue) {
			if (newValue) {
				this.open();
			} else {
				this.close();
			}
		}
	},
	created() {},
	methods: {
		clear() {},
		open() {
			this.$emit('change', {
				show: true
			});
			this.showPopup = true;
			this.$nextTick(() => {
				setTimeout(() => {
					this.ani = 'uni-' + this.type;
				}, 30);
			});
		},
		close(type) {
			console.log('执行了close');
			if (!this.maskClick && type) return;
			this.$emit('change', {
				show: false
			});
			this.ani = '';
			this.$nextTick(() => {
				setTimeout(() => {
					this.showPopup = false;
				}, 300);
			});
		}
	}
};
</script>
<style>
@charset "UTF-8";

.uni-popup {
	position: fixed;
	top: 0;
	bottom: 0;
	left: 0;
	right: 0;
	z-index: 999;
	overflow: hidden;
}

.uni-popup__mask {
	position: absolute;
	top: 0;
	bottom: 0;
	left: 0;
	right: 0;
	z-index: 998;
	background: rgba(0, 0, 0, 0.4);
	opacity: 0;
}

.uni-popup__mask.ani {
	transition: all 0.3s;
}

.uni-popup__mask.uni-bottom,
.uni-popup__mask.uni-center,
.uni-popup__mask.uni-top,
.uni-popup__mask.uni-right,
.uni-popup__mask.uni-position {
	opacity: 1;
}

.uni-popup__wrapper {
	position: absolute;
	z-index: 999;
	box-sizing: border-box;
}

.uni-popup__wrapper.ani {
	transition: all 0.3s;
}
.uni-popup__wrapper.right {
	right: 0;
	height: 100%;
	transform: translateX(100%);
}
.uni-popup__wrapper.top {
	top: 0;
	left: 0;
	width: 100%;
	transform: translateY(-100%);
}

.uni-popup__wrapper.bottom {
	bottom: 0;
	left: 0;
	width: 100%;
	transform: translateY(100%);
}

.uni-popup__wrapper.center {
	width: 100%;
	height: 100%;
	display: flex;
	justify-content: center;
	align-items: center;
	transform: scale(1.2);
	opacity: 0;
}
.uni-popup__wrapper.position {
	width: 100%;
	height: 100%;
	transform: scale(1.2);
	opacity: 0;
}
.uni-popup__wrapper-box {
	position: relative;
	box-sizing: border-box;
	border-radius: 20upx;
}

.uni-popup__wrapper.uni-custom .uni-popup__wrapper-box {
	padding: 30upx;
	background: #fff;
}

.uni-popup__wrapper.uni-custom.center .uni-popup__wrapper-box {
	position: relative;
	max-width: 80%;
	max-height: 80%;
	overflow-y: scroll;
}

.uni-popup__wrapper.uni-custom.bottom .uni-popup__wrapper-box,
.uni-popup__wrapper.uni-custom.top .uni-popup__wrapper-box {
	width: 100%;
	max-height: 500px;
	overflow-y: scroll;
}
.uni-popup__wrapper.uni-custom.right .uni-popup__wrapper-box {
	height: 100%;
	max-width: 600rpx;
	overflow-x: scroll;
}
.uni-popup__wrapper.uni-custom.position .uni-popup__wrapper-box {
	max-width: 80%;
	max-height: 80%;
	overflow-y: scroll;
}
.uni-popup__wrapper.uni-bottom,
.uni-popup__wrapper.uni-top {
	transform: translateY(0);
}
.uni-popup__wrapper.uni-right {
	transform: translateX(0);
}
.uni-popup__wrapper.uni-position {
	transform: scale(1);
	opacity: 1;
}
.uni-popup__wrapper.uni-center {
	transform: scale(1);
	opacity: 1;
}
/* 气泡位置 */
.right {
	width: 20rpx;
	height: 20rpx;
	position: absolute;
	background: #fff;
	border-radius: 20%;
	transform: rotate(45deg);
	top: 0;
	right: 6%;
	margin-top: -9rpx;
}
.left {
	width: 20rpx;
	height: 20rpx;
	position: absolute;
	background: #fff;
	border-radius: 20%;
	transform: rotate(45deg);
	top: 0;
	left: 6%;
	margin-top: -9rpx;
}
</style>
