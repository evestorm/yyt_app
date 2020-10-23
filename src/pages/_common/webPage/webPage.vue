<template>
	<view style="background: #000;">
		<web-view :webview-styles="webviewStyles" :src="src"></web-view>
		</view>
</template>

<script>
export default {
	data() {
		return {
			webviewStyles: {
				progress: {
					color: '#FF3333'
				}
			},
			src: '' //接收到的url
		};
	},
	onLoad(option) {
		// console.log(option)
		this.src = option.url;
	}
};
</script>

<style scoped>
	p.MsoNormal{
		text-align: left;
	}
</style>
