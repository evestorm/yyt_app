import moment from '@/lib/moment/moment.min.js';
export default {
	name: 'yyt-progress',
	data() {
		return {
			dateRate: moment().date() / moment().daysInMonth() * 100 //时间进度
		};
	},
	props: {
		percent: {
			type: Number,
			default: 0,
			required: false
		},
		isShowDateRate: {
			type: Boolean,
			default: true,
			required: false,
		}
	},
	methods: {},
	computed: {
		calcPercent() {
			return this.percent;
		}
	}
}
