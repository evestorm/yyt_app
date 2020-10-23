<!--
	1. 客户单独一个样式，和客户列表一样；
	2. 订单单独一个样式，和预订列表一样；
	3. 跟踪单独一个样式，和设计稿一致；https://lanhuapp.com/web/#/item/project/board?type=share_mark&pid=3dee986e-a2ed-42ac-a0b2-b74084dd067a&activeSectionId=&teamId=875bd79b-dfd9-4294-93f1-a92398b3c2b2&param=545de8cd-2934-407f-a3a5-82172285cd4f
	4. 转化单独一个样式，和设计稿一致；https://lanhuapp.com/web/#/item/project/board?type=share_mark&pid=3dee986e-a2ed-42ac-a0b2-b74084dd067a&activeSectionId=&teamId=875bd79b-dfd9-4294-93f1-a92398b3c2b2&param=545de8cd-2934-407f-a3a5-82172285cd4f
 -->
<template>
	<view class="common-list">
		<z-nav-bar class="z-nav-bar" :title="setTitle" bgColor="#0782ff" fontColor="#FFF">
			<!-- 返回 -->
			<sw-icon type="back" color="#fff" size="27" slot="left" @tap="onBack"></sw-icon>
		</z-nav-bar>
		<!-- ========================= 列表 START ========================= -->
		<mescroll-uni
			:topbar="true"
			:down="downOption"
			@down="downCallback"
			:up="upOption"
			@up="upCallback"
			:top="navFilterBottom"
			:bottom="swBottom"
		>
			<!-- 客户列表的样式 -->
			<view v-if="dataType == CE.customerPool.value"
				class="yyt-customer-card uni-flex"
				v-for="(ct, index) in dataList" :key="ct.customerId" @tap="gotoDetail(ct)">
				<!-- 主要内容区 -->
				<view
					class="customer-main-wrapper uni-flex uni-row"
					:style="ct.companyName ? 'margin-bottom:20rpx' : ''"
				>
				<!-- :style="ct.customerLable.length <= 0 ? 'margin-bottom:-20rpx' : ''" -->
					<!-- 如果没有标签，与次要信息的间隔就要减少一些 -->
					<!-- 头像 -->
					<view class="avatar-wrapper">
						<view
							class="cu-avatar xl round"
							:style="{ backgroundImage: getImgUrl(ct.headImg) }"
						></view>
						<!-- 价值客户：（就是以前有客服池经理的客户） -->
						<image
							class="jiazhi"
							v-if="ct.customerPoolMarketName"
							:src="picDomain + '/upload//20200824/134602462_jiazhi.png'"
						></image>
						<!-- <view class="cs-pool-wrapper" v-if="ct.customerPoolMarketName">
							<image class="img" :src="picDomain + '/upload/yyticons/110019019_cs-icon.png'"></image>
							<text class="txt text-ellipsis-2 font-weight">{{ ct.customerPoolMarketName.slice(0, 10) }}</text>
						</view> -->
					</view>
					<!-- 资料 -->
					<view class="customer-info-wrapper uni-flex uni-column">
						<!-- 头像，尊称，等级，客服名称 -->
						<view class="customer-name-wrapper uni-flex uni-row">
							<view class="name">{{ ct.customerName }}</view>
							<view class="sub-name" v-show="ct.msgName">(尊称:{{ ct.msgName }})</view>
							<image class="level" :src="getCustomLevelImgUrl(ct)"></image>
							<image
								v-if="ct.isArrange == '1'"
								class="status-img"
								:src="picDomain + '/upload/yytApp/customer/yizhengli.png'"
							></image>
							<view
								class="cs-name-wrapper"
								v-if="ct.marketerName"
							>
								<!-- 属于上面view v-if="ct.customerPoolMarketName || ct.marketerName" -->
								<!-- <block v-if="ct.customerPoolMarketName">
									<image
										class="yyt-small-img"
										:src="picDomain + '/upload/yyticons/093105315_cspool.png'"
										mode=""
									></image>
									<text class="cs-name font-weight">
										{{ ct.customerPoolMarketName }}
									</text>
								</block> -->
								<!-- <block v-else> -->
									<!-- <image
										class="yyt-small-img"
										:src="picDomain + '/upload/yytApp/banquet/kefujingli.png'"
										mode=""
									></image> -->
									<text class="icon iconfont lines-blue" :class="ct.isLockMarket?'icon-suoding1':'icon-weisuoding'" style="font-size: 24rpx;"></text>
									<text class="cs-name">{{ ct.marketerName }}</text>
								<!-- </block> -->
							</view>
						</view>
						<!-- 电话，筛选 or 整理状态，单位 -->
						<view class="phone-wrapper uni-flex uni-row">
							<view class="phone margin-right">{{ ct.phone }}</view>
							<!-- <view class="company" v-if="ct.companyName">{{ ct.companyName }}</view> -->
							<!-- 公司 -->
							<view class="company-wrapper uni-flex uni-row yyt-margin-bottom-small" v-if="ct.companyName">
								<text class="bg">
									<text class="icon iconfont icon-gongsi1 yyt-margin-right-small" style="color: #F3B040; font-size: 24rpx;"></text>
									<text class="company-name">{{ ct.companyName }}</text>
								</text>
							</view>
						</view>
						<!-- 标签 -->
						<view class="tags-wrapper uni-flex uni-row" v-if="ct.customerLable.length > 0">
							<view
								class="cu-tag radius yyt-grey-bg"
								v-for="(label, index) in ct.customerLable"
								:key="index"
							>
								{{ label }}
							</view>
							<uni-icons
								class="arrow"
								type="forward"
								size="30r"
								color="#eaeaea"
							></uni-icons>
						</view>
						<!-- <view v-if="ct.customerLable.length <= 0" class="tags-wrapper uni-flex uni-row text-grey text-sm">暂无标签</view> -->
					</view>
				</view>
				<!-- 次要内容区 -->
				<view
					class="customer-sub-wrapper"
					
				>
				<!-- :style="ct.customerLable.length > 0 ? 'margin-top: 20rpx' : ''" -->
					<!-- 消费汇总情况 -->
					<yyt-allfree :summaryStat='ct.summaryStat'></yyt-allfree>
					<!-- 最近消费 -->
					<block v-if="ct.saleForecastLastBook">
						<view class="recent-consumption uni-flex uni-row flex-wrap">
							<image
								class="yyt-small-img"
								:src="picDomain + '/upload/yytApp/customer/consume.png'"
								mode=""
							></image>
							<text class="date yyt-margin-left-bg">
								{{ ct.saleForecastLastBook.bookOn.slice(0, 10) }}
							</text>
							<text class="meals yyt-margin-left-bg">
								{{ ct.saleForecastLastBook.diningTypeName }}
							</text>
							<text class="customer-type yyt-margin-left-bg">
								{{ ct.saleForecastLastBook.bookOrderTypeName }}
							</text>
							<text class="yyt-margin-left-bg">{{ ct.saleForecastLastBook.masterTableName }}</text>
							<text class="meals yyt-margin-left-bg">
								{{ ct.saleForecastLastBook.bookTableNum }}桌
							</text>
							<text class="amount yyt-margin-left-bg">
								¥{{ ct.saleForecastLastBook.fee | formatMoney }}
							</text>
							<text class="cs-name yyt-margin-left-bg">
								{{ ct.saleForecastLastBook.bookOrderMarketer }}
							</text>
						</view>
					</block>
				
					<!-- 最近跟踪 -->
					<view class="recent-tracking uni-flex uni-row" v-if="ct.saleForecastLastFollow">
						<image
							class="yyt-small-img"
							:src="picDomain + '/upload/yytApp/customer/tracking.png'"
							mode=""
						></image>
						<text class="date yyt-margin-left-bg">
							{{ ct.saleForecastLastFollow.beginTime.slice(0, 16) }}
						</text>
						<text class="yyt-margin-left-bg">
							{{ $cw.calcCallMode(ct.saleForecastLastFollow.callType) }}
						</text>
						<text class="cs-name yyt-margin-left-bg">
							{{ ct.saleForecastLastFollow.marketerName }}
						</text>
					</view>
				</view>
				<!-- 工具区 -->
				<view class="customer-tools-wrapper uni-flex uni-row yyt-margin-top-small">
					<button
						class="cu-btn round line-blue yyt-margin-right-small"
						@tap.stop="gotoCallPhone(ct.phone)"
					>
						电话
					</button>
					<!-- bg-blue实心按钮 line-blue 镂空按钮 -->
					<button
						class="cu-btn round line-blue yyt-margin-right-small"
						@tap.stop="gotoSendMsg(ct)"
					>
						发信息
					</button>
					<!-- bg-blue实心按钮 line-blue 镂空按钮 -->
					<button
						class="cu-btn round line-blue yyt-margin-right-small"
						@tap.stop="gotoRecord(ct)"
					>
						记录
					</button>
				</view>
			</view>
			
			<!-- 跟踪独有样式 -->
			<view v-if="dataType == CE.customerTracking.value"
				class="yyt-customer-card uni-flex"
				v-for="(ct, index) in dataList" :key="ct.customerId" @tap="gotoDetail(ct)"
			>
				<!-- 主要内容区 -->
				<view
					class="customer-main-wrapper uni-flex uni-row"
					style="margin-bottom:-20rpx"
				>
				<!-- :style="ct.customerLable.length <= 0 ? 'margin-bottom:-20rpx' : ''" -->
					<!-- 如果没有标签，与次要信息的间隔就要减少一些 -->
					<!-- 头像 -->
					<view class="avatar-wrapper">
						<view
							class="cu-avatar xl round"
							:style="{ backgroundImage: getImgUrl(ct.headImg) }"
						></view>
						<!-- 价值客户：（就是以前有客服池经理的客户） -->
						<!-- <image
							class="jiazhi"
							v-if="ct.customerPoolMarketName"
							:src="picDomain + '/upload//20200824/134602462_jiazhi.png'"
						></image> -->
					</view>
					<!-- 资料 -->
					<view class="customer-info-wrapper uni-flex uni-column">
						<!-- 头像，尊称，等级，客服名称 -->
						<view class="customer-name-wrapper uni-flex uni-row">
							<view class="name">{{ ct.customerName }}</view>
							<!-- <view class="sub-name" v-show="ct.msgName">(尊称:{{ ct.msgName }})</view> -->
							<image class="level" :src="getCustomLevelImgUrl(ct)"></image>
							<!-- <image
								v-if="ct.isArrange == '1'"
								class="status-img"
								:src="picDomain + '/upload/yytApp/customer/yizhengli.png'"
							></image> -->
							<!-- <view
								class="cs-name-wrapper"
								v-if="ct.marketerName"
							>
									<image
										class="yyt-small-img"
										:src="picDomain + '/upload/yytApp/banquet/kefujingli.png'"
										mode=""
									></image>
									<text class="cs-name">{{ ct.marketerName }}</text>
							</view> -->
						</view>
						<!-- 电话，筛选 or 整理状态，单位 -->
						<view class="phone-wrapper uni-flex uni-row">
							<view class="phone margin-right">{{ ct.phone }}</view>
							<!-- <view class="company" v-if="ct.companyName">{{ ct.companyName }}</view> -->
							<!-- 公司 -->
							<!-- <view class="company-wrapper uni-flex uni-row yyt-margin-bottom-small" v-if="ct.companyName">
								<text class="bg">
									<text class="icon iconfont icon-gongsi1 yyt-margin-right-small" style="color: #F3B040; font-size: 24rpx;"></text>
									<text class="company-name">{{ ct.companyName }}</text>
								</text>
							</view> -->
						</view>
						<!-- 标签 -->
						<!-- <view class="tags-wrapper uni-flex uni-row" v-if="ct.customerLable.length > 0">
							<view
								class="cu-tag radius yyt-grey-bg"
								v-for="(label, index) in ct.customerLable"
								:key="index"
							>
								{{ label }}
							</view>
							<uni-icons
								class="arrow"
								type="forward"
								size="30r"
								color="#eaeaea"
							></uni-icons>
						</view> -->
						<!-- <view v-if="ct.customerLable.length <= 0" class="tags-wrapper uni-flex uni-row text-grey text-sm">暂无标签</view> -->
					</view>
				</view>
				<!-- 次要内容区 -->
				<view
					class="customer-sub-wrapper"
					
				>
				<!-- :style="ct.customerLable.length > 0 ? 'margin-top: 20rpx' : ''" -->
					<!-- 消费汇总情况 -->
					<!-- <yyt-allfree :summaryStat='ct.summaryStat'></yyt-allfree> -->
					<!-- 最近消费 -->
					<!-- <block v-if="ct.saleForecastLastBook">
						<view class="recent-consumption uni-flex uni-row flex-wrap">
							<image
								class="yyt-small-img"
								:src="picDomain + '/upload/yytApp/customer/consume.png'"
								mode=""
							></image>
							<text class="date yyt-margin-left-bg">
								{{ ct.saleForecastLastBook.bookOn.slice(0, 10) }}
							</text>
							<text class="meals yyt-margin-left-bg">
								{{ ct.saleForecastLastBook.diningTypeName }}
							</text>
							<text class="customer-type yyt-margin-left-bg">
								{{ ct.saleForecastLastBook.bookOrderTypeName }}
							</text>
							<text class="yyt-margin-left-bg">{{ ct.saleForecastLastBook.masterTableName }}</text>
							<text class="meals yyt-margin-left-bg">
								{{ ct.saleForecastLastBook.bookTableNum }}桌
							</text>
							<text class="amount yyt-margin-left-bg">
								¥{{ ct.saleForecastLastBook.fee | formatMoney }}
							</text>
							<text class="cs-name yyt-margin-left-bg">
								{{ ct.saleForecastLastBook.bookOrderMarketer }}
							</text>
						</view>
					</block> -->
				
					<!-- 最近跟踪 -->
					<view class="recent-tracking uni-flex uni-row" v-if="ct.saleForecastLastFollow">
						<image
							class="yyt-small-img"
							:src="picDomain + '/upload/yytApp/customer/tracking.png'"
							mode=""
						></image>
						<text class="date yyt-margin-left-bg">
							{{ ct.saleForecastLastFollow.beginTime.slice(0, 19) }}
						</text>
						<text class="date yyt-margin-left-bg">
							{{ ct.saleForecastLastFollow.beginTime | parseShortWeek }}
						</text>
						<text class="yyt-margin-left-bg">
							{{ $cw.calcCallMode(ct.saleForecastLastFollow.callType) }}
						</text>
						<text class="cs-name yyt-margin-left-bg">
							{{ ct.saleForecastLastFollow.marketerName }}
						</text>
					</view>
				</view>
				<!-- 工具区 -->
				<!-- <view class="customer-tools-wrapper uni-flex uni-row yyt-margin-top-small">
					<button
						class="cu-btn round line-blue yyt-margin-right-small"
						@tap.stop="gotoCallPhone(ct.phone)"
					>
						电话
					</button>
					<button
						class="cu-btn round line-blue yyt-margin-right-small"
						@tap.stop="gotoSendMsg(ct)"
					>
						发信息
					</button>
					<button
						class="cu-btn round line-blue yyt-margin-right-small"
						@tap.stop="gotoRecord(ct)"
					>
						记录
					</button>
				</view> -->
			</view>
			
			<!-- 订单样式 -->
			<view
				v-if="dataType == CE.customerOrder.value
					|| dataType == CE.banquetOrder.value
					|| dataType == CE.individualOrders.value
					|| dataType == CE.accommodationOrder.value
					|| dataType == CE.transformOrder.value"
				class="yyt-customer-card uni-flex"
				v-for="(ct, index) in dataList" :key="ct.bookOrderID"
				@tap="gotoDetail(ct)">
				<!-- 主要内容区 -->
				<view class="customer-main-wrapper uni-flex uni-row" style="margin-bottom: -10rpx;">
					<!-- 头像 -->
					<view class="avatar-wrapper" @tap.stop="gotoCustomerInfo(ct)">
						<view
							class="cu-avatar xl round"
							:style="{ backgroundImage: getImgUrl(ct.headImg) }"
						></view>
					</view>
					<!-- 资料 -->
					<view class="customer-info-wrapper uni-flex uni-column">
						<!-- 头像，尊称，等级，客服名称 -->
						<view class="customer-name-wrapper uni-flex uni-row">
							<view class="name">
								{{ ct.customerName ? ct.bookOrderName : ct.customerName }}
							</view>
							<image class="level" :src="getCustomLevelImgUrl(ct)"></image>
							<!-- 发送短信 10:短信 ； 20：微信 ； 0：未发 -->
							<view class="msg-status d-flex align-center j-center" v-if="ct.sendMsgType !=0">
								<image :src="ct.sendMsgType ==10?'https://pic.cwyyt.cn/upload//20200811/1559115911_已发短信.png':'https://pic.cwyyt.cn/upload//20200811/1553395339_组 96.png'" mode=""></image>
								<!-- <text class="icon iconfont icon-xingzhuang3 mr-1"></text>
								<text class="text" v-if="ct.sendMsgType ==10">已发短信</text>
								<text class="text" v-if="ct.sendMsgType ==20">已发微信</text> -->
							</view>
							<view class="cs-name-wrapper" v-if="ct.bookOrderMarketer">
								<image
									class="yyt-small-img"
									:src="picDomain + '/upload/yytApp/banquet/kefujingli.png'"
									mode=""
								></image>
								<!-- <text class="icon iconfont lines-blue" :class="ct.isLockMarket?'icon-suoding1':'icon-weisuoding'" style="font-size: 24rpx;"></text> -->
								<text class="cs-name">{{ ct.bookOrderMarketer }}</text>
							</view>
						</view>
						<!-- 电话 -->
						<view class="phone-wrapper uni-flex uni-row">
							<view class="phone margin-right">{{ ct.bookerPhone }}</view>
							<image
								v-if="ct.isClose == 1"
								class="status-img"
								:src="picDomain + '/upload/yytApp/reserve/yiguandan.png'"
							></image>
							<view class="company-wrapper uni-flex uni-row yyt-margin-bottom-small" v-if="ct.bookOrderCompany">
								<text class="bg">
									<text class="icon iconfont icon-gongsi1 yyt-margin-right-small" style="color: #F3B040; font-size: 24rpx;"></text>
									<text class="company-name">{{ ct.bookOrderCompany }}</text>
								</text>
							</view>
						</view>
						
						<!-- 标签 -->
						<view class="tags-wrapper uni-flex uni-row" v-if="ct.customerLable && ct.customerLable.length > 0">
							<view
								class="cu-tag radius yyt-grey-bg"
								v-for="(label, index) in ct.customerLable"
								:key="index"
							>
								{{ label }}
							</view>
							<uni-icons
								class="arrow"
								type="forward"
								size="30r"
								color="#eaeaea"
							></uni-icons>
						</view>
					</view>
				</view>
				<!-- 次要内容区 -->
				<view class="customer-sub-wrapper">
					<!-- <yyt-allfree :summaryStat='ct.summaryStat'></yyt-allfree> -->
					<!-- 订单描述 -->
					<view class="order-desc uni-flex uni-column">
						<view  class="d-flex a-center">
							<text class="text-bold">{{ ct.areaName }}</text>
							<text class="yyt-margin-left-bg text-grey table-join">
								{{ ct.tableList.map(v => v.tableName).join(' ') }}
							</text>
							<text class="yyt-margin-left-small text-grey">>></text>
						</view>
						<view class="order-new-book d-flex flex-column px-3 py-2">
							<view class="wrapper">
								<text class=" text-bold">{{ ct.bookOn | parseShortDate }}</text>
								<text class="yyt-margin-left-bg">{{ ct.diningTypeName }}</text>
								<text class="yyt-margin-left-bg">{{ ct.bookTableNum }}桌</text>
								<text class="yyt-margin-left-bg">{{ ct.bookOrderTypeName }}</text>
							</view>
							<view class="wrapper">
								<text class="">{{ ct.bookNums }} 人</text>
								<!-- bug:5493 -->
								<text
									v-if="ct.isClose == 0 || ct.isClose == 1"
									class="yyt-margin-left-bg"
								>
									{{ ct.fee || 0 | formatMoney }}元  &nbsp;&nbsp; 实付 {{ ct.orderRealAmount || 0 | formatMoney }}元
								</text>
							</view>
						</view>
					</view>
				</view>
				<!-- 工具区 -->
				<view class="customer-tools-wrapper uni-flex uni-row yyt-margin-top-small">
					<!-- 不是财务才能显示（发信息，电话，记录） -->
					<!-- 现在不是财务又可以显示了v-if="!$storage.getSalesAuthority().isFinance" -->
					<button
						class="cu-btn round line-blue yyt-margin-right-small"
						@tap.stop="gotoCallPhone(ct.bookerPhone)"
					>
						电话
					</button>
					<!-- bg-blue实心按钮 line-blue 镂空按钮 -->
					<!-- 财务也能发短信了：v-if="!$storage.getSalesAuthority().isFinance" -->
					<button
						class="cu-btn round line-blue yyt-margin-right-small"
						@tap.stop="gotoSendMsg(ct)"
					>
						发信息
					</button>
					<!-- bg-blue实心按钮 line-blue 镂空按钮 -->
					<!-- 财务也能记录了： v-if="!$storage.getSalesAuthority().isFinance" -->
					<button
						class="cu-btn round line-blue yyt-margin-right-small"
						@tap.stop="gotoRecord(ct)"
					>
						记录
					</button>
				</view>
			</view>
			
			<!-- 全部、推荐样式 -->
			<view
				v-if="dataType == CE.activeTransformation.value
				|| dataType == CE.recommendedTransformation.value"
				class="yyt-customer-card uni-flex"
				v-for="(ct, index) in dataList" :key="ct.bookOrderID"
				@tap="gotoDetail(ct)"
			>
				<!-- 主要内容区 -->
				<view class="customer-main-wrapper uni-flex uni-row" style="margin-bottom: -10rpx;">
					<!-- 头像 -->
					<view class="avatar-wrapper" @tap.stop="gotoCustomerInfo(ct)">
						<view
							class="cu-avatar xl round"
							:style="{ backgroundImage: getImgUrl(ct.headImg) }"
						></view>
					</view>
					<!-- 资料 -->
					<view class="customer-info-wrapper uni-flex uni-column">
						<!-- 头像，尊称，等级，客服名称 -->
						<view class="customer-name-wrapper uni-flex uni-row">
							<view class="name">
								{{ ct.customerName ? ct.bookOrderName : ct.customerName }}
							</view>
							<image class="level" :src="getCustomLevelImgUrl(ct)"></image>
							<!-- 发送短信 10:短信 ； 20：微信 ； 0：未发 -->
							<view class="msg-status d-flex align-center j-center" v-if="ct.sendMsgType !=0">
								<image :src="ct.sendMsgType ==10?'https://pic.cwyyt.cn/upload//20200811/1559115911_已发短信.png':'https://pic.cwyyt.cn/upload//20200811/1553395339_组 96.png'" mode=""></image>
								<!-- <text class="icon iconfont icon-xingzhuang3 mr-1"></text>
								<text class="text" v-if="ct.sendMsgType ==10">已发短信</text>
								<text class="text" v-if="ct.sendMsgType ==20">已发微信</text> -->
							</view>
							<!-- 不显示 -->
							<!-- <view class="cs-name-wrapper" v-if="ct.bookOrderMarketer">
								<image
									class="yyt-small-img"
									:src="picDomain + '/upload/yytApp/banquet/kefujingli.png'"
									mode=""
								></image>
								<text class="cs-name">{{ ct.bookOrderMarketer }}</text>
							</view> -->
						</view>
						<!-- 电话 -->
						<view class="phone-wrapper uni-flex uni-row">
							<view class="phone margin-right">{{ ct.bookerPhone }}</view>
							<image
								v-if="ct.isClose == 1"
								class="status-img"
								:src="picDomain + '/upload/yytApp/reserve/yiguandan.png'"
							></image>
						</view>
					</view>
				</view>
				<!-- 次要内容区 -->
				<view class="customer-sub-wrapper">
					<!-- <yyt-allfree :summaryStat='ct.summaryStat'></yyt-allfree> -->
					<!-- 订单描述 -->
					<view class="order-desc uni-flex uni-column">
						<!-- <view  class="d-flex a-center">
							<text class="text-bold">{{ ct.areaName }}</text>
							<text class="yyt-margin-left-bg text-grey table-join">
								{{ ct.tableList.map(v => v.tableName).join(' ') }}
							</text>
							<text class="yyt-margin-left-small text-grey">>></text>
						</view> -->
						<view class="order-new-book d-flex flex-column px-3 py-2">
							<view class="wrapper">
								<text class=" text-bold">{{ ct.bookOn | parseShortDate }}</text>
								<text class="yyt-margin-left-bg">{{ ct.diningTypeName }}</text>
								<text class="yyt-margin-left-bg">{{ ct.bookTableNum }}桌</text>
								<text class="yyt-margin-left-bg">{{ ct.bookOrderTypeName }}</text>
							</view>
							<view class="wrapper">
								<text class="">{{ ct.bookNums }} 人</text>
								<!-- bug:5493 -->
								<text
									v-if="ct.isClose == 0 || ct.isClose == 1"
									class="yyt-margin-left-bg"
								>
									{{ ct.fee || 0 | formatMoney }}元  &nbsp;&nbsp; 实付 {{ ct.orderRealAmount || 0 | formatMoney }}元
								</text>
							</view>
						</view>
					</view>
					<view class="recent-tracking uni-flex uni-row yyt-margin-top-bg" v-if="ct.saleForecastLastFollow">
						<image
							class="yyt-small-img"
							:src="picDomain + '/upload/yytApp/customer/tracking.png'"
							mode=""
						></image>
						<text class="date yyt-margin-left-bg">
							{{ ct.saleForecastLastFollow.beginTime.slice(0, 16) }}
						</text>
						<text class="date yyt-margin-left-bg">
							{{ ct.saleForecastLastFollow.beginTime | parseShortWeek }}
						</text>
						<text class="yyt-margin-left-bg">
							{{ $cw.calcCallMode(ct.saleForecastLastFollow.callType) }}
						</text>
						<text class="cs-name yyt-margin-left-bg">
							{{ ct.saleForecastLastFollow.marketerName }}
						</text>
						<!-- 推转跟 -->
						<view class="zhuantuigen">
							<image :src="picDomain + '/upload/yytApp/images/geng.png'" class="gengPic yyt-big-img" v-if="ct.saleForecastLastFollow && ct.saleForecastLastFollow.isEffectiveFollow"></image>
							<image :src="picDomain + '/upload/yytApp/images/tui.png'" class="tuiPic yyt-big-img yyt-margin-left-small" v-if="ct.saleForecastLastFollow && ct.saleForecastLastFollow.isRecommendConversion"></image>
							<!-- <image :src="picDomain + '/upload//20200819/1321502150_zhuan.png'" class="gengPic yyt-big-img" v-if="ct.bookOrderID && ct.saleForecastLastFollow && ct.saleForecastLastFollow.isEffectiveFollow == 1"></image> -->
						</view>
					</view>
				</view>
				<!-- 跟踪 -->
				
			</view>
		</mescroll-uni>
		<!-- ========================= 列表 END ========================= -->
	</view>
</template>

<script>
export { default } from './commonList.js';
</script>

<style lang="less" scoped>
@import url('commonList.less');
</style>
