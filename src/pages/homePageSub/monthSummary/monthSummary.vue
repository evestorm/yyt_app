<template>
	<view>
		<z-nav-bar title="月统计" bgColor="#0782ff" fontColor="#FFF">
			<sw-icon type="back" size="27" slot="left" @tap="onBack" color="#FFF"></sw-icon>
		</z-nav-bar>
		<!-- 顶部时间切换 -->
		<view class="monthtime">
			<view class="monthtime-month">
				<view class="monthtime-month-left" @tap="goleft"><image :src="picDomain + '/upload/yytApp/images/date-zuo.png'"></image></view>
				<picker mode="date" fields="month" class="flex1" :value="month" @change="chooseDate">
					<view class="monthtime-month-text">
						<image :src="picDomain + '/upload/yytApp/images/date-mounth.png'" style="margin-right: 16rpx;"></image>
						<text>{{ month }}</text>
					</view>
				</picker>
				<view class="monthtime-month-right" @tap="goright"><image :src="picDomain + '/upload/yytApp/images/date-you.png'"></image></view>
			</view>
		</view>
		<!-- 正文 -->
		<view class="monthSummary-content">
			<view class="content-list">
				<!-- 左右两边高度相同 -->
				<scroll-view scroll-y style="height:calc(100vh - 109px);width:20%" @scrolltolower="getLeftList">
					<view
						class="market-info"
						:class="{ sel: curSelected == index }"
						v-for="(item, index) in allList"
						:key="index"
						@tap="changePeople(index)"
					>
						<image class="market-img" :src="item.imgUrl_ImgServer || 'https://pic.cwyyt.cn/upload/yytApp/images/salesperson.png'" mode=""></image>
						<view class="market-name">{{ item.marketerName }}</view>
					</view>
				</scroll-view>
				<scroll-view scroll-y class="monthSummary-content-right scroll-view-wrapper" style="height:calc(100vh - 109px)" ref="rightDiv">
				<!-- <view class="monthSummary-content-right" style="height:calc(100vh - 109px)" ref="rightDiv"> -->
					<view class="content-list" v-show="curSelected==0">
						<view class="title">全&nbsp;&nbsp;&nbsp;&nbsp;店</view>
						<view class="info-flex">
							<view class="list-item0">
								<text class="rmb">￥</text>
								<text class="count">{{ curPageInfo.pageInfo.allStoreFeeAmount | formatMoney }}</text>
								<text class="unit">元</text>
							</view>
						</view>
					</view>
					<view class="content-list" @tap="goCommonList('customerOrder')">
						<view class="title">客&nbsp;&nbsp;&nbsp;&nbsp;户</view>
						<view class="info-flex">
							<view class="list-item0">
								<text class="rmb">￥</text>
								<text class="count">{{ curPageInfo.pageInfo.customFeeSum | formatMoney }}</text>
								<text class="unit">元</text>
							</view>
							<view class="list-item">
								<text class="count">{{ curPageInfo.pageInfo.customFeeTableNumSum }}</text>
								<text class="unit">桌</text>
							</view>
						</view>
						<sw-icon :size="18" class="uni-icon-wrapper" :class="canSeeAllDetail?'':'d-none'" color="#bbb" type="arrowright" />
					</view>
					<view class="content-list" @tap="goCommonList('banquetOrder')">
						<view class="title">宴&nbsp;&nbsp;&nbsp;&nbsp;会</view>
						<view class="info-flex">
							<view class="list-item0">
								<text class="rmb">￥</text>
								<text class="count">{{ curPageInfo.pageInfo.banquetFeeSum | formatMoney }}</text>
								<text class="unit">元</text>
							</view>
							<view class="list-item">
								<text class="count">{{ curPageInfo.pageInfo.banquetBookTableNumSUM }}</text>
								<text class="unit">桌</text>
							</view>
						</view>
						<sw-icon :size="18" class="uni-icon-wrapper" :class="canSeeAllDetail?'':'d-none'" color="#bbb" type="arrowright" />
					</view>
					<!-- 散客和住宿暂时不用 -->
					<!-- 全店下：显示散客；其他客服经理，不显示散客 -->
					<view class="content-list" v-show="(curPageInfo.pageInfo.casualAmount!=0||curPageInfo.pageInfo.casualTables!=0) && allList[curSelected].marketerId == 'store'" @tap="goCommonList('individualOrders')">
						<view class="title">散&nbsp;&nbsp;&nbsp;&nbsp;客</view>
						<view class="info-flex">
							<view class="list-item0">
								<text class="rmb">￥</text>
								<text class="count">{{ curPageInfo.pageInfo.casualAmount | formatMoney }}</text>
								<text class="unit">元</text>
							</view>
							<view class="list-item">
								<text class="count">{{ curPageInfo.pageInfo.casualTables||0 }}</text>
								<text class="unit">桌</text>
							</view>
						</view>
						<!-- <sw-icon :size="18" class="uni-icon-wrapper" :class="canSeeAllDetail?'':'d-none'" color="#bbb" type="arrowright" /> -->
					</view>
					<view class="content-list" v-show="curPageInfo.pageInfo.roomAmount!=0||curPageInfo.pageInfo.roomTables!=0" @tap="goCommonList('accommodationOrder')">
						<view class="title">住&nbsp;&nbsp;&nbsp;&nbsp;宿</view>
						<view class="info-flex">
							<view class="list-item0">
								<text class="rmb">￥</text>
								<text class="count">{{ curPageInfo.pageInfo.roomAmount | formatMoney }}</text>
								<text class="unit">元</text>
							</view>
							<view class="list-item">
								<text class="count">{{ curPageInfo.pageInfo.roomTables||0 }}</text>
								<text class="unit">间</text>
							</view>
						</view>
						<sw-icon :size="18" class="uni-icon-wrapper" :class="canSeeAllDetail?'':'d-none'" color="#bbb" type="arrowright" />
					</view>
					<view class="content-list" v-show="curSelected==0">
						<view class="title">其&nbsp;&nbsp;&nbsp;&nbsp;他</view>
						<view class="info-flex">
							<view class="list-item0">
								<text class="rmb">￥</text>
								<text class="count">{{ curPageInfo.pageInfo.otherFeeAmount | formatMoney }}</text>
								<text class="unit">元</text>
							</view>
						</view>
					</view>
					<view class="content-list">
						<view class="title"  style="margin-top: 0rpx; line-height: 40rpx;">
							客&nbsp;&nbsp;&nbsp;&nbsp;户
							情&nbsp;&nbsp;&nbsp;&nbsp;况
						</view>
						<view class="info-flex">
							<!-- <view class="list-item1" @tap="goCommonList('customerPool','')">
								<text class="count" :class="canSeeAllDetail?'click':''">{{ curPageInfo.pageInfo.customerTotalCount }}</text>
								<text class="people">人</text>
							</view> -->
							<view class="list-item2" style="width: 100%;">
								<view class="first-item" @tap="goCommonList('customerPool','')">
									<view class="state">
										价值客户
									</view>
									<view class="state-num" :class="canSeeAllDetail?'click':''"><span>{{ curPageInfo.pageInfo.customerTotalCount }}</span></view>
								</view>
								<view class="first-item" @tap="goCommonList('customerPool','A')">
									<view class="state">A级</view>
									<view class="state-num" :class="canSeeAllDetail?'click':''"><span>{{ curPageInfo.pageInfo.aCustomerCount }}</span></view>
								</view>
								<view @tap="goCommonList('customerPool','B')">
									<view class="state">B级</view>
									<view class="state-num" :class="canSeeAllDetail?'click':''"><span>{{ curPageInfo.pageInfo.bCustomerCount }}</span></view>
								</view>
								<view @tap="goCommonList('customerPool','C')">
									<view class="state">C级</view>
									<view class="state-num" :class="canSeeAllDetail?'click':''"><span>{{ curPageInfo.pageInfo.cCustomerCount }}</span></view>
								</view>
							</view>
						</view>
					</view>
					<view class="content-list">
						<view class="title">复购率</view>
						<view class="info-flex flex-column yyt-margin-left-bg font-22">
							<view class="d-flex w-100 j-sb align-center">
								<view class="item w-100 text-center font-22">
									<view class="font-22">全部客户</view>
									<view class="rate-num font-22">
										<text class="text-blue font-weight">{{ curPageInfo.pageInfo.repurchaseRate || 0 | percent(1) }}</text>
										<text class="text-blue font-weight">({{curPageInfo.pageInfo.currMonthBookCstCount || 0}}/{{curPageInfo.pageInfo.lastMonthBookCstCount || 0}})</text>
									</view>
								</view>
								<view class="item w-100 text-center">
									<view class="font-22">价值客户</view>
									<view class="rate-num font-22">
										<text class="text-blue font-weight">{{curPageInfo.pageInfo.vipRepurchaseRate || 0 | percent(1)}}</text>
										<text class="text-blue font-weight">({{curPageInfo.pageInfo.currMonthBookCstPoolCount || 0}}/{{curPageInfo.pageInfo.lastMonthBookCstPoolCount || 0}})</text>
									</view>
								</view>
							</view>
							<view class="d-flex w-100 j-sb align-center mt-4">
								<view class="item text-center font-22">
									<text class="line-h font-22">A级客户</text>
									<text class="rate-num d-block text-blue font-weight font-22">{{curPageInfo.pageInfo.aRepurchaseRate || 0 | percent(1)}}</text>
									<text class="rate-num d-block text-blue font-weight font-22">({{curPageInfo.pageInfo.currMonthBookACstCount || 0}}/{{curPageInfo.pageInfo.lastMonthBookACstCount || 0}})</text>
								</view>
								<view class="item text-center">
									<text class="line-h font-22">B级客户</text>
									<text class="rate-num d-block text-blue font-weight font-22">{{curPageInfo.pageInfo.bRepurchaseRate || 0 | percent(1)}}</text>
									<text class="rate-num d-block text-blue font-weight font-22">({{curPageInfo.pageInfo.currMonthBookBCstCount || 0}}/{{curPageInfo.pageInfo.lastMonthBookBCstCount || 0}})</text>
								</view>
								<view class="item text-center">
									<text class="line-h font-22">C级客户</text>
									<text class="rate-num d-block text-blue font-weight font-22">{{curPageInfo.pageInfo.cRepurchaseRate || 0 | percent(1)}}</text>
									<text class="rate-num d-block text-blue font-weight font-22">({{curPageInfo.pageInfo.currMonthBookCCstCount || 0}}/{{curPageInfo.pageInfo.lastMonthBookCCstCount || 0}})</text>
								</view>
							</view>
						</view>
					</view>
					<view class="content-list">
						<view class="title">跟&nbsp;&nbsp;&nbsp;&nbsp;踪</view>
						<view class="info-flex yyt-margin-left-bg">
							<view class="list-item1" @tap="goCommonList('customerTracking','')">
								<text class="count" :class="canSeeAllDetail?'click':''">{{ curPageInfo.pageInfo.trackTotalCount }}</text>
								<text class="people">人</text>
							</view>
							<view class="list-item2">
								<view class="first-item" @tap="goCommonList('customerTracking','5')">
									<view class="state">微信</view>
									<view class="state-num" :class="canSeeAllDetail?'click':''"><span>{{ curPageInfo.pageInfo.weChatCount }}</span></view>
								</view>
								<view @tap="goCommonList('customerTracking','2')">
									<view class="state">电话</view>
									<view class="state-num" :class="canSeeAllDetail?'click':''"><span>{{ curPageInfo.pageInfo.callOutCount }}</span></view>
								</view>
								<view @tap="goCommonList('customerTracking','3')">
									<view class="state">短信</view>
									<view class="state-num" :class="canSeeAllDetail?'click':''"><span>{{ curPageInfo.pageInfo.messageCount }}</span></view>
								</view>
							</view>
						</view>
					</view>
					<view class="content-list">
						<view class="change d-flex flex-column align-start" @tap="goCommonList('transformOrder')">
							<view class="title text-left" style="margin-top: 0rpx; line-height: 40rpx;">
								全&nbsp;&nbsp;&nbsp;&nbsp;部
								转&nbsp;&nbsp;&nbsp;&nbsp;化
							</view>
							<view class="title text-left" style="margin-top: 20rpx; line-height: 40rpx;">
								推&nbsp;&nbsp;&nbsp;&nbsp;荐
								转&nbsp;&nbsp;&nbsp;&nbsp;化
							</view>
							<!-- <view class="">
								<text class="count click">{{ curPageInfo.pageInfo.efficiency | paseFloor }}</text>
								<text class="people">%</text>
							</view> -->
						</view>
						<view class="change-right">
							<!-- <view class=""> -->
								<view class="list-item-change" @tap="goCommonList('activeTransformation')">
									<view>
										<!-- <view class="state">主动</view> -->
										<view class="state-num" style="margin-top: 0;">
											<text class="font-weight" :class="canSeeAllDetail?'click':''" style="font-size: 30rpx;">{{ curPageInfo.pageInfo.efficiency | percent(1, '') }}</text>
											<text class="state text-black">%</text>
										</view>
										<view class="state-num">
											<text :class="canSeeAllDetail?'click':''">{{ curPageInfo.pageInfo.activeToShopCount }}</text>
											<text class="state">/{{ curPageInfo.pageInfo.activeTrackCount }}</text>
										</view>
									</view>
									<view>
										<view class="state">金额</view>
										<view class="state-num" :class="canSeeAllDetail?'click':''"><span>{{ curPageInfo.pageInfo.activeTrackAmount | formatMoney  }}</span></view>
									</view>
									<view>
										<view class="state">桌数</view>
										<view class="state-num" :class="canSeeAllDetail?'click':''"><span>{{ curPageInfo.pageInfo.activeTrackTableNum}}</span></view>
									</view>
								</view>
								<view class="list-item-change" @tap="goCommonList('recommendedTransformation')">
									<view>
										<!-- <view class="state">推荐</view> -->
										<!-- TODO:数据 -->
										<view class="state-num" style="margin-top: 0;">
											<text class="font-weight" :class="canSeeAllDetail?'click':''" style="font-size: 30rpx;">{{ curPageInfo.pageInfo.recommendEfficiency | percent(1, '') }}</text>
											<text class="state text-black">%</text>
										</view>
										<view class="state-num">
											<text :class="canSeeAllDetail?'click':''">{{ curPageInfo.pageInfo.recommendToShopCount }}</text>
											<text class="state">/{{ curPageInfo.pageInfo.recommendTrackCount }}</text>
										</view>
									</view>
									<view class="section">
										<view class="state">金额</view>
										<view class="state-num" :class="canSeeAllDetail?'click':''"><span>{{ curPageInfo.pageInfo.recommendTrackAmount | formatMoney  }}</span></view>
									</view>
									<view class="section">
										<view class="state">桌数</view>
										<view class="state-num" :class="canSeeAllDetail?'click':''"><span>{{ curPageInfo.pageInfo.recommendTrackTableNum }}</span></view>
									</view>
								</view>
						</view>
					</view>
					<view class="content-list" @tap="goESearchComment()">
						<view class="title">评&nbsp;&nbsp;&nbsp;&nbsp;价</view>
						<view class="info">
							<sx-rate :value="curPageInfo.pageInfo.issueScore || 0" :default-color="'#f2f2f2'" :active-color="'#FC4732'" disabled></sx-rate>
							<view class="">
								<text class="num">{{ curPageInfo.pageInfo.issueNumCount }}</text>
								<text class="num-text">人参与评价</text>
							</view>
						</view>
						<sw-icon :size="18" class="uni-icon-wrapper" :class="canSeeAllDetail?'':'d-none'" color="#bbb" type="arrowright" />
					</view>
				</scroll-view>
			</view>
		</view>
	</view>
</template>

<script>
export { default } from './monthSummary.js';
</script>

<style lang="less" scoped>
@import url('monthSummary.less');
</style>
