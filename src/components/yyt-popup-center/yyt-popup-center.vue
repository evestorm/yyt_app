<template>
	<uni-popup ref="popup" type="center" class="tip-popup" :custom="true">
	    <view class="wrapper">
	        <view class="popup-top">
	            <text>{{ title }}</text>
	            <image class="popup-top-img" :src="picDomain + '/upload/yytApp/banquet/quxiao.png'" mode="" @click="close()"></image>
	        </view>
	        <view class="popup-mid">
	            <image class="popup-mid-img" v-if="isShowErrImg" :src="picDomain + '/upload/yytApp/banquet/error.png'" mode=""></image>
	            <text>{{ desc }}</text>
	        </view>
	        <view class="popup-bot">
	            <view class="cancel" @click="close()">{{cancelText}}</view>
	            <view class="confirm" @click="confirm()">{{confirmText}}</view>
	        </view>
	    </view>
	</uni-popup>
</template>

<script>
	export default {
		name: 'yyt-popup-center',
		props: {
			title: {
				type: String,
				require: false,
				default: '提示'
			},
			desc: {
				type: String,
				require: false,
				default: '您确定要删除该任务？'
			},
			cancelText:{//取消按钮文字
				type: String,
				require: false,
				default: '取消'
			},
			confirmText:{
				type: String,
				require: false,
				default: '确定'
			},
			isShowErrImg:{
				type:Boolean,
				require:false,
				default:true
			},
			// 成功的回调
			success: {
				type: Function,
				require: false,
				default: () => {}
			},
			// 取消回调
			cancel: {
				type: Function,
				require: false,
				default: () => {}
			}
		},
		data() {
			return {
				picDomain: getApp().globalData.PicDomain,
			}
		},
		methods: {
			close() {
				this.$refs.popup.close();
				this.cancel();
			},
			open() {
				this.$refs.popup.open();
			},
			confirm() {
				this.$refs.popup.close();
				this.success();
			}
		}
	}
</script>

<style lang="less">

</style>
