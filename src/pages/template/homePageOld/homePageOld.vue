<template>
	<view class="home">
		<!-- 导航栏 -->
		<z-nav-bar class="z-nav-bar" :title="'首页'" :back="false" bgColor="#0782ff" fontColor="#FFF">
			<!-- 查看报表按钮 -->
			<view class="left-selector" v-show="homePageAuth.isMonthlyStatistics==1||homePageAuth.isShowTrackTop==1" slot="left" @tap="showReport">
				<image class="tools-icon" :src="picDomain + '/upload/yytApp/images/report.png'"></image></view>
			<!-- <view class="left-selector" slot="left" @tap="showReport"><image class="tools-icon" :src="picDomain + '/upload/yytApp/images/report.png'"></image></view> -->
			<!-- 切换门店按钮 -->
			<view class="right-selector" slot="right" @tap="showMore">
				<text class="tools-text">{{ userInfo.currentStoreName.slice(0, 10) }}</text>
				<image class="tools-icon" :src="picDomain + '/upload/yytApp/home/store-select.png'"></image>
			</view>
		</z-nav-bar>

		<!-- 左上角门店弹窗 -->
		<uni-popup class="nav-popup" bubble='left' ref="reportPopup" type="position" posi="top: 50px; right: 0; display: flex; justify-content: flex-start;" :custom="true" :mask-click="true">
			<view class="wrapper" style="margin-left: 20rpx;">
				<view class="item" @tap="goYueTongJi" v-show="homePageAuth.isMonthlyStatistics==1">
				<!-- <view class="item" @tap="goYueTongJi"> -->
					<image class="img" :src="picDomain + '/upload/yytApp/images/monthly-statistics.png'"></image>
					<view class="title">月统计</view>
				</view>
				<view class="item" @tap="goGenZongPaiHang" v-show="homePageAuth.isShowTrackTop==1" >
				<!-- <view class="item" @tap="goGenZongPaiHang"> -->
					<image class="img" :src="picDomain + '/upload/yytApp/images/track-list.png'"></image>
					<view class="title">跟踪排行</view>
				</view>
			</view>
		</uni-popup>
		<!-- 右上角门店弹窗 -->
		<uni-popup class="nav-popup" bubble='right' ref="morePopup" type="position" posi="top: 50px; right: 0; display: flex; justify-content: flex-end;" :custom="true" :mask-click="true">
			<view class="wrapper" style="margin-right: 20rpx;">
				<view v-for="(store, index) in storeData" :key="index" class="item" @tap="chgStore(store)">
					<!-- <image class="img" :src="picDomain + '/upload/yytApp/customer/add-customer.png'"></image> -->
					<view class="title" :class="{ active: store.storeId == userInfo.currentStoreId }">{{ store.branchName }}</view>
				</view>
			</view>
		</uni-popup>
		<!-- 搜索栏 -->
		<view class="search-wrapper" ref="searchRef" @tap="gotoSearch()">
			<view class="search-bar">
				<sw-icon type="search" size="13"></sw-icon>
				<view class="placeholder">搜索客户</view>
			</view>
		</view>
		<mescroll-uni ref="mescrollRef" @init="mescrollInit" :up="upOption" :down="downOption" @down="downCallback" :top="searchBottomY" @scroll="onScroll">
		<!-- 快速导航 -->
		<view class="menu-wrapper" ref="menuRef">
			<view class="item" v-for="(item, index) in menuList" :key="item.code" @tap="goNaviPage(item)">
				<view class="inner">
					<view class="badge d-flex justify-center align-center" v-if="item.operationParamJson && JSON.parse(item.operationParamJson).notCompleteCount > 0">{{ item.operationParamJson && JSON.parse(item.operationParamJson).notCompleteCount }}</view>
					<image class="img" :src="item.icon"></image>
					<text class="title">{{ item.name }}</text>
				</view>
			</view>
		</view>
		<!-- 运营概况 -->
		<view class="main">
			<view class="main-title" ref="operationRef" data-id="operationRef">
				<text class="left">运营概况</text>
				<view class="right">
					<!-- <view class="tag-view main-tag">
						<uni-tag text="我的" :type="dataType == '个人' ? 'primary' : ''" @tap="changeDataType('个人')" />
					</view>
					<view class="tag-view main-tag">
						<uni-tag text="全店" :type="dataType == '全部' ? 'primary' : ''" @tap="changeDataType('全部')" />
					</view> -->
					<view class='cu-tag round'
						:class="[ dataType == '个人' ? 'bg-blue' : 'line-blue' ]"
						@tap="changeDataType('个人')">我的</view>
					<view class='cu-tag round'
						:class="[ dataType == '全部' ? 'bg-blue' : 'line-blue' ]"
						@tap="changeDataType('全部')">全店</view>
				</view>
			</view>
			<!-- ================== 客户 =================== -->
			<view class="overview-com"
				:style="{ order: this.operateList.findIndex(v => v.name == '客户') }"
				v-if="targetOperation('客户', 'isOpen') == '1'"
				@tap="gotoCustomer()"
				>
			<!-- <view class="overview-com"
				:style="{ order: this.operateList.findIndex(v => v.name == '客户') }"
				v-if="targetOperation('客户', 'isOpen') == '1'"
				> -->
				<view id="overview-title">
					<view class="overview-subTitle">
						<view class="overview-stripe"></view>
						<view>客户</view>
					</view>
					<swIcon type="arrowright" size="25" color="#D9D9D9"></swIcon>
				</view>
				<view class="custom-overview" v-show="dataType == '个人'">
					<view class="custom-com">
						<view>我的客户</view>
						<view>{{ operate.customerData.cstMyCount }}</view>
					</view>
					<view class="custom-com">
						<view>上月客户活跃率(%)</view>
						<view>{{ operate.customerData.cstMyLastMonthAcitvePercent }}</view>
					</view>
					<view class="custom-com">
						<view>我的价值客户池</view>
						<view>{{ operate.customerData.cstPoolMyCount }}</view>
					</view>
					<view class="custom-com">
						<view>上月客户池活跃率(%)</view>
						<view>{{ operate.customerData.cstPoolMyLastMonthAcitvePercent }}</view>
					</view>
				</view>
				<view class="custom-overview" v-show="dataType == '全部'">
					<view class="custom-com">
						<view>总客户</view>
						<view>{{ operateAll.customerData.cstTotalCount }}</view>
					</view>
					<view class="custom-com">
						<view>上月客户活跃率(%)</view>
						<view>{{ operateAll.customerData.cstTotalLastMonthAcitvePercent }}</view>
					</view>
					<view class="custom-com">
						<view>客户池总客户</view>
						<view>{{ operateAll.customerData.cstPoolTotalCount }}</view>
					</view>
					<view class="custom-com">
						<view>上月客户池活动率(%)</view>
						<view>{{ operateAll.customerData.cstPoolTotalLastMonthAcitvePercent }}</view>
					</view>
				</view>
			</view>

			<!-- =================== 客户跟踪 ==================== -->
			<view class="overview-com"
				:style="{ order: this.operateList.findIndex(v => v.name == '客户跟踪') }"
				v-if="targetOperation('客户跟踪', 'isOpen') == '1'"
				>
			<!-- <view class="overview-com"
				:style="{ order: this.operateList.findIndex(v => v.name == '客户跟踪') }"
				v-if="targetOperation('客户跟踪', 'isOpen') == '1'"
				> -->
				<view id="overview-title" @tap="getoCustomerFollow('待跟')">
					<view class="overview-subTitle">
						<view class="overview-stripe"></view>
						<view>客户跟踪</view>
					</view>
					<view>
						<view class="info-wrapper" v-show="dataType == '个人' && operate.customerFollowData.needFollowCount > 0">
							<view class="overview-dot"></view>
							<view class="yyt-error">{{ operate.customerFollowData.needFollowCount }}</view>
							<view>条跟踪待处理</view>
						</view>
						<view class="info-wrapper" v-show="dataType == '全部' && operateAll.customerFollowData.allNeedFollowCount > 0">
							<view class="overview-dot"></view>
							<view class="yyt-error">{{ operateAll.customerFollowData.allNeedFollowCount }}</view>
							<view>条跟踪待处理</view>
						</view>
						<swIcon type="arrowright" size="25" color="#D9D9D9"></swIcon>
					</view>
				</view>
				<view class="custom-overview" v-show="dataType == '个人'">
					<view class="custom-com custom-com-short"  @tap="getoCustomerFollow('待跟')">
						<view class="yyt-error">待处理</view>
						<view>{{ operate.customerFollowData.needFollowCount }}</view>
					</view>
					<view class="custom-com custom-com-short"  @tap="getoCustomerFollow('已跟')">
						<view class="yyt-orange">已处理</view>
						<view>{{ operate.customerFollowData.followedCount }}</view>
					</view>
					<view class="custom-com custom-com-short" @tap="getoCustomerFollow('')">
						<view>总跟踪</view>
						<view>{{ operate.customerFollowData.totalFollowCount }}</view>
					</view>
				</view>
				<view class="custom-overview" v-show="dataType == '全部'">
					<view class="custom-com custom-com-short" @tap="getoCustomerFollow('待跟')">
						<view class="yyt-warning">待处理</view>
						<view>{{ operateAll.customerFollowData.allNeedFollowCount }}</view>
					</view>
					<view class="custom-com custom-com-short" @tap="getoCustomerFollow('已跟')">
						<view class="yyt-orange">已处理</view>
						<view>{{ operateAll.customerFollowData.allFollowedCount }}</view>
					</view>
					<view class="custom-com custom-com-short" @tap="getoCustomerFollow('')">
						<view>总跟踪</view>
						<view>{{ operateAll.customerFollowData.allTotalFollowCount }}</view>
					</view>
				</view>
			</view>

			<!-- ================== 预订 ================== -->
			
			<view class="overview-com"
				:style="{ order: this.operateList.findIndex(v => v.name == '预订') }"
				v-if="targetOperation('预订', 'isOpen') == '1'"
				>
			<!-- <view class="overview-com"
				:style="{ order: this.operateList.findIndex(v => v.name == '预订') }"
				v-if="targetOperation('预订', 'isOpen') == '1'"
				> -->
				<view id="overview-title">
					<view class="overview-subTitle">
						<view class="overview-stripe"></view>
						<view>预订</view>
					</view>
					<view>
						<!-- <view class="tag-view book-tag">
							<uni-tag text="昨日" :type="bookSelectType == '昨日' ? 'primary' : ''" @tap="tabBook('昨日')" />
						</view>
						<view class="tag-view book-tag">
							<uni-tag text="今日" @tap="tabBook('今日')" :type="bookSelectType == '今日' ? 'primary' : ''" />
						</view>
						<view class="tag-view book-tag">
							<uni-tag text="一个月内" @tap="tabBook('一个月内')" :type="bookSelectType == '一个月内' ? 'primary' : ''" />
						</view> -->
						<view class='cu-tag round'
							:class="[ bookSelectType == '昨日' ? 'bg-blue' : 'line-blue' ]"
							@tap="tabBook('昨日')">昨日</view>
						<view class='cu-tag round'
							:class="[ bookSelectType == '今日' ? 'bg-blue' : 'line-blue' ]"
							@tap="tabBook('今日')">今日</view>
						<view class='cu-tag round'
							:class="[ bookSelectType == '一个月内' ? 'bg-blue' : 'line-blue' ]"
							@tap="tabBook('一个月内')">一个月内</view>
					</view>
					<view>
						<!-- <navigator url="/pages/reserve/reserve" open-type="switchTab"> -->
						<view @tap="gotoReserve">
							<swIcon type="arrowright" size="25" color="#D9D9D9"></swIcon>
						</view>
						<!-- </navigator> -->
					</view>
				</view>

				<!-- ============== 个人 ==================== -->
				<view class="custom-overview" v-show="bookSelectType == '昨日' && dataType == '个人'" @tap="gotoReserve">
					<view class="custom-com">
						<view>客户桌数</view>
						<view>{{ operate.bookData.yesterdayCstTableCount }}</view>
					</view>
					<view class="custom-com">
						<view>宴会桌数</view>
						<view>{{ operate.bookData.yesterdayBanquetTableCount }}</view>
					</view>

					<view class="custom-com">
						<view>金额(￥)</view>
						<view>{{ operate.bookData.yesterdayCstAmount | formatMoney }}</view>
					</view>
					<view class="custom-com">
						<view>金额(￥)</view>
						<view>{{ operate.bookData.yesterdayBanquetAmount | formatMoney }}</view>
					</view>
				</view>

				<view class="custom-overview" v-show="bookSelectType == '今日' && dataType == '个人'"  @tap="gotoReserve">
					<view class="custom-com">
						<view>客户桌数</view>
						<view>{{ operate.bookData.todayCstTableCount }}</view>
					</view>
					<view class="custom-com">
						<view>宴会桌数</view>
						<view>{{ operate.bookData.todayBanquetTableCount }}</view>
					</view>

					<view class="custom-com">
						<view>金额(￥)</view>
						<view>{{ operate.bookData.todayCstAmount | formatMoney }}</view>
					</view>
					<view class="custom-com">
						<view>金额(￥)</view>
						<view>{{ operate.bookData.todayBanquetAmount | formatMoney }}</view>
					</view>
				</view>

				<view class="custom-overview" v-show="bookSelectType == '一个月内' && dataType == '个人'"  @tap="gotoReserve">
					<view class="custom-com">
						<view>客户桌数</view>
						<view>{{ operate.bookData.withinMonthCstTableCount }}</view>
					</view>
					<view class="custom-com">
						<view>宴会桌数</view>
						<view>{{ operate.bookData.withinMonthBanquetTableCount }}</view>
					</view>

					<view class="custom-com">
						<view>订金金额(￥)</view>
						<view>{{ operate.bookData.withinMonthCstAmount | formatMoney }}</view>
					</view>
					<view class="custom-com">
						<view>订金金额(￥)</view>
						<view>{{ operate.bookData.withinMonthBanquetAmount | formatMoney }}</view>
					</view>
				</view>
				
				
				<!--  ==================== 全部 ================= -->
				<view class="custom-overview" v-show="bookSelectType == '昨日' && dataType == '全部'">
					<view class="custom-com" >
						<view>客户桌数</view>
						<view>{{ operateAll.bookData.allYesterdayCstTableCount }}</view>
					</view>
					<view class="custom-com">
						<view>宴会桌数</view>
						<view>{{ operateAll.bookData.allYesterdayBanquetTableCount }}</view>
					</view>
				
					<view class="custom-com">
						<view>金额(￥)</view>
						<view>{{ operateAll.bookData.allYesterdayCstAmount | formatMoney }}</view>
					</view>
					<view class="custom-com">
						<view>金额(￥)</view>
						<view>{{ operateAll.bookData.allYesterdayBanquetAmount | formatMoney }}</view>
					</view>
				</view>
				
				<view class="custom-overview" v-show="bookSelectType == '今日' && dataType == '全部'">
					<view class="custom-com">
						<view>客户桌数</view>
						<view>{{ operateAll.bookData.allTodayCstTableCount }}</view>
					</view>
					<view class="custom-com">
						<view>宴会桌数</view>
						<view>{{ operateAll.bookData.allTodayBanquetTableCount }}</view>
					</view>
				
					<view class="custom-com">
						<view>金额(￥)</view>
						<view>{{ operateAll.bookData.allTodayCstAmount | formatMoney }}</view>
					</view>
					<view class="custom-com">
						<view>金额(￥)</view>
						<view>{{ operateAll.bookData.allTodayBanquetAmount | formatMoney }}</view>
					</view>
				</view>
				
				<view class="custom-overview" v-show="bookSelectType == '一个月内' && dataType == '全部'">
					<view class="custom-com">
						<view>客户桌数</view>
						<view>{{ operateAll.bookData.allWithinMonthCstTableCount }}</view>
					</view>
					<view class="custom-com">
						<view>宴会桌数</view>
						<view>{{ operateAll.bookData.allWithinMonthBanquetTableCount }}</view>
					</view>
				
					<view class="custom-com">
						<view>订金金额(￥)</view>
						<view>{{ operateAll.bookData.allWithinMonthCstAmount | formatMoney }}</view>
					</view>
					<view class="custom-com">
						<view>订金金额(￥)</view>
						<view>{{ operateAll.bookData.allWithinMonthBanquetAmount | formatMoney }}</view>
					</view>
				</view>
			</view>
			
			<!-- ===================== 宴会线索 ======================= -->
			<view class="overview-com"
				:style="{ order: this.operateList.findIndex(v => v.name == '宴会线索') }"
				v-if="targetOperation('宴会线索', 'isOpen') == '1'"
				>
			<!-- <view class="overview-com"
				:style="{ order: this.operateList.findIndex(v => v.name == '宴会线索') }"
				v-if="targetOperation('宴会线索', 'isOpen') == '1'"
				> -->
				<view id="overview-title" @tap="gotoBanquet()">
					<view class="overview-subTitle">
						<view class="overview-stripe"></view>
						<view>宴会线索</view>
					</view>
					<view>
						<view class="info-wrapper" v-show="dataType == '个人' && operate.banquetCluesData.needHandleCount > 0">
							<view class="overview-dot"></view>
							<view class="yyt-error">{{ operate.banquetCluesData.needHandleCount }}</view>
							<view>条待跟进</view>
						</view>
						<view class="info-wrapper" v-show="dataType == '全部' && operateAll.banquetCluesData.allNeedHandleCount > 0">
							<view class="overview-dot"></view>
							<view class="yyt-error">{{ operateAll.banquetCluesData.allNeedHandleCount }}</view>
							<view>条待跟进</view>
						</view>
						<swIcon type="arrowright" size="25" color="#D9D9D9"></swIcon>
					</view>
				</view>
				<view class="custom-overview" v-show="dataType == '个人'">
					<view class="custom-com custom-com-short" @tap="gotoBanquet('线索成交率', 3)">
						<view class="yyt-error">A</view>
						<view>{{ operate.banquetCluesData.levelHighCount }}</view>
					</view>
					<view class="custom-com custom-com-short" @tap="gotoBanquet('线索成交率', 2)">
						<view class="yyt-warning">B</view>
						<view>{{ operate.banquetCluesData.levelMediumCount }}</view>
					</view>
					<view class="custom-com custom-com-short" @tap="gotoBanquet('线索成交率', 1)">
						<view class="yyt-orange">C</view>
						<view>{{ operate.banquetCluesData.leveLowCount }}</view>
					</view>
					<view class="custom-com custom-com-short" @tap="gotoBanquet('线索状态', 3)">
						<view>已成交量</view>
						<view>{{ operate.banquetCluesData.tradedCount }}</view>
					</view>
				</view>
				<view class="custom-overview" v-show="dataType == '全部'">
					<view class="custom-com custom-com-short" @tap="gotoBanquet('线索成交率', 3)">
						<view class="yyt-error">A</view>
						<view>{{ operateAll.banquetCluesData.allLevelHighCount }}</view>
					</view>
					<view class="custom-com custom-com-short" @tap="gotoBanquet('线索成交率', 2)">
						<view class="yyt-warning">B</view>
						<view>{{ operateAll.banquetCluesData.allLevelMediumCount }}</view>
					</view>
					<view class="custom-com custom-com-short" @tap="gotoBanquet('线索成交率', 1)">
						<view class="yyt-orange">C</view>
						<view>{{ operateAll.banquetCluesData.allLeveLowCount }}</view>
					</view>
					<view class="custom-com custom-com-short" @tap="gotoBanquet('线索状态', 3)">
						<view>已成交量</view>
						<view>{{ operateAll.banquetCluesData.allTradedCount }}</view>
					</view>
				</view>
			</view>
			
			<!-- =================== 目标完成情况 ==================== -->
			<view class="overview-com"
				:style="{ order: this.operateList.findIndex(v => v.name == '目标完成情况') }"
				v-if="targetOperation('目标完成情况', 'isOpen') == '1'"
				>
			<!-- <view class="overview-com"
				:style="{ order: this.operateList.findIndex(v => v.name == '目标完成情况') }"
				v-if="targetOperation('目标完成情况', 'isOpen') == '1'"
				> -->
				<view id="overview-title" @tap="gotoSaleTarget()">
					<view class="overview-subTitle">
						<view class="overview-stripe"></view>
						<view>目标完成情况</view>
					</view>
					<view>
						<swIcon type="arrowright" size="25" color="#D9D9D9"></swIcon>
					</view>
				</view>
				<view class="custom-overview" v-show="dataType == '个人'" @tap="gotoSaleTarget()">
					<view class="custom-com custom-com-short">
						<view>总目标</view>
						<view>{{ operate.targetCompletionData.targetTotalCount }}</view>
					</view>
					<view class="custom-com custom-com-short">
						<view>已完成目标</view>
						<view>{{ operate.targetCompletionData.targetCompletionCount }}</view>
					</view>
				</view>
				<view class="custom-overview" v-show="dataType == '全部'" @tap="gotoSaleTarget()">
					<view class="custom-com custom-com-short">
						<view>已完成人数</view>
						<view>{{ operateAll.targetCompletionData.allTargetCompletionCount }}</view>
					</view>
				</view>
			</view>
		</view>
		</mescroll-uni>
		<!-- ========================= 其他 START ========================= -->
		<!-- 【刷新跟踪机会】选择年月 -->
		<yyt-picker
		    mode="yearMonth"
			:format="'YYYY-MM'"
		    :startYear="dateRange.startDate"
		    :endYear="dateRange.endDate"
		    :defaultVal="dateRange.defaultDateRangeArr"
		    :current="false"
		    @confirm="onConfirmYear"
			@cancel="onCancelYear"
		    ref="yearMonth"
		    themeColor="#007AFF"
		></yyt-picker>
		<!-- ========================= 其他 END ========================= -->
	</view>
</template>

<script>
export { default } from './homePageOld.js';
</script>

<style lang="less" scoped>
@import url('homePageOld.less');
</style>
