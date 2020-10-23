<template>
	<view>
		<view class="content">
			<z-nav-bar class="z-nav-bar" :title="title" bgColor="#0183ff" fontColor="#FFF">
				<sw-icon type="back" color="#fff" size="27" slot="left" @tap="onBack"></sw-icon>
				<view class="right-selector" slot="right" @tap="saveTempletInfo(id)">
					<text class="tools-text">保存</text>
				</view>
			</z-nav-bar>
			<view class="smsTemplet">
				<view class="smsTemplet_Info">
					<view class="templet_heading">
						<view class="templet_title">
							<text class="sign">*</text>
							<text class="title">模板标题</text>
						</view>
						<view class="templet_content">
							<input
								v-model="messageTemplateForm.messageTemplateTitle"
								placeholder-style="fontSize:22rpx"
								placeholder="请输入模板标题"
							/>
						</view>
					</view>
					<view class="templet_style">
						<view class="templet_title">
							<text class="sign visibility ">*</text>
							<text class="title">模板类型</text>
						</view>
						<view class="templet_content">
							<text
								class="selectItem  notice"
								v-for="(item, index) in messageTemplateTitle"
								:class="{ selectedStyle: num == index }"
								@tap="selectTemplateStyle(index)"
								:key="index"
							>
								{{ item }}
							</text>
						</view>
					</view>
					<!-- 模板跟踪规则 暂时废弃 -->
					<!-- <view class="templet_rules" v-if="num == 1">
						<view class="templet_title">
							<text class="sign visibility">*</text>
							<text class="title">模板跟踪规则</text>
						</view>
						<view class="templet_content">
							<text
								class="selectItem"
								v-for="(item, index) in rulesCode"
								:key="index"
								v-bind:class="{ selectedStyle: item.active }"
								@tap="selectFollowRules(item)"
							>
								{{ item.name }}
							</text>
						</view>
					</view> -->
					<view class="templet_substance">
						<view class="templet_titleInfo">
							<view class="templet_title">
								<text class="sign">*</text>
								<text class="title">模板内容</text>
							</view>
							<view class="parameter ml-auto mr-2" @tap="selectShare">插入营销内容</view>
							<!-- <view class="parameter" @tap="selectParameter">插入参数</view> -->
							<yyt-insert-parameter
								:isNormalParame="isNormalParame"
								:isAddParame="isAddParame"
								@addStr="getParameter"
							></yyt-insert-parameter>
						</view>
						<view class="templet_content">
							<textarea
								v-model="messageTemplateForm.messageTemplateContent"
								placeholder="请输入模板内容"
								id="textareaContent"
								ref="textareaContentRef"
								@blur="bindTextAreaBlur"
								:focus="isFocus"
								:cursor="cursorPos"
							></textarea>
						</view>
					</view>
					<!-- 预览 -->
					<view class="preview py-2 pl-2">
						<view class="d-flex j-sb a-center">
							<view class="title" @tap="getPreview">模板预览</view>
						</view>
						<view class="pre-content" :class="isShowTSimulation?'':'text-dark-gray'">
							<rich-text :nodes="simulationTemplate" style="word-break: break-all;"></rich-text>
						</view>
					</view>
					<view class="templet_isUse">
						<view class="templet_isUse_title">是否启用</view>
						<switch
							class="switch blue"
							@change="changeSex"
							:class="messageTemplateForm.isEnable === 1 ? 'checked' : ''"
							:checked="messageTemplateForm.isEnable === 1 ? true : false"
						></switch>
					</view>
				</view>
			</view>
		</view>
		<!-- 底部logo -->
		<view class="logoPic">
			<image src="https://pic.cwyyt.cn/upload/yyticons/0952195219_logo.png" class="bot-logo"></image>
		</view>
		<uni-popup ref="selShare" type="bottom" :custom="true" class="bottom-popup " style="z-index: 990;">
			<view class="wrapper bg-white pt-3">
				<view class="font-30 font-weight text-center mb-2">选择营销内容</view>
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
						@tap="shareConform"
					>
						确认
					</view>
				</view>
			</view>
		</uni-popup>
	</view>
</template>

<script>
export { default } from './TempletInfo.js';
</script>

<style lang="less">
@import url('TempletInfo.less');
</style>
