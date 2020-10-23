// 作者:杨亮

//------------------------------mock数据引入---------------------------
const app = getApp()

export default {
	name: 'virtual-list',
	// 注册属性
	props: {
		//所有列表数据
		listData: {
			type: Array,
			default: () => []
		},
		//预估高度
		estimatedItemSize: {
			type: Number,
			required: true
		},
		//缓冲区比例
		bufferScale: {
			type: Number,
			default: 1
		},
		//容器高度 100px or 50vh
		height: {
			type: String,
			default: '100%'
		},
	},
	computed: {
		_listData() {
			return this.listData.map((item, index) => {
				return {
					_index: `_${index}`,
					item
				}
			})
		},
		visibleCount() {
			return Math.ceil(this.screenHeight / this.estimatedItemSize);
		},
		aboveCount() {
			return Math.min(this.start, this.bufferScale * this.visibleCount)
		},
		belowCount() {
			return Math.min(this.listData.length - this.end, this.bufferScale * this.visibleCount);
		},
		visibleData() {
			let start = this.start - this.aboveCount;
			let end = this.end + this.belowCount;
			return this._listData.slice(start, end);
		}
	},
	created() {
		this.initPositions();
	},
	mounted() {
		this.screenHeight = this.$el.clientHeight;
		this.start = 0;
		this.end = this.start + this.visibleCount;
	},
	// 当前组件被激活时，读取缓存的锚点位置
	activated() {
		const anchor = this.$storage.getABScrollTop();
		this.$refs.list.$el.scrollTop = anchor ? anchor : 0;
	},
	// 当前组件失去活跃状态时，存储当前锚点位置
	deactivated() {
		this.$storage.setABScrollTop(this.curScrollTop);
	},
	updated() {
		// console.time('updated');
		this.$nextTick(function() {
			// console.log(this.$refs.items);
			if (!this.$refs.items || !this.$refs.items.length || !this.positions.length) {
				return;
			}
			//获取真实元素大小，修改对应的尺寸缓存
			this.updateItemsSize();
			//更新列表总高度
			let height = this.positions[this.positions.length - 1].bottom;
			this.$refs.phantom.$el.style.height = height + 'px'
			//更新真实偏移量
			this.setStartOffset();
			// console.timeEnd('updated');
		})
	},
	data() {
		return {
			//可视区域高度
			screenHeight: 0,
			//起始索引
			start: 0,
			//结束索引
			end: 0,
			curScrollTop: -1,
		};
	},
	methods: {
		initPositions() {
			let tempArr = [];
			// 第一个元素距离搜索栏高度
			let curTop = 0;
			this.listData.forEach((v, idx) => {
				// 计算高度 = 如果是索引，高度为100，联系人item则为172==>220
				let height = v.groupName ? uni.upx2px(100) : uni.upx2px(220);
				// 计算完整锚点：
				tempArr.push({
					top: curTop,
					bottom: curTop + height,
					index: idx,
					height: height,
				});
				// 当前分组top
				curTop = curTop + height;
			});
			this.positions = tempArr;
		},
		//获取列表起始索引
		getStartIndex(scrollTop = 0) {
			//二分法查找
			return this.binarySearch(this.positions, scrollTop)
		},
		binarySearch(list, value) {
			let start = 0;
			let end = list.length - 1;
			let tempIndex = null;
			while (start <= end) {
				let midIndex = parseInt((start + end) / 2);
				let midValue = list[midIndex].bottom;
				if (midValue === value) {
					return midIndex + 1;
				} else if (midValue < value) {
					start = midIndex + 1;
				} else if (midValue > value) {
					if (tempIndex === null || tempIndex > midIndex) {
						tempIndex = midIndex;
					}
					end = end - 1;
				}
			}
			return tempIndex;
		},
		//获取列表项的当前尺寸
		updateItemsSize() {
			let nodes = this.$refs.items;
			nodes.forEach((node) => {
				node = node.$el;
				let rect = node.getBoundingClientRect();
				let height = rect.height;
				let index = +node.id.slice(1)
				// console.log(this.positions);
				let oldHeight = this.positions[index].height;
				let dValue = oldHeight - height;
				//存在差值
				if (dValue) {
					this.positions[index].bottom = this.positions[index].bottom - dValue;
					this.positions[index].height = height;
					for (let k = index + 1; k < this.positions.length; k++) {
						this.positions[k].top = this.positions[k - 1].bottom;
						this.positions[k].bottom = this.positions[k].bottom - dValue;
					}
				}
			})
		},
		//获取当前的偏移量
		setStartOffset() {
			let startOffset;
			if (this.start >= 1) {
				let size = this.positions[this.start].top - (this.positions[this.start - this.aboveCount] ? this.positions[this.start -
					this.aboveCount].top : 0);
				startOffset = this.positions[this.start - 1].bottom - size;
			} else {
				startOffset = 0;
			}
			// console.log(`startOffset:${startOffset}`)
			this.$refs.content.$el.style.transform = `translate3d(0,${startOffset}px,0)`
		},
		//滚动事件
		scrollEvent() {
			// console.time('scrollEvent');
			// console.log('scrollEvent：' + this.$refs.list.$el.scrollTop);
			//当前滚动位置
			let scrollTop = this.$refs.list.$el.scrollTop;
			// let startBottom = this.positions[this.start - ]
			//此时的开始索引
			this.start = this.getStartIndex(scrollTop);
			//此时的结束索引
			this.end = this.start + this.visibleCount;
			// console.log(this.start, this.end);
			//此时的偏移量
			this.setStartOffset();
			this.curScrollTop = this.$refs.list.$el.scrollTop;
			// console.timeEnd('scrollEvent');
		},
		// 外部直接定位滚动位置
		updateLocation(scrollTop) {
			console.log('updateLocation：' + scrollTop)
			if (scrollTop !== -1) {
				this.$refs.list.$el.scrollTop = +scrollTop;
			}
		}
	}
};
