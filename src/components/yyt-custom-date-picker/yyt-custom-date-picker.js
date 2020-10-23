export default {
	name: 'yyt-custom-picker',
	// 注册属性
	props: {
		dateArr: {
			type: Array,
			require: true,
			default: function() {
				return [{
					label: '当日',
					selected: false,
					value: 0
				}, {
					label: '近7日',
					selected: false,
					value: 1
				}, {
					label: '当月',
					selected: true,
					value: 2
				}, {
					label: '自定义',
					selected: false,
					value: 3
				}]
			}
		},
	},
	data() {
		return {
			// 时间范围picker的默认值设置(开始范围[str],结束范围[str],默认范围[arr])
			startDateStr: this.$moment().subtract(10, 'years').format('YYYY'),
			endDateStr: this.$moment().add(10, 'years').format('YYYY'),
			// ['2010','01','01','-','2030','01','01']
			defaultDateRangeArr: [...this.$moment().format('YYYY-MM-DD').split('-'), '-', ...this.$moment().format('YYYY-MM-DD')
				.split('-')
			],
		};
	},
	computed: {},
	methods: {
		// 时间类型选择
		_onSelectDate(e, item, idx) {
			// !=3是因为3是对应着自定义，自定义可以重复点击弹出picker
			if (item.selected && idx !== this.dateArr.length - 1) return;
			// 选择了自定义
			if (idx == this.dateArr.length - 1) {
				this.$nextTick(() => {
					this.$refs.dateRangePicker.show();
				});
				return;
			} else {
				const result = this._.filter(this.dateArr, (v, idx) => idx === this.dateArr.length - 1);
				result[0].selected = false;
				result[0].label = '自定义';
				this.dateArr.forEach((item) => item.selected = false);
				item.selected = true;
				// 返回当前事件对象，当前选中项，当前选中项索引
				this.$emit('onSelectDate', e, item, idx);
			}
		},
		// 确认时间范围
		_onConfirmDateRange(val) {
			this.dateArr.forEach((item) => item.selected = false);
			const result = this._.filter(this.dateArr, (v, idx) => idx === this.dateArr.length - 1);
			result[0].selected = true;
			result[0].label = val.from !== val.to ? val.from + ' 至 ' + val.to : val.to;
			// 返回当前选中时间
			this.$emit('onConfirmDateRange', val);
		},
		// 取消了时间范围选择
		_onCancelPickerSelect() {
			this.$emit('onCancelPickerSelect');
		}
	}
};
