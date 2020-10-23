<template>
	<view class="number-box">
		<view class="minus" @click="minus" :style="{ color: color, 'border-color': color, 'border-radius': fillet ? '99px' : '0rpx' }">－</view>
		<view class="number">
			<input type="number" @input="replaceInput" :disabled="isDisabled" v-model="inputValue" :style="{ width: inputValue.toString().length * 20 + 'rpx' }" />
		</view>
		<view class="add" @click="add" :style="{ color: color, 'border-color': color, 'border-radius': fillet ? '99px' : '0rpx' }">＋</view>
	</view>
</template>

<script>
export default {
	name: 'yyt-number-box',
	props: {
		value: {
			type: [Number, String],
			default: 1
		},
		min: {
			type: Number,
			default: 0
		},
		max: {
			type: Number,
			default: 100
		},
		step: {
			type: Number,
			default: 1
		},
		disabled: {
			type: Boolean,
			default: false
		},
		color: {
			type: [Number, String],
			default: '#FFF'
		},
		fillet: {
			type: Boolean,
			default: true
		}
	},
	created() {
		this.inputValue = +this.value;
		this.isDisabled = this.disabled;
		this.inputStep = parseFloat(this.step);
	},
	data() {
		return {
			inputValue: 0,
			isDisabled: false,
			inputStep: 1
		};
	},
	watch: {
		value(val) {
			this.inputValue = +val;
		},
		inputValue(newVal, oldVal) {
			if (+newVal !== +oldVal) {
				this.$emit('change', newVal);
			}
		}
	},
	methods: {
		minus() {
			if (+this.inputValue - +this.inputStep < +this.min) {
				return;
			}
			this.inputValue = +this.inputValue - +this.inputStep;
		},
		add() {
			if (+this.inputValue + +this.inputStep > +this.max) {
				return;
			}
			this.inputValue = +this.inputValue + +this.inputStep;
		},
		replaceInput(e) {
			const value = e.target.value;
			if (+value >= +this.max) {
				this.$nextTick(() => {
					this.inputValue = +this.max;
				})
			} else if (+value <= +this.min) {
				this.$nextTick(() => {
					this.inputValue = +this.min;
				})
			} else {
				this.$nextTick(() => {
					this.inputValue = +value;
				})
			}
		}
	}
};
</script>

<style lang="scss">
$themeColor: #FFF;
$themeBgColor: #D9D9D9;
.number-box {
	display: flex;
	flex-direction: row;
	align-items: center;
	justify-content: center;
	.minus,
	.add {
		display: flex;
		justify-content: center;
		align-items: center;
		width: 40rpx;
		height: 40rpx;
		border-radius: 50rpx;
		color: $themeColor;
		font-size: 32rpx;
		background-color: $themeBgColor;
		border: 1px solid $themeBgColor;
	}
	.number {
		padding: 0 30rpx;
	}
}
</style>
