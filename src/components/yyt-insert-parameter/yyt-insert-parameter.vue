<!--作者:覃彬-->
<template>
	<view class="yyt-insert-parameter">
		<!-- ======================================按钮============================================ -->
		<view class="">
			<!-- <view class="insert-btn mr-2" @tap="showPopup" v-if="isShareParame">插入分享内容</view> -->
			<view class="insert-btn" @tap="shortModal = true" :class="btnStyle">插入参数</view>
		</view>

		<!--============================================设置短信模板===================================-->
		<yyt-short class="sel-item" v-if="shortModal" v-on:close="shortModal = false">
			<text slot="title">插入参数</text>
			<image
				src="https://pic.cwyyt.cn/upload/yyticons/161400140_关闭.png"
				class="closeBtn"
				@tap="shortModal = false"
				slot="close"
			/>
			<view slot="content" class="shortContent">
				<view class="parameter-info" v-if="isNormalParame">
					<view class="parameter_title"><text>常规参数</text></view>
					<view class="parameter_content">
						<text
							class="select-item"
							v-for="(item, index) in commonParameters"
							:key="index"
							@tap="_onSelectCommonParam(item)"
						>
							{{ item.paramDesc }}
						</text>
					</view>
				</view>
				<view class="parameter-info" v-if="isAddParame">
					<view class="parameter_title"><text>附加参数</text></view>
					<view class="parameter_content">
						<text
							class="select-item"
							v-for="(item, index) in extraParameters"
							:key="index"
							@tap="_onSelectExtraParam(item)"
						>
							{{ item.paramDesc }}
						</text>
					</view>
				</view>
			</view>
		</yyt-short>
		<!-- =========================================底部弹出分享模板参数========================================== -->
		<!-- <uni-popup ref="selShare" type="bottom" :custom="true" class="bottom-popup " style="z-index: 990;">
			<view class="wrapper bg-white pt-3">
				<view class="font-30 font-weight text-center mb-2">选择分享内容</view>
				<view class="d-flex ">
					<scroll-view scroll-y="true" class="mr-3" style="height: 300rpx;width: 160rpx;">
						<view class="w-100">
							<view
								class="share-type w-100 line-h d-flex a-center j-center"
								:class="selShareData.shareCodeType == tItem.value ? 'bg-blue' : ''"
								v-for="(tItem, tIndex) in shareType"
								:key="tIndex"
								@tap="changeSelType(tItem.value)"
							>
								{{ tItem.lable }}
							</view>
						</view>
					</scroll-view>
					<scroll-view scroll-y="true" class="flex-1" style="height: 300rpx">
						<view class="d-flex a-center w-100 flex-wrap">
							<view
								class="share-item line-h py-1 px-2 text-center mr-2 mb-2"
								:class="selShareData.shareCodeId == item.shareCodeId ? 'bg-blue' : ''"
								v-for="(item, index) in sharepageList"
								:key="index"
								@tap="selShareData.shareCodeId = item.shareCodeId"
							>
								{{ item.text }}
							</view>
						</view>
					</scroll-view>
				</view>
				<view class="handle d-flex a-center">
					<view
						class="cancel text-primary w-50  h-100 d-flex a-center j-center border border-primary"
						@tap="shareCancel"
					>
						取消
					</view>
					<view
						class="confirm text-white w-50 h-100 d-flex a-center j-center bg-primary"
						@tap="_onShareParam()"
					>
						确认
					</view>
				</view>
			</view>
		</uni-popup> -->
	</view>
</template>

<script>
export { default } from './yyt-insert-parameter.js';
</script>

<style lang="less" scoped>
@import url('yyt-insert-parameter.less');
</style>
