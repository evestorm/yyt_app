<template>
	<view class="msg-template">
		<!-- 导航栏 -->
		<z-nav-bar class="z-nav-bar" :title="'短信模板'" bgColor="#0782ff" fontColor="#FFF">
			<!-- 返回 -->
			<sw-icon type="back" color="#fff" size="27" slot="left" @tap="onBack"></sw-icon>
			<!-- 新增 -->
			<sw-icon type="plusempty" color="#fff" size="60r" slot="right" @tap="goTempletInfo"></sw-icon>
		</z-nav-bar>
		<!-- 顶部筛选 -->
		<view class="top-filter-wrapper yyt-margin-top-bg" ref="topWrapperRef">
			<!-- 顶部filter -->
			<view class="bg-white nav uni-flex nav-filter">
				<!-- 模板类型 -->
				<view class="cu-item text-center">
					<view class="flex yyt-flex-center yyt-h-100" @tap.stop="templTypeToggle">
						<text>{{ templText }}</text>
						<!-- <uni-icons type="arrowdown" size="35r" color="#0183FF"></uni-icons> -->
						<image class="yyt-down-arrow-icon" :src="picDomain + '/upload/yytApp/my/down.png'" mode=""></image>
					</view>
					<view class="dropdown-panel" v-show="isShowTemplType">
						<view
							v-for="(item, index) in templType"
							:key="index"
							:class="['dropdown-item', item.selected ? 'dropdown-item-sel' : '']"
							@tap="seleTemplType(item)"
						>
							{{ item.label }}
						</view>
						<view class="dropdown-mask" v-show="isShowTemplType" @tap="hideDropdownAndMask"></view>
					</view>
				</view>
				<!-- 是否启用 -->
				<view class="cu-item text-center">
					<view class="flex yyt-flex-center yyt-h-100" @tap.stop="enableTypeToggle">
						<text>{{ enableText }}</text>
						<!-- <uni-icons type="arrowdown" size="35r" color="#0183FF"></uni-icons> -->
						<image class="yyt-down-arrow-icon" :src="picDomain + '/upload/yytApp/my/down.png'" mode=""></image>
					</view>
					<view class="dropdown-panel" v-show="isShowEnableType">
						<view
							v-for="(item, index) in enableType"
							:key="index"
							:class="['dropdown-item', item.selected ? 'dropdown-item-sel' : '']"
							@tap="seleEnabelType(item)"
						>
							{{ item.label }}
						</view>
						<view class="dropdown-mask" v-show="isShowEnableType" @tap="hideDropdownAndMask"></view>
					</view>
				</view>
			</view>
		</view>
		<!-- ========================= 列表 START ========================= -->
		<mescroll-uni
			:topbar="true"
			:down="downOption"
			@down="downCallback"
			:up="upOption"
			@up="upCallback"
			:top="topFilterWrapperBottom"
			:bottom="swBottom"
		>
			<view class="list-wrapper">
				<view class="msg-card pl-2 pt-2"
					v-for="(item, index) in smsTtmpletData" :key="index">
					<view class="header pr-2">
						<view class="title">{{ item.messageTemplateType | parseMessageTemplateType }}</view>
						<view class="enable-state">{{ item.isEnable | parseIsEnable }}</view>
					</view>
					<view class="main pl-1 pr-2">
						<view class="sub-title">{{ item.messageTemplateTitle }}</view>
						<view class="content" style="word-break: break-all;">
							<rich-text :nodes="item.messageTemplateContent"></rich-text>
						
						</view>
					</view>
					<view class="footer pl-1">
						<view class="date-wrapper">
							<view class="yyt-margin-right-small">
								<image class="yyt-small-img" :src="picDomain + '/upload/yytApp/my/date.png'" mode=""></image>
							</view>
							<view class="date">创建时间：{{ item.crateTime | parseDatetime }}</view>
						</view>
						<view class="tools-wrapper d-flex">
							<view class="px-3 pt-2 pb-2">
								<image class="yyt-normal-img" src="https://pic.cwyyt.cn/upload/yyticons/142403243_label-del.png" @tap="deleTemplet(item.messageTemplateID)"></image>
							</view>
							<view class="px-3 pt-2 pb-2">
								<image class="yyt-normal-img yyt-margin-left-bg" src="https://pic.cwyyt.cn/upload/yyticons/1423542354_label-edit.png" @tap="editTemplet(item.messageTemplateID)"></image>
							</view>
						</view>
					</view>
				</view>
			</view>
		</mescroll-uni>
		<!-- ================== 其他组件 ==================== -->
		<uni-popup ref="deletePopup" type="center" class="tip-popup" :custom="true">
		    <view class="wrapper">
		        <view class="popup-top">
		            <text>提示</text>
		            <image class="popup-top-img" :src="picDomain + '/upload/yytApp/banquet/quxiao.png'" mode="" @tap="close"></image>
		        </view>
		        <!-- popup中部 -->
		        <view class="popup-mid">
		            <image class="popup-mid-img" :src="picDomain + '/upload/yytApp/banquet/error.png'" mode=""></image>
		            <text>您确认删除此模板？</text>
		        </view>
		        <view class="popup-bot">
		            <view class="cancel" @tap="close">取消</view>
		            <view class="confirm" @tap="DeleteCY67">确定</view>
		        </view>
		    </view>
		</uni-popup>
	</view>
</template>

<script>
export { default } from './SMSTemplet.js';
</script>
<style lang="less" scoped>
@import url('SMSTemplet.less');
</style>
