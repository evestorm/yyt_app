<template>
	<view class="customer-info">
		<!-- 导航栏 -->
		<z-nav-bar class="z-nav-bar" :title="'客户详情'" bgColor="#0782ff" fontColor="#FFF">
			<sw-icon type="back" size="27" slot="left" @tap="onBack" color="#FFF"></sw-icon>
			<view class="right-selector" slot="right" @tap="gotoEditCustomerInfo" v-show="canEdit"><text class="tools-text">编辑</text></view>
		</z-nav-bar>
		<!-- 用户基本信息 -->
		<scroll-view scroll-y="true" class="scroll-view-wrapper">
		<view class="yyt-customer-card uni-flex">
			<!-- 主要内容区 -->
			<view class="customer-main-wrapper uni-flex uni-row">
				<!-- 头像 -->
				<view class="avatar-wrapper">
					<view class="cu-avatar xl round" :style="{ backgroundImage: getImgUrl(ctInfo.headImg) }"></view>
					<!-- <view class="cs-pool-wrapper" v-if="ctInfo.customerPoolMarketName">
						<image class="img" :src="picDomain + '/upload/yyticons/110019019_cs-icon.png'"></image>
						<text class="txt text-ellipsis-2">{{ ctInfo.customerPoolMarketName.slice(0, 10) }}</text>
					</view> -->
				</view>
				<!-- 资料 -->
				<view class="customer-info-wrapper uni-flex uni-column">
					<!-- 头像，尊称，等级，客服名称 -->
					<view class="customer-name-wrapper uni-flex uni-row">
						<view class="name" style="max-width: 50%;">{{ ctInfo.customerName }}</view>
						<view class="cs-name-wrapper" v-if="ctInfo.marketerName">
						<!-- <view class="cs-name-wrapper" v-if="ctInfo.customerPoolMarketName || ctInfo.marketerName"> -->
							<!-- block v-if="ctInfo.customerPoolMarketName">
								<image class="yyt-small-img" :src="picDomain + '/upload/yyticons/093105315_cspool.png'" mode=""></image>
								<text class="cs-name font-weight">{{ctInfo.customerPoolMarketName}}</text>
							</block> -->
							<!-- <block v-else> -->
							<text class="icon iconfont lines-blue" :class="ctInfo.isLockMarket?'icon-suoding1':'icon-weisuoding'" style="font-size: 24rpx;"></text>
								<!-- <image class="yyt-small-img" :src="picDomain + '/upload/yytApp/banquet/kefujingli.png'" mode=""></image> -->
								<text class="cs-name">{{ctInfo.marketerName}}</text>
							<!-- </block> -->
						</view>
						<picker class="picker-wrapper yyt-margin-left-bg" v-show="canEdit" :value="index" @change="updateFixedSales($event, ctInfo)" :range="sales" range-key="text">
						    <view class="picker">
								<!-- 这里更改后，如果有客户池经理，就客户经理和客户池经理都跟着变；只有客户经理，则只改客户 -->
						        <text v-if="ctInfo.customerPoolMarketName" class="change-cs-btn text-blue">{{ ctInfo.customerPoolMarketName ? '更换' : '添加' }}</text>
						        <text v-else class="change-cs-btn text-blue">{{ ctInfo.marketerName ? '更换' : '添加' }}</text>
							</view>
						</picker>
						<image @tap="gotoSendMsg" style="margin-left: auto; width: 35rpx;" class="yyt-normal-img" :src="picDomain + '/upload/yytApp/common/duanxin.png'" mode=""></image>
						<image @tap="gotoCallPhone(ctInfo.phone)" style="width: 35rpx;" class="yyt-normal-img margin-left" :src="picDomain + '/upload/yytApp/common/phone.png'" mode=""></image>
					</view>
					<!-- 电话，筛选 or 整理状态 -->
					<view class="phone-wrapper detail uni-flex uni-row">
						<view class="phone margin-right">{{ ctInfo.phone }}</view>
						<!-- 价值客户：（就是以前有客服池经理的客户） -->
						<image
							v-if="ctInfo.customerPoolMarketName"
							style="width: 140rpx; height: 30rpx; top: -3rpx"
							:src="picDomain + '/upload//20200819/1341164116_价值客户.png'"
						></image>
					</view>
					<!-- 标签 -->
					<view class="tags-wrapper title uni-flex uni-row text-grey text-sm">
						<text class="customer-tag-text">客户标签：</text>
						<image v-show="canEdit" @tap="openTagPage" class="yyt-normal-img" :src="picDomain + '/upload/yytApp/common/edit.png'" mode=""></image>
					</view>
						<!-- 详情页的标签可以折行，需要加 detail 类 -->
					<view class="tags-wrapper detail uni-flex uni-row" v-if="ctInfo.customerTags.length > 0">
						<view class="cu-tag radius yyt-grey-bg" v-for="(label, index) in ctInfo.customerTags" :key="index">{{ label.name }}</view>
					</view>
					<view v-if="ctInfo.customerTags.length <= 0" class="tags-wrapper uni-flex uni-row text-grey text-sm">暂无标签</view>
				</view>
			</view>
		</view>

		<view class="customer-detail-wrapper" ref="customerDetailRef">
			<!-- tab导航（样式在customInfo.less） -->
			<scroll-view scroll-x class="tab-info-wrapper bg-white nav text-center" ref="tabInfoWrapperRef">
				<view
					class="cu-item"
					:class="index == customerInfoSelected ? 'text-blue cur short yyt-font-weight' : ''"
					v-for="(item, index) in customerInfoArr"
					:key="index"
					@tap="customerInfoTabSelect(index)"
				>
					{{ item.name }}
				</view>
			</scroll-view>

			<!-- 基本信息 -->
			<view class="customer-basic" v-show="customerInfoSelected == 0">
				<view class="yyt-list">
					<view class="yyt-list-item">
						<view class="title">客户标记</view>
						<view class="content">
							<image v-for="(item, index) in markIcon" :key="index" class="yyt-normal-img margin-left" :src="item" mode=""></image>
						</view>
					</view>
					<view class="yyt-list-item">
						<view class="title">客户尊称</view>
						<view class="content">{{ ctInfo.msgName ? ctInfo.msgName : ctInfo.customerName }}</view>
					</view>
					<view class="yyt-list-item" v-show="canEdit">
						<view class="title">手机通讯录</view>
						<view class="content" v-if="customSaveName">{{ customSaveName }}</view>
						<view class="btn" v-else @tap="addToContacts">添加到通讯录</view>
					</view>
					<view class="yyt-list-item" @tap="gotoCallPhone(ctInfo.phone)">
						<view class="title">电话</view>
						<view class="content">{{ ctInfo.phone }}</view>
					</view>
					<view class="yyt-list-item">
					  <view class="title">生日</view>
					  <view class="content">{{ctInfo.birthday | parseShortDate}}</view>
					  <!-- <view class="arrow-wrapper"><sw-icon :size="20" class="uni-icon-wrapper" color="#bbb" type="arrowright" /></view> -->
					</view>
					<view class="yyt-list-item">
						<view class="title">性别</view>
						<view class="content">{{ctInfo.sex}}</view>
					</view>
					<view class="yyt-list-item">
						<view class="title">单位</view>
						<view v-show="ctInfo.companyName != 0" class="content">{{ctInfo.companyName}}</view>
						<view v-show="ctInfo.companyName == null" class="tip">暂无单位信息</view>
					</view>
					<view class="yyt-list-item" style="display:block;">
						<view class="title">备注</view>
						<view class="w-100 px-3 pt-1" style="min-height: 160rpx;">{{ctInfo.customerRemark||'暂无'}}</view>
					</view>
				</view>
				<view class="yyt-list">
					<view class="yyt-list-item">
						<view class="title">整理状态</view>
						<view class="content">
							<radio-group class="checkStatus-radio">
									<label @tap="changeStatus('1')">
											<radio value="1" :checked="ctInfo.isArrange=='1'" />
											<view>已整理</view>
									</label>
									<label @tap="changeStatus('0')">
											<radio value="0" :checked="ctInfo.isArrange=='0'" />
											<view>未整理</view>
									</label>
							</radio-group>
						</view>
					</view>
				</view>
			</view>
			<!-- 跟踪消费记录 -->
			<view v-show="customerInfoSelected == 1">
				<mescroll-uni ref="ScrollSalesRecord" :down="downOption" @down="downCallbackForSalesRecord" :up="upOption" @up="upCallbackForSalesRecord" :top="mescrollTop">
					<view
						v-for="(sr, index) in salesRecodeArr" :key="index"
						class="sales-record-item">
						<!-- 推荐、主动跟踪 -->
						<view class="tui-gen">
							<image :src="picDomain + '/upload/yytApp/images/tui.png'" class="tuiPic yyt-big-img" v-if="sr.isRecommendConversion && !sr.bookOrderID"></image>
							<image :src="picDomain + '/upload/yytApp/images/geng.png'" class="gengPic yyt-big-img" v-if="sr.isEffectiveFollow && !sr.bookOrderID"></image>
							<image :src="picDomain + '/upload//20200819/1321502150_zhuan.png'" class="gengPic yyt-big-img" v-if="sr.bookOrderID && sr.isEffectiveFollow == 1"></image>
						</view>
						<view class="left-wrapper">
							<view class="adressInfo">
								<view class="adress_area" v-show="sr.bookOrderID">
									<image class="dateWeekPic yyt-small-img yyt-margin-right-bg" :src="picDomain + '/upload/yytApp/banquet/order-data.png'"></image>
									<text class="date margin-right">{{ sr.time | parseShortDate }}</text>
									<text class="yyt-margin-left-small">{{ sr.time | parseShortWeek }}</text>
									<!-- 星期后面的门店显示，非本店的消费，名字特殊色 -->
									<block v-if="sr.branchName">
										<text class="yyt-margin-left-small" :class="{'font-weight': currentStoreId != sr.storeId}">{{ sr.branchName }}</text>
									</block>
								</view>
							</view>
							<view class="orderInfo">
								<image v-show="!sr.bookOrderID" class="dateWeekPic yyt-small-img yyt-margin-right-bg" :src="picDomain + '/upload/yytApp/banquet/order-data.png'"></image>
								<text class="dateTime margin-right" v-show="!sr.bookOrderID">
									{{ sr.time | parseShortDate }}
								</text>
								<text class="dateTime margin-right" v-show="!sr.bookOrderID">{{ sr.time | parseTime }}</text>
								<text class="dateTime yyt-margin-left-small" v-show="!sr.bookOrderID">
									{{ sr.time | parseShortWeek }}
								</text>
								<image v-show="sr.bookOrderID" class="dateWeekPic yyt-small-img yyt-margin-right-bg" :src="picDomain + '/upload/yytApp/customer/canyin.png'"></image>
								<text class="margin-right" v-show="sr.bookOrderID">{{ sr.diningTypeName }}</text>
								<text class="margin-right" v-show="sr.bookOrderID">{{ sr.bookOrderTypeName }}</text>
								<text class="margin-right" v-show="sr.bookOrderID">{{ sr.masterTableName }}</text>
								<text class="margin-right" v-show="sr.bookOrderID">{{ sr.bookTableNum }}桌</text>
								<text class="" v-show="sr.bookOrderID">￥{{ sr.fee | formatMoney }}</text>
							</view>
						</view>
						<!-- <view class="line"></view> -->
						<view class="right-wrapper">
							<view class="customerFocusCard_top_right_t">
								<text class="" v-if="!sr.bookOrderID">
									{{ sr.callType | parseCallType }}
									<!--显示消费状态-->
								</text>
								<text class="consume yyt-error" v-else>消费</text>
							</view>
							<view class="customerFocusCard_top_right_b">
								<image :src="picDomain + '/upload/yytApp/images/follow.png'" v-if="!sr.bookOrderID" class="yyt-small-img followPic"></image>
								<image :src="picDomain + '/upload/yytApp/images/kefu.png'" v-else class="yyt-small-img kefuPic"></image>
								<text class="yyt-margin-left-small">{{ sr.marketerName }}</text>
							</view>
						</view>
					</view>
				</mescroll-uni>
			</view>
			<!-- 消费统计 -->
			<view v-show="customerInfoSelected == 2">
				<!-- 汇总数据 -->
				<view class="all-data bg-white p-3 mt-1">
					<view class="all-data-title font-weight font-30 pb-2">总消费统计</view>
					<view class="all-data-info d-flex flex-wrap">
						<view class="list list-left">
							<view class="item">
								<text class="font-28">总消费</text>
								<text class="font-22">(次)：</text>
								<text class="font-28 num">{{ summaryStat.totalFeeCount }}</text>
							</view>
						</view>
						<view class="list list-right">
							<view class="item">
								<text class="font-28">总消费</text>
								<text class="font-22">(￥)：</text>
								<text class="font-28 num">
									{{ summaryStat.totalFeeAmount | formatMoney }}
								</text>
							</view>
						</view>
						<view class="list list-left">
							<view class="item">
								<text class="font-28">桌均</text>
								<text class="font-22">(￥)：</text>
								<text class="font-28 num">
									{{ summaryStat.tableAvgFeeAmount | formatMoney }}
								</text>
							</view>
						</view>
						<view class="list list-right">
							<view class="item">
								<text class="font-28">频次</text>
								<text class="font-22">(次)：</text>
								<text class="font-28 num">{{ summaryStat.feeFrequency }}</text>
								<text class="font-22">(平均每月)</text>
							</view>
						</view>
					</view>
				</view>
				<view class="yyt-customerInfo-chart">
					<view class="chart-headLine">
						近三月统计图
					</view>
					<view class="chart-content">
						<view class="chart-top">
							<view class="fatherTab tabArea" >
								<view class=" tabItem-left" v-bind:class="yType == 1 ? 'tabItem-active' : ''" v-on:tap="changeType(1, 0)">星期</view>
								<view class="tabItem-right " v-bind:class="yType == 2 ? 'tabItem-active' : ''" v-on:tap="changeType(2, 0)">餐别</view>
							</view>
						</view>
						<view class="chart-main">
							<div ref="coustomChart" class="chart-svg"></div>
						</view>
						<view class="chart-bottom">
							<view class="childTab tabArea">
								<view class=" tabItem-left" v-bind:class="xType == 1 ? 'tabItem-active' : ''" v-on:tap="changeType(1, 1)">次数</view>
								<view v-bind:class="xType == 2 ? 'tabItem-active' : ''" v-on:tap="changeType(2, 1)">金额</view>
								<view class="tabItem-right " v-bind:class="xType == 3 ? 'tabItem-active' : ''" v-on:tap="changeType(3, 1)">桌均</view>
							</view>
						</view>
					</view>
				</view>
			</view>
			<!-- 月统计 -->
			<!-- 2020.10.14 去除这里月统计权限控制：getSalesAuthority.isMonthlyStatistics -->
			<view v-show="customerInfoSelected == 3">
				<mescroll-uni ref="ScrollRankSummaryInfo" :down="downOption" @down="downCallbackForRankSummaryInfo" :up="upOption" @up="upCallbackForRankSummaryInfo" :top="mescrollTop">
					<view class="list-view-wrapper">
						<view class="rank-summary-info-item"
							v-for="(rs, index) in rankSummaryArr" :key="index">
							<view class="left-wrapper">
								<view class="consumeItem d-flex align-center flex-wrap">
									<text class="title">月消费<text class="text-grey text-sm">(￥)：</text></text>
									<text class="desc">{{ rs.monthFeeAmount | formatMoney }}</text>

									<text class="title" style="margin-left: 60rpx;">客户等级</text>
									<image class="yyt-normal-img margin-left" :src="rs.customerLevelImgUrl" mode=""></image>
								</view>
								<view class="consumeItem">
									<text class="title">人均消费<text class="text-grey text-sm">(￥)：</text></text>
									<text class="desc">{{ rs.monthAvgFeeAmount | formatMoney }}</text>
								</view>
								<view class="consumeItem bottom uni-flex uni-row">
									<view class="consumeItem">
										<text class="title">桌均<text class="text-grey text-sm">(￥)：</text></text>
										<text class="desc">{{ rs.monthTableFeeAmount | formatMoney }}</text>
									</view>
									<view class="consumeItem">
										<text class="title">桌数：</text>
										<text class="desc">{{ rs.monthTableNum }}</text>
									</view>
									<view class="consumeItem  margin-right">
										<text class="title">次数：</text>
										<text class="desc">{{ rs.monthConsumeNum }}</text>
									</view>
								</view>
							</view>
							<view class="right-wrapper">
								<view class="customerFocusCard_top_right_t">
									<text>{{ rs.year + '.' + rs.month }}</text>
								</view>
								<view v-if="rs.customerPoolMarketName" class="customerFocusCard_top_right_b">
									<image class="img yyt-small-img" :src="picDomain + '/upload/yytApp/images/salesIconPersonal.png'"></image>
									<text class="yyt-margin-left-small">{{ rs.customerPoolMarketName }}</text>
								</view>
							</view>
						</view>
					</view>
				</mescroll-uni>
			</view>
		</view>
		</scroll-view>
		<uni-popup ref="cancelAddToContactsPopup" type="center" class="tip-popup" :custom="true">
		    <view class="wrapper">
		        <view class="popup-top">
		            <text>提示</text>
		            <image class="popup-top-img" :src="picDomain + '/upload/yytApp/banquet/quxiao.png'" mode="" @tap="cancelAddToContacts()"></image>
		        </view>
		        <!-- popup中部 -->
		        <view class="popup-mid" style="flex-direction: column;">
		            <view class="uni-flex yyt-flex-center">
						<image class="popup-mid-img" :src="picDomain + '/upload/yytApp/banquet/info.png'" mode=""></image>
						<text>确定将此客户添加到手机通讯录吗？</text>
					</view>
					<view style="display: flex;
						justify-content: flex-start;
						flex-direction: column;
						align-items: flex-start;
						width: 60%;">
						<view>姓名：{{ctInfo.customerName}}</view>
						<view>电话：{{ctInfo.phone}}</view>
					</view>
		        </view>
		        <view class="popup-bot">
		            <view class="cancel" @tap="cancelAddToContacts()">取消</view>
		            <view class="confirm" @tap="confirmAddToContacts()">确定</view>
		        </view>
		    </view>
		</uni-popup>
	</view>
</template>

<script>
export { default } from './customInfo.js';
</script>

<style lang="less" scoped>
@import './customInfo.less';
</style>
