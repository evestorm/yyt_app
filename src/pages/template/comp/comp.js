// 作者:{Author}

export default {
	name: 'comp',
	// 注册属性
	props: {
		inputItems: {
			type: Array,
			require: false,
			default: ()=>[{
				
			}]
		}
	},
	created(){
		
	},
	data() {
		return {
			title: {}
		};
	},
	methods: {
		// 注册事件 注意 暴露给外面的事件 以_on开头 里面的事件不用
		_onClick() {
			this.$emit('onClick');
		}
	},
	Computed: {
		items(){
			return this.inputItems;
		}
	},
	filters: {
		// parseScene(value) {
		// return value+'123';
		// }
	},
	watch: {
		// "currentStore.storeId": {
		//    handler(val, oldval) {
		//        if (val) {
	
		//        }
		//    }
		// }
	}
};