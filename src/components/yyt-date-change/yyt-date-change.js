// 作者:覃彬

//------------------------------mock数据引入---------------------------
import yytDateChange from './yyt-date-change_mock.js';

export default {
	name: 'yyt-date-change',
	// 注册属性
	props: {
		inputItems: {
			type: Array,
			require: false,
			default: () => [{}],
		},
		type: { //暂时只写了yearMonth date 和range 三种类型
			type: String,
			require: true,
			default: 'date'
		}
	},

	data() {
		return {
			picDomain: getApp().globalData.PicDomain, //
			date: {
				// startDate: '', //开始时间
				// endDate: '', //结束时间
			},
			dateRange: { //picker组件选择时间范围
				startDate: this.$moment().subtract(10, 'years').format('YYYY'), //开始时间
				endDate: this.$moment().add(10, 'years').format('YYYY'), //结束时间
				defaultDateRangeArr: this.type == 'range' ? [...this.$moment().format('YYYY-MM-DD').split('-'), '-', ...this.$moment()
					.format('YYYY-MM-DD')
					.split('-')
				] : this.type == 'yearMonth' ? this.$moment().format('YYYY-MM').split('-') : this.$moment().format('YYYY-MM-DD').split(
					'-'),
			},

		};
	},
	created() {
		switch (this.type) {
			case 'date': //年月日
				this.date.chooseDate = this.$moment().format('YYYY-MM-DD');
				break;
			case 'yearMonth': //年月
				this.date.chooseDate = this.$moment().format('YYYY-MM');
				break;
			case 'range': //范围
				this.date.startDate = this.$moment().format('YYYY-MM');
				this.date.endDate = this.$moment().format('YYYY-MM');
				break;
			default:
				this.date.chooseDate = this.$moment().format('YYYY-MM');
				break;
		}
		this.date = Object.assign({}, this.date);

	},
	methods: {
		//选择切换月份范围
		selDataRange() {
			this.$nextTick(() => {
				this.$refs.dateRange.show();
			});
		},
		onConfirmDateRange(val) { //确认选择时间范围
			switch (this.type) {
				case 'date': //年月日
					this.date.chooseDate = val.result;
					break;
				case 'yearMonth': //年月
					this.date.chooseDate = val.result;
					break;
				case 'range': //范围
					this.date.startDate = val.from.slice(0, 7);
					this.date.endDate = val.to.slice(0, 7);
					break;
				default:
					this.date.chooseDate = val.result;
					break;
			}

		},
		// 前一月
		getPre() {
			switch (this.type) {
				case 'date': //年月日
					this.date.chooseDate = this.$moment(this.date.chooseDate).subtract(1, 'days').format('YYYY-MM-DD');
					this.dateRange.defaultDateRangeArr = this.date.chooseDate.split('-');
					break;
				case 'yearMonth': //年月
					this.date.chooseDate = this.$moment(this.date.chooseDate).subtract(1, 'months').format('YYYY-MM');
					this.dateRange.defaultDateRangeArr = this.date.chooseDate.split('-');
					break;
				case 'range': //范围
					this.date.startDate = this.$moment(this.date.startDate).subtract(1, 'months').format('YYYY-MM');
					this.date.endDate = this.$moment(this.date.endDate).subtract(1, 'months').format('YYYY-MM');
					break;
				default:
					this.date.chooseDate = this.$moment(this.date.chooseDate).subtract(1, 'months').format('YYYY-MM');
					break;
			}

		},
		// 后一月
		getNext() {
			switch (this.type) {
				case 'date': //年月日
					this.date.chooseDate = this.$moment(this.date.chooseDate).add(1, 'days').format('YYYY-MM-DD');
					this.dateRange.defaultDateRangeArr = this.date.chooseDate.split('-');
					break;
				case 'yearMonth': //年月
					this.date.chooseDate = this.$moment(this.date.chooseDate).add(1, 'months').format('YYYY-MM');
					this.dateRange.defaultDateRangeArr = this.date.chooseDate.split('-');
					break;
				case 'range': //范围
					this.date.startDate = this.$moment(this.date.startDate).add(1, 'months').format('YYYY-MM');
					this.date.endDate = this.$moment(this.date.endDate).add(1, 'months').format('YYYY-MM');
					break;
				default:
					this.date.chooseDate = this.$moment(this.date.chooseDate).add(1, 'months').format('YYYY-MM');
					break;
			}

		},
	},
	computed: {
		items() {
			return this.inputItems;
		},
	},
	watch: {
		"date": {
			handler(val, oldval) {
				if (val) {
					this.$emit('chooseRangeDate', val);
				}
			},
			deep: true
		}
	},
};
