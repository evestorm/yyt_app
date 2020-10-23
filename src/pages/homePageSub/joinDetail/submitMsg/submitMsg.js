// 作者:杨亮

//------------------------------mock数据引入---------------------------
import submitMsg from './submitMsg_mock.js';

export default {
	name: 'submitMsg',
	// 注册属性
	props: {
		onInput: {
			type: Object,
			default: () => {},
		}
	},
	created() {},
	mounted() {
		this.autoHeightTextArea();
	},
	data() {
		return {
			content: '', // 评价的内容
			autoHeight: 36, // 默认高度
		};
	},
	methods: {
		// 注册事件 注意 暴露给外面的事件 以_on开头 里面的事件不用
		_onSendAMsg() {
			// 不需要下面这行了，用css搞定
			// word-wrap: break-word;word-break: break-all;
			// this.content = this.content.replace(/\r?\n/g, '\n');
			this.$emit('onSendAMsg', this.content);
		},
		textareaAInput(e) {
			this.content = e.detail.value;
			this.$emit('onInput', {
				content: this.content,
				autoHeight: this.autoHeight,
			});
		},
		autoHeightTextArea() {
			const el = this.$refs.textarea.$el;

			let textArea = el;
			let observe;
			if (window.attachEvent) {
				observe = (element, event, handler) => {
					element.attachEvent('on' + event, handler);
				}
			} else {
				observe = (element, event, handler) => {
					element.addEventListener(event, handler, false);
				}
			}

			observe(textArea, 'change', this.resize.bind(this, textArea));
			// observe(textArea, 'resize', this.resize.bind(this, textArea));
			observe(textArea, 'cut', this.delayedResize.bind(this, textArea));
			observe(textArea, 'paste', this.delayedResize.bind(this, textArea));
			observe(textArea, 'drop', this.delayedResize.bind(this, textArea));
			observe(textArea, 'keydown', this.delayedResize.bind(this, textArea));

			this.resize(textArea);
		},

		resize(el) {
			setTimeout(() => {
				el.style.height = 'auto';
				el.style.height = (el.scrollHeight + 3) + 'px';
				this.autoHeight = el.scrollHeight;
			});
		},

		delayedResize(el) {
			setTimeout(this.resize.bind(this, el), 0);
		},
	},
	computed: {
		items() {
			return this.inputItems;
		},
	},
	filters: {
		// parseScene(value) {
		// return value+'123';
		// }
	},
	watch: {
		"content": {
			handler(val) {
				if (val == '') {
					// 清空评价内容后，重新计算textarea高度
					const el = this.$refs.textarea.$el;
					setTimeout(() => {
						this.resize(el);
						this.$emit('onInput');
					}, 100);
				}
			}
		}
	},
};
