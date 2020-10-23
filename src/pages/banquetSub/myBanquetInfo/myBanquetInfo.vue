<template>
	<view class="my-banquet-info">
		<view class="my-bq-top">
			<view class="my-bq-top-left">
				<view class="my-bq-top-left1">
					<view class="my-bq-top-left-info">
						<image class="touxiang" :src="yhClue.headImg||'https://pic.cwyyt.cn/upload/yytApp/images/salesperson.png'" mode=""></image>
						<view class="my-bq-top-left1-info">
							<view class="">
								<text class="name">{{ yhClue.clueUserName || ' ' }}</text>
								<text class="handle" v-if="yhClue.customerID == ''" @tap="changCustomer()">转为客户>></text>
								<image @tap="goCustomerInfo(yhClue.customerID)" class="my-bq-top-left1-img" v-if="yhClue.customerID" :src="picDomain + '/upload/yytApp/banquet/kehu.png'" mode=""></image>
							</view>
							<view class="phone">{{ yhClue.clueUserPhone }}</view>
						</view>
					</view>
				</view>
				<view class="my-bq-top-left2">
					<image class="com-img" :src='picDomain + "/upload/yytApp/banquet/gongsi.png"' mode=""></image>
					<text class="com-text">{{ yhClue.clueUserCompany }}</text>
				</view>
			</view>

			<view class="my-bq-top-right">
				<view class="my-bq-top-right-top">
					<image @tap="sendMSM(yhClue)" class="do-duanxin" :src="picDomain + '/upload/yytApp//banquet/duanxin.png'" mode=""></image>
					<image @tap="telPhoneRecode()" class="do-tel" :src="picDomain + '/upload/yytApp/banquet/tel.png'" mode=""></image>
				</view>
				<!-- 高 -->
				<image v-if="yhClue.clueLevel == 3" class="suc-type" :src="picDomain + '/upload/yytApp/banquet/bg1.png'" mode=""></image>
				<view v-if="yhClue.clueLevel == 3" class="suc-text">A</view>
				<!-- 中 -->
				<image v-if="yhClue.clueLevel == 2" class="suc-type" :src="picDomain + '/upload/yytApp/banquet/bg2.png'" mode=""></image>
				<view v-if="yhClue.clueLevel == 2" class="suc-text">B</view>
				<!-- 低 -->
				<image v-if="yhClue.clueLevel == 1" class="suc-type" :src="picDomain + '/upload/yytApp/banquet/bg1.png'" mode=""></image>
				<view v-if="yhClue.clueLevel == 1" class="suc-text">C</view>
			</view>
		</view>
		<view class="my-bq-mid">
			<view class="my-bq-mid1-info">
				<view class="title">生日:</view>
				<view class="desc">{{ yhClue.clueUserBirthdayDate | parseShortDate }}</view>
			</view>
			<view class="my-bq-mid1-info">
				<view class="title">住址:</view>
				<view class="des">{{ yhClue.clueUserAddress }}</view>
			</view>
		</view>
		<view class="my-bq-mid">
			<view class="my-bq-mid1-info">
				<view class="title">宴会类型:</view>
				<view class="picker">{{ yhClue.name }}</view>
			</view>
			<view class="my-bq-mid1-info">
				<view class="title">档期:</view>
				<view class="picker">{{ yhClue.clueScheduleDate | parseShortDate }}</view>
			</view>
			<view class="my-bq-mid1-info">
				<view class="title">桌数:</view>
				<!-- <view class="des" v-cloak>{{ yhClue.clueTableCount + '桌备' + yhClue.bakTableCount }}</view> -->
				<view class="des" v-cloak>{{ msg }}</view>
			</view>
			<view class="my-bq-mid1-info">
				<view class="title">数据来源:</view>
				<view class="des">
					{{
						yhClue.clueSourceType == 1 ? '手动录入' : yhClue.clueSourceType == 2 ? '表单' : yhClue.clueSourceType == 3 ? '第三方平台' : ''
					}}
				</view>
			</view>
			<view class="my-bq-mid1-info">
				<view class="title">跟进人:</view>
				<view class="des">{{ yhClue.marketerName }}</view>
			</view>
			<view class="my-bq-mid1-info-remark">
				<view class="title">线索备注:</view>
				<view class="des">{{ yhClue.clueRemark }}</view>
			</view>
		</view>
		<view class="my-bq-bot">
			<view class="my-bq-bot-nav">
				<text class="title" :class="{ isSelect: isActiveH }" @tap="selHistory()">历史记录</text>
				<text class="title" :class="{ isSelect: isActiveT }" @tap="selTrack()">跟踪记录</text>
			</view>
			<view class="my-bq-bot-tab">
				<!-- 历史纪录 -->
				<view class="history-list" :class="{ isShow: isActiveH }">
					<view class="history-list-item" v-for="(item, index) in yhClueHistoryLogs" :key="index">
						<text class="red-icon"></text>
						<view class="item">
							<view class="item1">
								<text class="item-title" v-if="item.yhClueOperLog">{{ item.yhClueOperLog }}</text>
								<!-- <text class="item-info">2019.10.11 13：00</text> -->
							</view>
							<view class="item2">
								<text class="item-info" v-if="item.historyLogContent">{{ item.historyLogContent }}</text>
							</view>
							<!-- historyLogImgUrls  -->
							<view class="item3">
								<view class="item-info imgs" v-if="item.historyLogImgUrls">上传了图片</view>
								<view class="img" v-for="(img, imgIndex) in item.historyLogImgUrls" :key="imgIndex">
									<image mode="aspectFill" class="img" :src="img" @tap="previewImg(img)"></image>
								</view>
								<!-- <image class="img" src="/static/shuijiao.jpg" mode=""></image>
								<image class="img" src="/static/shuijiao.jpg" mode=""></image> -->
							</view>
						</view>
					</view>
					<!-- <view class="logoPic"><image :src="picDomain + '/upload/yytApp/banquet/logo.png'" class="bot-logo"></image></view> -->
				</view>
				<!-- 跟踪记录 -->
				<view class="track-list" :class="{ isShow: isActiveT }">
					<view class="track-list-item" v-for="(item, index) in followHistoryLogs" :key="index">
						<view class="red-icon float-left"></view>
						<text class="item-title float-left">{{ item.followPerson }}</text>
						<image class="img float-left" :src="picDomain + '/upload/yytApp/banquet/genjin.png'" mode=""></image>
						<text class="item-info float-left">{{ item.followType == 2 ? '电话' : '短信' }}</text>
						<text class=" float-left">{{ item.followDate }}</text>
					</view>
					<!-- <view style="height:200px"></view> -->
				</view>
			</view>
		</view>
		<view class="logoPic"><image src="https://pic.cwyyt.cn/upload/yyticons/0952195219_logo.png" class="bot-logo"></image></view>
		<!-- //确认提示框 -->
		<uni-popup ref="changCustomer" type="center" class="tip-popup" :custom="true">
		    <view class="wrapper">
		        <view class="popup-top">
		            <text>提示</text>
		            <image class="popup-top-img" :src="picDomain + '/upload/yytApp/banquet/quxiao.png'" mode="" @tap="qxChangCustomer()"></image>
		        </view>
		        <!-- popup中部 -->
		        <view class="popup-mid" style="flex-direction: column;">
		            <view class="uni-flex yyt-flex-center">
						<image class="popup-mid-img" :src="picDomain + '/upload/yytApp/banquet/info.png'" mode=""></image>
						<text>{{ changeMsg }}</text>
					</view>
		        </view>
		        <view class="popup-bot">
		            <view class="cancel" @tap="qxChangCustomer()">取消</view>
		            <view class="confirm" @tap="qdChangCustomer()">确定</view>
		        </view>
		    </view>
		</uni-popup>
		<!-- <uni-popup ref="changCustomer" type="center" class="isChangCustomer" :custom="true">
			<view class="wrapper">
				<view class="top-title">
					<text class="top-msg">提示</text>
					<image @tap="qxChangCustomer()" class="top-img" :src="picDomain + '/upload/yytApp/banquet/quxiao.png'" mode=""></image>
				</view>
				<view class="con">
					<image class="con-img" :src="picDomain + '/upload/yytApp/banquet/tishi.png'" mode=""></image>
					<text class="text">{{ changeMsg }}</text>
				</view>
				<view class="bot">
					<view class="btn qx" @tap="qxChangCustomer()">取消</view>
					<view class="btn qd" @tap="qdChangCustomer()">确定</view>
				</view>
			</view>
		</uni-popup> -->
		<!-- 底部按钮 -->
		<view class="bot-fiex" v-show="yhClue.clueStatus == 1">
			<view class="btn info" @tap="cancelBanquet()">取消线索</view>
			<view class="btn doing" @tap="banquetInfoFllow()">线索跟进</view>
			<view class="btn suc" @tap="sucBanquet()">成交</view>
		</view>
		<view class="bot-fiex" v-show="yhClue.clueStatus == 2 || yhClue.clueStatus == 3">
			<view class="suc jihuo" @tap="jihuoBanquet()">激活</view>
		</view>
	</view>
</template>

<script>
export { default } from './myBanquetInfo.js';
</script>

<style lang="less" scoped>
@import url('myBanquetInfo.less');
</style>
