<template>
	<movable-area class="drag-sort" :style="{ height: currentListLength + 'px' }" id="drag">
		<movable-view
			v-for="(item, index) in currentList"
			:key="item.code"
			:x="0"
			:y="item.y"
			direction="vertical"
			disabled
			damping="40"
			:animation="active !== index"
			class="drag-sort-item"
			style="height:55px"
			:class="{ active: active === index, 'vh-1px-t': item.index > 0 }"
		>
			<image class="img" :src="item.icon || 'https://pic.cwyyt.cn/upload/img/20191213/1417461746_marketing.png'"></image>
			<view class="item">{{ item[props.label] }}</view>
			<view class="item">
				<switch
					class="switch blue"
					:class="item.isOpen === '1' ? 'checked' : ''"
					:checked="item.isOpen == '1'"
					@change="changeStatus($event, item)"
				/>
			</view>
			<view class="touch-tight"><image class="img-right" src="https://pic.cwyyt.cn/upload/yytApp/move.png"></image></view>
		</movable-view>
		<movable-view
			class="touch"
			:x="2000"
			@touchstart="touchstart"
			@touchmove="touchmove"
			@touchend="touchend"
			catchtouchstart
			catchtouchmove
			catchtouchend
		></movable-view>
	</movable-area>
</template>

<script>
import storage from '@/common/unistorage/index.js';
import moment from '@/lib/moment/moment.min.js';
import cw from '@/common/ceiwei/common.js';
export default {
	name: 'drag-sort-settings',
	mixins: [],
	components: {},
	data() {
		return {
			height: 55, // 高度
			currentList: [],
			active: -1, // 当前激活的item
			itemIndex: 0, // 当前激活的item的原index
			topY: 0, // 距离顶部的距离
			deviationY: 0, // 偏移量
			currentOpenCount: 0 // 当前打开的板块
		};
	},
	computed: {
		currentListLength() {
			return this.currentList.length * this.height;
		}
	},
	props: {
		list: {
			// 列表
			type: Array,
			default: () => {
				return [];
			}
		},
		limit: {
			// 限制的数量
			type: Number,
			default: -1
		},
		props: {
			type: Object,
			default: () => {
				return {
					label: 'label',
					value: 'value'
				};
			}
		},
		changeOpenStatus: {
			// switch开关触发的方法
			type: Function,
			default: function() {}
		}
	},
	watch: {
		list: {
			handler(val) {
				this.onUpdateCurrentList();
			},
			deep: true
		}
	},
	created() {
		this.onUpdateCurrentList();
	},
	mounted() {},
	updated() {},
	filters: {},
	methods: {
		onUpdateCurrentList() {
			let arr = [];
			for (const key in this.list) {
				arr.push({
					...this.list[key],
					index: Number(key),
					y: key * this.height,
					animation: true
				});
			}
			this.currentList = arr;
		},
		touchstart(e) {
			// 计算y轴点击位置
			var query = wx.createSelectorQuery().in(this);
			query.select('#drag').boundingClientRect();
			query.exec(res => {
				this.topY = res[0].top;
				let touchY = e.mp.touches[0].clientY - res[0].top;
				this.deviationY = touchY % this.height;
				// console.log(touchY)
				for (const key in this.currentList) {
					if (this.currentList[key].index * this.height < touchY && (this.currentList[key].index + 1) * this.height > touchY) {
						this.active = Number(key);
						this.itemIndex = this.currentList[key].index;
						break;
					}
				}
			});
		},
		touchmove(e) {
			if (this.active < 0) return;
			let touchY = e.mp.touches[0].clientY - this.topY - this.deviationY;
			// console.log(touchY)
			this.currentList[this.active].y = touchY;
			for (const key in this.currentList) {
				// 跳过当前操作的item
				if (this.currentList[key].index !== this.currentList[this.active].index) {
					if (this.currentList[key].index > this.currentList[this.active].index) {
						if (touchY > this.currentList[key].index * this.height - this.height / 2) {
							this.currentList[this.active].index = this.currentList[key].index;
							this.currentList[key].index = this.currentList[key].index - 1;
							this.currentList[key].y = this.currentList[key].index * this.height;
							break;
						}
					} else {
						if (touchY < this.currentList[key].index * this.height + this.height / 2) {
							this.currentList[this.active].index = this.currentList[key].index;
							this.currentList[key].index = this.currentList[key].index + 1;
							this.currentList[key].y = this.currentList[key].index * this.height;
							break;
						}
					}
				}
			}
		},
		touchend(e) {
			if (this.itemIndex !== this.currentList[this.active].index && this.active > -1) {
				this.$emit('change', {
					// 操作值
					data: (() => {
						let data = {
							...this.currentList[this.active]
						};
						// delete data.index;
						delete data.y;
						delete data.animation;
						return data;
					})(),
					// 插队的位置前面的值
					frontData: (() => {
						for (const iterator of this.currentList) {
							if (this.currentList[this.active].index - 1 === iterator.index) {
								let data = {
									...iterator
								};
								// delete data.index;
								delete data.y;
								delete data.animation;
								return data;
							}
						}
					})()
				});
			}
			this.currentList[this.active].animation = true;
			this.currentList[this.active].y = this.currentList[this.active].index * this.height;
			this.active = -1;
		},

		// switch开关触发显示隐藏
		changeStatus(e, item) {
			// 调整当前item的开关视觉效果，如果不设置，关闭switch，背景色还会是蓝色
			item.isOpen = item.isOpen == '1' ? '0' : '1';

			if (this.limit > -1) {
				let count = this.calcOpenCount(this.currentList);
				if (count > this.limit && item.isOpen == '1') {
					cw.showError(`超过最大展示限制${this.limit}个`);
					this.currentList.forEach((v, index) => {
						if (v.code == item.code) {
							this.$nextTick(() => { // 下一次循环再更新UI
								v.isOpen = '0';
								item.isOpen = '0';
								// console.log(v);
							});
						}
					});
					return;
				}
			}

			this.$emit('changeOpenStatus', item.code);
		},
		// 计算当前打开的板块数量
		calcOpenCount(list) {
			let count = 0;
			list.forEach((item, index) => {
				if (item.isOpen == '1') count++;
			});
			// console.log(`calcOpenCount: ${count}`);
			return count;
		}
	}
};
</script>

<style lang="less" scoped>
@import '~./1px.less';
.drag-sort {
	width: 100%;
}
.drag-sort-item {
	position: absolute !important;
	display: flex;
	align-items: center;
	width: 100%;
	padding: 0;
	margin: 0;
	background: #fff;
	padding: 0 15px;
	box-sizing: border-box;
	.img {
		width: 20px;
		height: 20px;
		margin-right: 10px;
	}
	.img-right {
		width: 12px;
		height: 20px;
	}
	.item {
		flex: 1;
	}
	.touch-tight {
		width: 24px;
		display: flex;
		justify-content: center;
	}
}
.touch {
	height: 100%;
	width: 50px;
}
.ico_drag {
	display: inline-block;
	width: 24px;
	height: 12px;
	background: url(data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAADAAAAAYCAYAAAC8/X7cAAAAAXNSR0IArs4c6QAAAEtJREFUWAnt1cEJACAMA0B1/506moIr5FEK51+Jl0d2Vd01+JzB2X90H5jeoPwECBDIBLYlzgDj25Y4JvQAAQIERgtY4u76LHF3Aw8rGQnK3sYAXQAAAABJRU5ErkJggg==)
		0 0 no-repeat;
	background-size: 100% auto;
}
.active {
	box-shadow: 0 0 40rpx #dddddd;
	z-index: 99;
}

uni-switch::after,
uni-switch::before {
	font-size: 0;
}
</style>
