<template>
	<view class="todaybook-list">
		<!-- 顶部时间范围筛选 -->
		<yyt-picker
			mode="range"
			:startYear="startDateStr"
			:endYear="endDateStr"
			:defaultVal="defaultDateRangeArr"
			:current="false"
			@confirm="onConfirmDateRange"
			ref="dateRangePicker"
			themeColor="#007AFF"
		></yyt-picker>

		<view class="top-filter-wrapper" ref="topWrapperRef">
			<!-- ========================= 顶部筛选 START ========================= -->
			<!-- 顶部filter -->
			<view class="bg-white nav uni-flex nav-filter">
				<!-- 时间筛选 -->
				<view class="cu-item text-center">
					<view
						class="dateSelect"
						:style="{
							flex: TodyBookQuery.bookOnStart == TodyBookQuery.bookOnEnd ? '	0 1 30%' : '1',
							justifyContent:
								TodyBookQuery.bookOnStart == TodyBookQuery.bookOnEnd
									? 'space-between'
									: 'center'
						}"
					>
						<block v-if="TodyBookQuery.bookOnStart == TodyBookQuery.bookOnEnd">
							<view class="toLeft yyt-extend-area" @tap="getPre">
								<!-- <uni-icons type="arrowleft" size="35r" color="#0183FF"></uni-icons> -->
								<image
									class="yyt-small-img"
									src="https://pic.cwyyt.cn/upload/yyticons/1311151115_下拉@2x.png"
									mode=""
								></image>
							</view>
							<view class="date-range" @tap="clickDateRange">
								<text id="start-date" class="input">
									{{ TodyBookQuery.bookOnStart.slice(0, 10) }}
								</text>
							</view>
							<view class="toRight yyt-extend-area" @tap="getNext">
								<!-- <uni-icons type="arrowright" size="35r" color="#0183FF"></uni-icons> -->
								<image
									class="yyt-small-img"
									src="https://pic.cwyyt.cn/upload/yyticons/1311151115_下拉@2x.png"
									mode=""
								></image>
							</view>
						</block>
						<block v-else>
							<view class="date-range" @tap="clickDateRange">
								<text id="start-date" class="input">
									{{ TodyBookQuery.bookOnStart.slice(0, 10) }}
								</text>
								<text class="span">至</text>
								<text id="end-date" class="input">
									{{ TodyBookQuery.bookOnEnd.slice(0, 10) }}
								</text>
							</view>
							<uni-icons type="arrowdown" size="35r" color="#0183FF"></uni-icons>
						</block>
					</view>
				</view>
				<!-- 餐别筛选 -->
				<view class="cu-item text-center">
					<view class="flex yyt-flex-center yyt-h-100" @tap.stop="mealsAllToggle">
						<text>{{ mealsIsAll }}</text>
						<uni-icons type="arrowdown" size="35r" color="#0183FF"></uni-icons>
					</view>
					<view class="dropdown-panel" v-show="isShowMeals">
						<view
							v-for="(item, index) in mealsAll"
							:key="index"
							:class="['dropdown-item', item.selected ? 'dropdown-item-sel' : '']"
							@tap="seleMealsAll(item)"
						>
							{{ item.label }}
						</view>
						<view class="dropdown-mask" v-show="isShowMeals" @tap="hideDropdownAndMask"></view>
					</view>
				</view>
				<!-- 客户经理筛选 -->
				<view class="cu-item text-center">
					<view class="flex yyt-flex-center yyt-h-100" @tap.stop="CSManagerFilterToggle">
						<text>{{ currentUser.label.slice(0, 5) }}</text>
						<!-- 都可以看见所有的预订单 -->
						<!-- v-show="
								$storage.getSalesAuthority().isFinance
						" -->
						<uni-icons
							type="arrowdown"
							size="35r"
							color="#0183FF"
						></uni-icons>
					</view>

					<view
						class="dropdown-panel"
						v-show="isCSManagerFilter"
						style="box-shadow: 0 -2px 2px #f1f1f1;"
					>
						<scroll-view scroll-y="true" style="max-height: 28vh;">
							<view
								v-for="(item, index) in CSManagerFilterArr"
								:key="index"
								:class="['dropdown-item', item.selected ? 'dropdown-item-sel' : '']"
								@tap="seleCSManagerFilter(item)"
							>
								{{ item.label }}
							</view>
						</scroll-view>
						<view
							class="dropdown-mask"
							v-show="isCSManagerFilter"
							@tap.stop="hideDropdownAndMask"
						></view>
					</view>
				</view>

				<!-- 侧边栏筛选弹出按钮 -->
				<view class="cu-item text-center">
					<image
						class="filter-icon"
						:src="picDomain + '/upload/yytApp/images/filters.png'"
						@tap="showDrawer"
					></image>
				</view>
			</view>

			<!-- ========================= 顶部筛选 END ========================= -->

			<!-- ========================= 预订概览 START ========================= -->
			<view class="overview uni-row uni-flex">
				<div class="item">
					<!-- 总收入 -->
					<text class="icon iconfont icon-zongjine text-blue"></text>
					<text class="text-black yyt-margin-left-small">{{ GetTodyBookSummaryOutData.feeSum | formatMoney }}</text>
					<text class="text-grey text-sm">(元)</text>
				</div>
				<div class="item">
					<!-- 总人数 -->
					<text class="icon iconfont icon-zongrenshu text-blue"></text>
					<text class="text-black yyt-margin-left-small">{{ GetTodyBookSummaryOutData.allBookPeopleNumSum }}</text>
					<text class="text-grey text-sm">(人)</text>
				</div>
				<div class="item">
					<!-- 总桌数 -->
					<text class="icon iconfont icon-zongzhuoshu text-blue"></text>
					<text class="text-black yyt-margin-left-small">{{ GetTodyBookSummaryOutData.allBookTableNumSum }}</text>
					<text class="text-grey text-sm">(桌)</text>
				</div>
			</view>
			<!-- ========================= 预订概览 END ========================= -->

			<!-- ========================= 订单状态 START ========================= -->
			<!-- tab导航 -->
			<scroll-view scroll-x class="tab-info-wrapper bg-white nav text-center">
				<view
					class="cu-item"
					:class="item.selected ? 'text-blue cur short yyt-font-weight' : 'text-dark-gray'"
					v-for="(item, index) in orderStatusArr"
					:key="index"
					@tap="orderStatusTabSelect($event, item)"
					:data-id="index"
				>
					{{ item.label }}
					<text class="text-sm">({{ item.num }})</text>
				</view>
			</scroll-view>
			<view class="tools-wrapper uni-flex uni-row yyt-flex-center" v-show="canICloseAll" @tap="allPass">
				<button class="cu-btn round bg-grey">一键关单</button>
				<!-- bg-blue实心按钮 line-blue 镂空按钮 -->
			</view>
			<!-- ========================= 订单状态 END ========================= -->
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
				<view
					class="yyt-customer-card uni-flex"
					v-for="(ct, index) in TodyBookData"
					:key="ct.bookOrderID"
					@tap="gotoOrderInfo(ct)"
				>
					<!-- 主要内容区 -->
					<view class="customer-main-wrapper uni-flex uni-row" style="margin-bottom: -10rpx;">
						<!-- 头像 -->
						<view class="avatar-wrapper" @tap.stop="gotoCustomInfo(ct)">
							<view
								class="cu-avatar xl round"
								:style="{ backgroundImage: getImgUrl(ct.headImg) }"
							></view>
							<!-- <view class="cs-pool-wrapper" v-if="ct.customerPoolMarketName">
								<image
									class="img"
									:src="picDomain + '/upload/yyticons/110019019_cs-icon.png'"
								></image>
								<text class="txt text-ellipsis-2">
									{{ ct.customerPoolMarketName.slice(0, 10) }}
								</text>
							</view> -->
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
								<view class="company-wrapper uni-flex uni-row yyt-margin-bottom-small" v-if="ct.bookOrderCompany">
									<text class="bg">
										<text class="icon iconfont icon-gongsi1 yyt-margin-right-small" style="color: #F3B040; font-size: 24rpx;"></text>
										<text class="company-name">{{ ct.bookOrderCompany }}</text>
									</text>
								</view>
								<view style="position: absolute; top: 10rpx; right: 10rpx;">
									<image
										v-if="ct.isClose == 1"
										class="status-img"
										:src="picDomain + '/upload/yytApp/reserve/yiguandan.png'"
									></image>
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
									<!-- <text>{{ct.saleForecastLastFollow.beginTime | parseTime}}</text> -->
									<text class="yyt-margin-left-bg">{{ ct.diningTypeName }}</text>
									<text class="yyt-margin-left-bg">{{ ct.bookTableNum }}桌</text>
									<text class="yyt-margin-left-bg">{{ ct.bookOrderTypeName }}</text>
								</view>
								<view class="wrapper">
									<text class="">{{ ct.bookNums }} 人</text>
									<!-- bug:5493 -->
									<text
										v-if="TodyBookQuery.isClose == 0 || TodyBookQuery.isClose == 1"
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
						<!-- 财务or有关单权限：把操作提前 -->
						<block v-if="$cw.isFinance()">
							<!-- 待关单才显示：关单和关单无绩效 -->
							<button
								v-show="orderStatusArr.filter(v => v.selected)[0].label == '待关单'"
								class="cu-btn round line-blue yyt-margin-right-small"
								@tap.stop="triggerMenu({value: 1, label: '关单'}, ct)"
							>
								关单
							</button>
							<button
								v-show="orderStatusArr.filter(v => v.selected)[0].label == '待关单'"
								class="cu-btn round line-blue yyt-margin-right-small"
								@tap.stop="triggerMenu({value: 2, label: '关单(无绩效)'}, ct)"
							>
								关单(无绩效)
							</button>
							<button
								v-show="orderStatusArr.filter(v => v.selected)[0].label == '已关单'"
								class="cu-btn round line-blue yyt-margin-right-small"
								@tap.stop="triggerMenu({value: 0, label: '取消关单'}, ct)"
							>
								取消关单
							</button>
						</block>
						<!-- 如果不是财务才能显示（发信息，电话，记录） -->
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
						<!-- 如果是财务，会导致按钮被挤，所以在「是财务，并且是待关单情况下」条件下，不信啊是记录，否则显示 -->
						<button
							v-if="!($cw.isFinance() && orderStatusArr.filter(v => v.selected)[0].label == '待关单')"
							class="cu-btn round line-blue yyt-margin-right-small"
							@tap.stop="gotoRecord(ct)"
						>
							记录
						</button>
						<!-- bg-blue实心按钮 line-blue 镂空按钮 -->
						<!-- 现在变成财务时，把邀请放气泡，不是财务；不显示气泡菜单 -->
						<view @tap.stop="">
							<!-- <yyt-bubble-menu v-if="dyncMoreList2.length > 0" :list="dyncMoreList2" :extraData="ct" @selectMenu="triggerMenu"></yyt-bubble-menu> -->
							<view class="more-wrapper">
								<view class="bubble-list" v-show="ct.isShowBubble">
									<view
										v-if="$cw.isFinance() && orderStatusArr.filter(v => v.selected)[0].label == '待关单'"
										class="bubble-item text-blue"
										@click.stop="triggerMenu({value: 'record', label: '记录'}, ct)"
									>记录</view>
									<!-- 待关单 / 已关单 显示邀请评价 -->
									<view
										v-if="orderStatusArr.filter(v => v.selected)[0].label != '未结账'"
										class="bubble-item text-blue"
										@click.stop="triggerMenu({value: 'wx-evaluation', label: '邀请评价'}, ct)"
									>邀请评价</view>
									<!-- 未关单 显示发送邀请函 -->
									<view
										v-if="orderStatusArr.filter(v => v.selected)[0].label == '未结账'"
										class="bubble-item text-blue"
										@click.stop="triggerMenu({value: 'wx-invitation', label: '发送邀请函'}, ct)"
									>发送邀请函</view>
								</view>
								<uni-icons type="more-filled" size="40r" color="#9c9c9c" @click="triggleList(ct)"></uni-icons>
							</view>
						</view>
						<!-- <button
							v-if="!$cw.isFinance()"
							class="cu-btn round line-blue yyt-margin-right-small"
							@tap.stop="gotoMiniP(ct, 'wx-invitation')"
						>
							发送邀请函
						</button>
						<button
							v-if="!$cw.isFinance()"
							class="cu-btn round line-blue yyt-margin-right-small"
							@tap.stop="gotoMiniP(ct, 'wx-evaluation')"
						>
							邀请评价
						</button> -->
						<!-- bg-blue实心按钮 line-blue 镂空按钮 -->
						<!-- 是财务，则显示下面三个按钮 -->
						<!-- 最新：按钮显示不下，财务按钮放进三个点里 -->
						<!-- <button
							v-if="calcTheToolbarIsDisplayed('关单')"
							class="cu-btn round line-blue yyt-margin-right-small"
							@tap.stop="closeSingle(ct, 1)"
						>
							关单
						</button> -->
						<!-- bg-blue实心按钮 line-blue 镂空按钮 -->
						<!-- <button
							v-if="calcTheToolbarIsDisplayed('关单(无绩效)')"
							class="cu-btn round line-blue yyt-margin-right-small"
							@tap.stop="closeSingle(ct, 2)"
						>
							关单(无绩效)
						</button> -->
						<!-- bg-blue实心按钮 line-blue 镂空按钮 -->
						<!-- <button
							v-if="calcTheToolbarIsDisplayed('取消关单')"
							class="cu-btn round line-blue yyt-margin-right-small"
							@tap.stop="closeSingle(ct, 0)"
						>
							取消关单
						</button> -->
					</view>
				</view>
			</view>
		</mescroll-uni>
		<!-- ========================= 列表 END ========================= -->

		<!-- ========================= 侧边栏 START ========================= -->
		<!-- ====================== 抽屉开始 ================================ -->
		<uni-drawer class="yyt-sidebar-wrapper" :visible="isShowSidebar" @close="closeDrawer" mode="right">
			<scroll-view scroll-y="true" class="scroll-view-wrapper">
				<view class="scroll-inner-wrapper">
					<view class="conditions-item">
						<view class="title-wrapper" @tap="gotoTagsPage">
							<text class="title">标签</text>
							<view class="arrow-wrapper">
								<sw-icon :size="20" class="uni-icon-wrapper" color="#bbb" type="arrowright" />
							</view>
						</view>
						<view class="content">
							<view class="tag-select-wrapper uni-flex uni-column">
								<view class="title">已选：</view>
								<view class="tags-content">{{ currentReserveTagsObj.content }}</view>
							</view>
						</view>
					</view>

					<view class="conditions-item" v-if="orderType.length > 0">
						<view class="title-wrapper">
							<text class="title">类型</text>
							<!-- <view class="arrow-wrapper"><sw-icon :size="20" class="uni-icon-wrapper" color="#bbb" type="arrowright" /></view> -->
						</view>
						<view class="content">
							<view
								v-for="(item, index) in orderType"
								:key="index"
								class="cu-tag round"
								:class="[
									filterQuery.bookOrderTypeType == item.value ? 'bg-blue' : 'line-blue'
								]"
								@tap="selectOrderType(item)"
							>
								{{ item.label }}
							</view>
						</view>
					</view>
				</view>
			</scroll-view>
			<!-- 底部按钮 -->
			<view class="sidebar-btn-fixed">
				<button class="cu-btn round lg line-blue" @tap="resetSidebar">重置</button>
				<!-- bg-blue实心按钮 line-blue 镂空按钮 -->
				<button class="cu-btn round lg bg-blue" @tap="confirmSidebar">完成</button>
				<!-- bg-blue实心按钮 line-blue 镂空按钮 -->
			</view>
		</uni-drawer>
		<!-- ========================= 侧边栏 END ========================= -->
	</view>
</template>
<script>
export { default } from './todayBook.js';
</script>
<style lang="less" scoped>
@import url('todayBook.less');
</style>
