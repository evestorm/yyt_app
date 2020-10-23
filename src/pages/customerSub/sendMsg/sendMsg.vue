<template>
	<view class="send-msg-page">
		<!-- 导航栏 -->
		<z-nav-bar class="z-nav-bar" title="发送短信" bgColor="#0782ff" fontColor="#FFF">
			<!-- 返回 -->
			<sw-icon type="back" size="27" slot="left" @tap="onBack" color="#FFF"></sw-icon>
			<!-- 保存 -->
			<view class="right-selector" slot="right" @tap="onShowTip"><text class="tools-text">说明</text></view>
		</z-nav-bar>
		<!-- 说明内容 -->
		<view class="send-explain" v-show="isExplain">
			【】里面的内容会替换成对应的真实数据，可以点击预览查看。
		</view>
		<view class="msg-top">
			<text class="msg-title">发送内容:</text>
			<navigator
				hover-class="none"
				:url="`/pages/customerSub/msgMould/msgMould?isClue=${previewData.isClue}`"
			>
				<text class="msg-btn">短信模板</text>
			</navigator>
		</view>
		<view class="msg-sec">
			<!-- @input="changeMessage" -->
			<textarea
				@blur="bindTextAreaBlur"
				class="msg-textarea"
				v-model="message"
				:cursor="cursorPos"
				ref="dxContent"
				placeholder=""
			/>
			<image
				@tap="message = ''"
				class="del-img"
				:src="picDomain + '/upload/yyticons/142403243_label-del.png'"
				mode=""
			></image>
		</view>
		<view class="d-flex a-center mb-4 px-2 ">
			<view class="text-danger font-22 text-lightmuted">点击右侧预览，查看短信预览详情</view>
			<yyt-insert-parameter
				btnStyle="blueBorder"
				class="yyt-insert ml-auto"
				ref="insertParameter"
				:isNormalParame="true"
				:isAddParame="previewData.isClue==3"
				@addStr="getParameter"
			></yyt-insert-parameter>
			<view
				class="text-primary text-primary ml-2 line-h preview-brtn"
				:class="{active: previewIsActive}"
				v-if="customerList.length > 0"
				@tap="previewMsg"
			>
				预览
			</view>
		</view>
		<view class="msg-top">
			<view class="">
				<text class="msg-title">收件人:</text>
				<text class="msg-tip" v-show="customerList.length > 0 && isCueCome == false">
					已选{{ customerList.length }}个，还可以再选{{ 200 - customerList.length }}个
				</text>
				<text class="msg-tip" v-show="customerList.length == 0 && isCueCome == false">可选200个</text>
			</view>
			<navigator url="/pages/customerSub/addReceive/addReceive" hover-class="none">
				<text class="msg-btn" v-show="!isCueCome && $cw.groupSentMessage()">添加收件人</text>
			</navigator>
		</view>
		<view class="msg-receive-list pl-3 pb-2" v-for="(item, listIndex) in customerList" :key="listIndex">
			<view class="list-top">
				<view class="" @tap="jumpCustomerInfo(item)">
					<text class="receive-name font-weight" :class="item.customerID && !previewData.isClue?'text-primary':''">{{ item.customerName }}</text>
					<text class="receive-name font-22 mr-3" v-show="item.customSaveName">
						(通讯录名:{{ item.customSaveName }})
					</text>
					<text class="receive-name font-weight">{{ item.phone }}</text>
					<text class="yyt-error font-22" v-if="!isCueCome" v-cloak>{{item | parseIsCanGroup}}</text>
					<text class="receive-name ml-1 text-success" v-show="item.status==1">已发送</text>
				</view>
				<!-- <text v-show="!isCueCome" class="receive-btn" @tap="changeMsgName(item)">
					修改尊称
				</text> -->
				<view class="d-flex a-center">
					<view class="p-3">
						<image
							@tap="delCustomer(item.customerID)"
							class="del-img"
							src="https://pic.cwyyt.cn/upload/yyticons/142403243_label-del.png"
							mode=""
						></image>
					</view>
					<view class="p-3 ml-1" v-show="item.isTemp">
						<image
							@tap="item.isEdit = true"
							class="del-img"
							src="https://pic.cwyyt.cn/upload/yyticons/1423542354_label-edit.png"
							mode=""
						></image>
					</view>
				</view>
			</view>
			<!-- ============================================预览========================== -->
			<view class="border border-light-gray radius-20 mr-3" v-show="item.isTemp">
				<view class="mx-0 ml-auto mr-auto  p-2" v-show="item.isEdit">
					<textarea
						auto-height
						class="font-24 w-100"
						maxlength="300"
						v-model="item.realContent"
						placeholder=""
						:focus="item.isEdit"
					/>
				</view>
				<view class="mx-0 ml-auto mr-auto font-24 w-100 p-2 constent-msg" v-show="!item.isEdit">
					<rich-text :nodes="item.content"></rich-text>
				</view>
			</view>
			<!-- <view class="list-bot" v-show="!isCueCome">
				<view class="list-bot-item">
					<text class="bot-label">尊称：</text>
					<text
						class="receive-name"
						:class="{ //客户尊称与客户名称或通讯录名称不一致时标红
							botRed: item.msgName != item.customerName && item.msgName != item.customSaveName
						}"
					>
						{{ item.msgName}}
					</text>
				</view>
				<view class="list-bot-item text-ellipsis">
					<text class="bot-label">客户姓名：</text>
					<text class="bot-label">{{ item.customerName }}</text>
				</view>
				<image
					@tap="delCustomer(item.customerID)"
					class="del-img"
					src="https://pic.cwyyt.cn/upload/yyticons/142403243_label-del.png"
					mode=""
				></image>
			</view> -->
		</view>
		<view style="width:100%;height:110rpx"></view>
		<view class="bot-btn">
			<!-- 发送短信 -->
			<view v-show="customerList.length > 1" class="btn send-msg" @tap="clickSendMsg()">发送短信</view>
			<!-- 发送短信+微信 -->
			<view class="btns" v-show="customerList.length <= 1">
				<view class="btn" @tap="clickSendMsg()">发送短信</view>
				<view class="btn" @tap="clickSendWx()">发送微信</view>
			</view>
		</view>
		<!-- 弹出确认提示框 -->
		<uni-popup ref="delPopup" type="center" class="del-popup">
			<view class="popup-top">
				<!-- <text v-show="popupIndex == 1">修改尊称</text> -->
				<!-- <text v-show="popupIndex == 2">提示</text> -->
				<text v-show="popupIndex == 2">确定要发送短信</text>
				<image
					class="popup-top-img"
					:src="picDomain + '/upload/yytApp/banquet/quxiao.png'"
					mode=""
					@tap="cancel()"
				></image>
			</view>
			<!-- popup中部 -->
			<!-- <view class="popup-mid" v-show="popupIndex == 1">
				<text class="msgName-title">客户尊称：</text>
				<input
					class="msgName-input"
					type="text"
					v-model="msgNameQuery.msgName"
					placeholder="请输入客户尊称"
				/>
			</view> -->
			<view class="popup-mid" v-show="popupIndex == 2">
				<image
					class="popup-mid-img"
					:src="picDomain + '/upload/yytApp/banquet/tishi.png'"
					mode=""
				></image>
				<text>您确定要发送信息给这{{ customerList.length }}个客户吗？</text>
			</view>
			<!-- <view class="popup-mid" v-show="popupIndex == 3">
				<image
					class="popup-mid-img"
					:src="picDomain + '/upload/yytApp/banquet/error.png'"
					mode=""
				></image>
				<text>有{{ num }}个客户名称和客户尊称不一致!</text>
			</view> -->

			<view class="popup-bot">
				<view class="cancel" @tap="cancel()">取消</view>
				<view class="confirm" @tap="confirm()">确定</view>
			</view>
		</uni-popup>
		<!-- 短信预览弹窗 -->
		<!-- <uni-popup ref="previewPopop" type="center" class="tip-popup" :custom="true" :maskClick="false">
			<view class="wrapper">
				<view class="popup-top">
					<view class="">预览</view>
					<image
						src="https://pic.cwyyt.cn/upload/yyticons/161400140_关闭.png"
						mode=""
						@tap="closePreviewPopup"
						class="popup-top-img"
					></image>
				</view>
				<scroll-view scroll-y="true" style="height:calc(100vh - 400upx)">
					<view class="text-left">
						<view class="pre-list" v-for="(item,temIndex) in messageFillTemplate" :key='temIndex'>
							<rich-text :nodes="item"></rich-text>
						</view>
					</view>
				</scroll-view>
			</view>
		</uni-popup> -->
	</view>
</template>

<script>
export { default } from './sendMsg.js';
</script>

<style lang="less" scoped>
@import url('sendMsg.less');
</style>
