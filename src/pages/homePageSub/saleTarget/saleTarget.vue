<template>
	<view id="wheel_box" class="sale-target">
		<z-nav-bar title="完成目标" bgColor="#0782ff" fontColor="#FFF"><sw-icon type="back" size="27" slot="left" @tap="goBack" color="#FFF"></sw-icon></z-nav-bar>
		<view class="top-filter-wrapper yyt-margin-top-bg yyt-margin-bottom-small" ref="topWrapperRef">
			<!-- 顶部filter -->
			<view class="bg-white nav uni-flex nav-filter">
				<!-- 客户经理筛选 -->
				<view class="cu-item text-center">
					<view class="flex yyt-flex-center yyt-h-100" @tap.stop="CSManagerFilterToggle">
						<block v-if="isAllSee">
							<text>{{ SaleTargetQuery.searchType == 1 ? currentFollow.label : currentSales }}</text>
						</block>
						<text v-else>{{ currentFollow.label }}</text>
						<!-- <uni-icons  type="arrowdown" size="35r" color="#0183FF"></uni-icons> -->
						<image class="img" style="width: 28rpx;" :src="picDomain + '/upload/yytApp/my/down.png'" mode=""></image>
					</view>

					<view class="dropdown-panel" v-show="isCSManagerFilter" style="box-shadow: 0 -2px 2px #f1f1f1;">
						<scroll-view scroll-y="true" style="max-height: 28vh;">
							<view
								v-for="(item, index) in changeMarketData"
								:key="index"
								:class="['dropdown-item', item.selected ? 'dropdown-item-sel' : '']"
								@tap="chooseSales(item, index)"
							>
								{{ item.label }}
							</view>
						</scroll-view>
						<view class="dropdown-mask" v-show="isCSManagerFilter" @tap.stop="hideDropdownAndMask"></view>
					</view>
				</view>
				<!-- 时间筛选 -->
				<view class="cu-item text-center date-filter">
					<view class="dateSelect">
						<view class="toLeft margin-right uni-flex yyt-flex-center" @tap="getPre">
							<image class="yyt-tiny-img" :src="picDomain + '/upload/yytApp/reserve/arrow-left.png'" mode=""></image>
						</view>
						<picker mode="date" fields="month" class="flex1" :value="SaleTargetQuery.month" @change="chooseDate">
							<view class="monthtime-month-text uni-flex yyt-flex-center">
								<image class="yyt-normal-img yyt-margin-right-small" :src="picDomain + '/upload/yytApp/home/date.png'" mode=""></image>
								<text>{{ SaleTargetQuery.month }}</text>
							</view>
						</picker>
						<view class="toRight margin-left uni-flex yyt-flex-center" @tap="getNext">
							<image class="yyt-tiny-img" :src="picDomain + '/upload/yytApp/reserve/arrow-right.png'" mode=""></image>
						</view>
					</view>
				</view>
			</view>
		</view>

		<scroll-view scroll-y="true" class="scroll-view-wrapper main">
			<view v-if="!isList" class="cur-seller-bar uni-flex">
				<view class="monthly-target">
					<text>
						月目标完成情况
						<text class="cur yyt-margin-left-bg">{{ targetNum.number }}</text>
						<text class="total text-gray">/{{ targetNum.total }}</text>
					</text>
				</view>
				<!-- <view class="customer-number">
					<text>客户池数量<text class="yyt-margin-left-bg num">{{ customNum }}</text></text>
				</view> -->
			</view>

			<view class="wheel_box">
				<swiper style="height: 351rpx;">
					<!-- 轮盘 -->
					<swiper-item>
						<view class="wheel_text">
							<view class="total_follow">
								<view>总跟踪数/月</view>
								<view class="d-flex justify-center align-center">{{ followData.totalFollow.target || 0 }}</view>
							</view>
							<view class="common_follow dinner_follow">
								<view>
									<text class="yyt-font-weight text-lg">{{ followData.banquetFollow.current }}</text>
									<text class="text-sm text-gray">/{{ followData.banquetFollow.target ? followData.banquetFollow.target : 0 }}</text>
								</view>
								<view>宴会跟踪</view>
							</view>
							<view class="common_follow custom_follow">
								<view>
									<text class="yyt-font-weight text-lg">{{ followData.customFollow.current }}</text>
									<text class="text-sm text-gray">/{{ followData.customFollow.target ? followData.customFollow.target : 0 }}</text>
								</view>
								<view>客户跟踪</view>
							</view>
						</view>
						<view class="wheel_main">
							<view class="wheel_legend">
								<view class="wheel_legend_left">
									<view
										class="wheel_legend_left"
										style="border-color:#FF4E00;transform:rotate(37deg) translate3D(-100%, -100%, 0);transform-origin: 0% 0%"
									></view>
								</view>
								<view class="wheel_legend_right">
									<view class="wheel_legend_right" style="border-color:#FF4E00;transform:rotate(-37deg) translate3D(0, -100%, 0);transform-origin: 0% 0%"></view>
								</view>
								<span class="wheel_line_shot" style="transform: rotate(-72deg);background:#FFAE00;"></span>
								<span class="wheel_line_long" style="transform: rotate(-54deg);"></span>
								<span class="wheel_line_shot" style="transform: rotate(-36deg);"></span>
								<span class="wheel_line_shot" style="transform: rotate(-18deg);"></span>
								<span class="wheel_line_shot" style="transform: rotate(0);"></span>
								<span class="wheel_line_shot" style="transform: rotate(18deg);"></span>
								<span class="wheel_line_shot" style="transform: rotate(36deg);"></span>
								<span class="wheel_line_long" style="transform: rotate(54deg);"></span>
								<span class="wheel_line_shot" style="transform: rotate(72deg);background:#FF0000;"></span>
								<view class="wheel_inner">
									<view class="wheel_line_triangle" :style="wheelRotate"><view class="wheel_triangle"></view></view>
									<view class="wheel_inner_text">
										<span style="left:-68rpx;">低</span>
										<span style="top:-68rpx;right:50%;transform:translateX(50%);">中</span>
										<span style="right:-68rpx;">高</span>
										<view style="color: transparent;">已处理数</view>
										<view style="color:transparent;font-weight:bold;font-size:28rpx;">{{ followData.totalFollow.current }}</view>
									</view>
								</view>
							</view>
						</view>
						<view class="bottom-center">
							<view class="center">
								<view class="text">已处理数</view>
								<view class="num">{{ followData.totalFollow.current }}</view>
							</view>
						</view>
					</swiper-item>
					<!-- 主动跟踪 -->
					<swiper-item v-if="shopRecomData.storeData">
						<view class="carousel_com_item">
							<view class="carousel_com_head" v-if="allShop">
								<span class="carousel_left_title">{{ new Date(SaleTargetQuery.month).getMonth() + 1 }}月主动跟踪</span>
							</view>
							<view class="current_mon_detail" v-if="allShop">
								<view class="current_mon_left">
									<view class="current_mon_top">
										<span>当月跟踪效果</span>
										<i v-on:click="showDetail(1, false)">
											<i>转化明细</i>
											<i>></i>
										</i>
									</view>
									<view class="current_mon_mid">
										<view>
											<view>{{ shopRecomData.storeData.followStoreFollowCount }}</view>
											<view>总跟踪</view>
										</view>
										<view v-on:click="getBookingOrderDetail(SaleTargetQuery.month, SaleTargetQuery.searchType, '主动')">
											<view>{{ shopRecomData.storeData.followStoreRs }}</view>
											<view>总到店</view>
										</view>
									</view>
									<view class="current_left_bottom">
										<view>
											<span>{{ (shopRecomData.storeData.followStoreZhl * 100).toFixed(2) }}%</span>
										</view>
										<view>转化率</view>
									</view>
								</view>
								<view class="current_mon_right">
									<view class="current_mon_right-item">
										<view class="current_mon_top"><span>当月转化结果</span></view>
										<view class="current_mon_mid">
											<view>
												<view>{{ shopRecomData.storeData.changeStoreZs }}</view>
												<view>桌数</view>
											</view>
											<view v-on:click="getBookingOrderDetail(SaleTargetQuery.month, currentFollow.text, '主动')">
												<view>{{ shopRecomData.storeData.changeStoreZhAmount | currencyW }}</view>
												<view>金额</view>
											</view>
										</view>
									</view>
									<view class="current_mon_right-item">
										<view class="current_mon_top"><span>累计转化结果</span></view>
										<view class="current_mon_mid">
											<view>
												<view>{{ shopRecomData.storeData.changeStoreALLZs }}</view>
												<view>桌数</view>
											</view>
											<view>
												<view>{{ shopRecomData.storeData.changeStoreZhAllAmount | currencyW }}</view>
												<view>金额</view>
											</view>
										</view>
									</view>
								</view>
							</view>

							<view class="carousel_com_head" v-if="!allShop">
								<span class="carousel_left_title">{{ new Date(SaleTargetQuery.month).getMonth() + 1 }}月主动跟踪</span>
								<span>
									转化率：
									<span>{{ (shopRecomData.storeTableData.zhl * 100).toFixed(2) }}%</span>
								</span>
								<span v-on:click="showDetail(1, true)">收起</span>
							</view>
							<table class="coursel_table" v-if="!allShop">
								<tbody>
									<tr class="coursel_table_head">
										<th>月份</th>
										<th>到店</th>
										<th>金额</th>
										<th>桌数</th>
										<th>人均</th>
									</tr>
									<tr class="coursel_table_mid" v-for="(item, index) in shopRecomData.storeTableData.followDatas" :key="`storeTableData${index}`">
										<td>{{ item.intMonth }}月</td>
										<td>{{ item.followRs }}</td>
										<td>{{ item.followAmount }}</td>
										<td>{{ item.followZs }}</td>
										<td>{{ item.followRj.toFixed(2) }}</td>
									</tr>
									<tr v-if="shopRecomData.storeTableData.summaryData" class="coursel_table_bottom">
										<td>总计</td>
										<td>{{ shopRecomData.storeTableData.summaryData.followRs }}</td>
										<td>{{ shopRecomData.storeTableData.summaryData.followAmount }}</td>
										<td>{{ shopRecomData.storeTableData.summaryData.followZs }}</td>
										<td>{{ shopRecomData.storeTableData.summaryData.followRj.toFixed(2) }}</td>
									</tr>
									<tr v-else>
										<td>总计</td>
										<td>无</td>
										<td>无</td>
										<td>无</td>
										<td>无</td>
									</tr>
								</tbody>
							</table>
						</view>
					</swiper-item>
					<!-- 推荐跟踪 -->
					<swiper-item v-if="shopRecomData.tjData">
						<view class="carousel_com_item">
							<view class="carousel_com_head" v-if="recommend">
								<span class="carousel_left_title">{{ new Date(SaleTargetQuery.month).getMonth() + 1 }}月推荐跟踪</span>
							</view>
							<view class="current_mon_detail" v-if="recommend">
								<view class="current_mon_left">
									<view class="current_mon_top">
										<span>当月跟踪效果</span>
										<i v-on:click="showDetail(2, false)">
											<i>转化明细</i>
											<i>></i>
										</i>
									</view>
									<view class="current_mon_mid">
										<view>
											<view>{{ shopRecomData.tjData.followYYTTjCount }}</view>
											<view>共推荐</view>
										</view>
										<view>
											<view>{{ shopRecomData.tjData.followYYTFollowCount }}</view>
											<view>总跟踪</view>
										</view>
										<view v-on:click="getBookingOrderDetail(SaleTargetQuery.month, SaleTargetQuery.searchType, '推荐')">
											<view>{{ shopRecomData.tjData.followYYTRs }}</view>
											<view>总到店</view>
										</view>
									</view>
									<view class="current_left_bottom">
										<view>
											<span>{{ (shopRecomData.tjData.followYYTZhl * 100).toFixed(2) }}%</span>
										</view>
										<view>转化率</view>
									</view>
								</view>
								<view class="current_mon_right">
									<view class="current_mon_right-item">
										<view class="current_mon_top"><span>当月转化结果</span></view>
										<view class="current_mon_mid">
											<view>
												<view>{{ shopRecomData.tjData.changeYYTZs }}</view>
												<view>桌数</view>
											</view>
											<view v-on:click="getBookingOrderDetail(SaleTargetQuery.month, currentFollow.text, '推荐')">
												<view>{{ shopRecomData.tjData.changeYYTZhAmount | currencyW }}</view>
												<view>金额</view>
											</view>
										</view>
									</view>
									<view class="current_mon_right-item">
										<view class="current_mon_top"><span>累计转化结果</span></view>
										<view class="current_mon_mid">
											<view>
												<view>{{ shopRecomData.tjData.changeYYTALLZs }}</view>
												<view>桌数</view>
											</view>
											<view>
												<view>{{ shopRecomData.tjData.changeYYTZhAllAmount | currencyW }}</view>
												<view>金额</view>
											</view>
										</view>
									</view>
								</view>
							</view>
							<view class="carousel_com_head" v-if="!recommend">
								<span class="carousel_left_title">{{ new Date(SaleTargetQuery.month).getMonth() + 1 }}月推荐跟踪</span>
								<span>
									转化率：
									<span>{{ (shopRecomData.tjTableData.zhl * 100).toFixed(2) }}%</span>
								</span>
								<span v-on:click="showDetail(2, true)">收起</span>
							</view>
							<table class="coursel_table" v-if="!recommend">
								<tbody>
									<tr class="coursel_table_head">
										<th>月份</th>
										<th>到店</th>
										<th>金额</th>
										<th>桌数</th>
										<th>人均</th>
									</tr>
									<tr class="coursel_table_mid" v-for="(item, index) in shopRecomData.tjTableData.followDatas" :key="`tjTableData${index}`">
										<td>{{ item.intMonth }}月</td>
										<td>{{ item.followRs }}</td>
										<td>{{ item.followAmount }}</td>
										<td>{{ item.followZs }}</td>
										<td>{{ item.followRj.toFixed(2) }}</td>
									</tr>
									<tr v-if="shopRecomData.tjTableData.summaryData" class="coursel_table_bottom">
										<td>总计</td>
										<td>{{ shopRecomData.tjTableData.summaryData.followRs }}</td>
										<td>{{ shopRecomData.tjTableData.summaryData.followAmount }}</td>
										<td>{{ shopRecomData.tjTableData.summaryData.followZs }}</td>
										<td>{{ shopRecomData.tjTableData.summaryData.followRj.toFixed(2) }}</td>
									</tr>
									<tr v-else>
										<td>总计</td>
										<td>无</td>
										<td>无</td>
										<td>无</td>
										<td>无</td>
									</tr>
								</tbody>
							</table>
						</view>
					</swiper-item>
				</swiper>
			</view>

			<view class="list_contsiner" style="min-height: 300px;">
				<view v-if="isList" id="sale_list">
					<view class="cs-card" v-for="(item, index) in totalSales" :key="`totalSales${index}`" @tap="goSaleDetail(item.marketerID, item.saleName)">
						<view class="avatar-wrapper">
							<view class="cu-avatar xl round" :style="{ backgroundImage: 'url(' + getSalesImg(item) + ')' }"></view>
							<view class="avatar-name yyt-margin-top-small">{{ item.saleName }}</view>
						</view>
						<view class="data-wrapper">
							<view class="data-item">
								<view class="title">跟踪处理数</view>
								<view class="content progress-wrapper">
									<yyt-progress :isShowDateRate="SaleTargetQuery.month==$moment().format('YYYY-MM')" :percent="item.customFollowCountCurrent == 0 ? 0 : (100 * item.customFollowCountCurrent) / item.customFollowCountTarget" />
									<view class="progress-text">
										<view>
											<text class="cur">{{ item.customFollowCountCurrent }}</text>
											<text class="total">/{{ item.customFollowCountTarget ? item.customFollowCountTarget : 0 }}位</text>
										</view>
									</view>
								</view>
							</view>
							<view class="data-item">
								<view class="title">桌数</view>
								<view class="content progress-wrapper">
									<yyt-progress :isShowDateRate="SaleTargetQuery.month==$moment().format('YYYY-MM')" :percent="item.customTableCountCurrent == 0 ? 0 : (100 * item.customTableCountCurrent) / item.customTableCountTarget" />
									<view class="progress-text">
										<view>
											<text class="cur">{{ item.customTableCountCurrent }}</text>
											<text class="total">/{{ item.customTableCountTarget ? item.customTableCountTarget : 0 }}桌</text>
										</view>
									</view>
								</view>
							</view>
							<view class="data-item">
								<view class="title">销售额</view>
								<view class="content progress-wrapper">
									<yyt-progress :isShowDateRate="SaleTargetQuery.month==$moment().format('YYYY-MM')" :percent="item.saleAmountCurrent == 0 ? 0 : (100 * item.saleAmountCurrent) / item.customFollowCountTarget" />
									<view class="progress-text">
										<view>
											<text class="cur">{{ item.saleAmountCurrent | formatMoney }}</text>
											<text class="total">/{{ item.saleAmountTarget ? item.saleAmountTarget : 0 | formatMoney }}元</text>
										</view>
									</view>
								</view>
							</view>
						</view>
					</view>
				</view>

				<view v-if="!isList" class="completion_fooer" id="completion_fooer">
					<!-- <view class="card">
						<view class="item">
							<view class="title">时间进度</view>
							<view class="content progress-wrapper">
								<progress class="progress-bar" :percent="currentMonthSchedule" border-radius="8" activeColor="#0183ff" active stroke-width="6" />
								<view class="progress-text">
									<text class="cur">{{currentMonthSchedule}}%</text>
								</view>
							</view>
						</view>
					</view> -->
					<view class="card">
						<block v-for="item in targetData.customerArr" :key="item.name">
							<view
								class="item"
								v-if="item.name == '客户月销售额' || item.name == '客户桌数' || item.name == '客户桌均' || item.name == '客户人均'"
								:style="{ order: item.order }"
							>
								<view class="title" :class="item.target && item.current >= item.target ? 'active' : ''">{{ item.name }}</view>
								<view class="content progress-wrapper" v-if="item.target">
									<yyt-progress :isShowDateRate="SaleTargetQuery.month==$moment().format('YYYY-MM')" :percent="item.current == 0 ? 0 : (100 * item.current) / item.target" />
									<view class="progress-text">
										<view v-if="item.unit === '元'">
											<text class="cur">{{ item.current | formatMoney }}</text>
											<text class="total">/{{ item.target ? item.target : 0 | formatMoney }}{{ item.unit }}</text>
										</view>
										<view v-else>
											<text class="cur">{{ item.current }}</text>
											<text class="total">/{{ item.target ? item.target : 0 }}{{ item.unit }}</text>
										</view>
									</view>
								</view>
								<view v-else class="content .num-wrapper">
									<view v-if="item.unit === '元'">
										<text class="uni-bold">{{ item.current | formatMoney }}</text>
										<text class="text-sm text-gray">{{ item.unit }}</text>
									</view>
									<view v-else>
										<text class="uni-bold">{{ item.current }}</text>
										<text class="text-sm text-gray">{{ item.unit }}</text>
									</view>
								</view>
							</view>
						</block>
					</view>

					<view class="card">
						<block v-for="item in targetData.banquetArr" :key="item.name">
							<view class="item" v-if="item.name == '宴会月销售额' || item.name == '宴会桌数' || item.name == '宴会桌均'" :style="{ order: item.order }">
								<view class="title" :class="item.target && item.current >= item.target ? 'active' : ''">{{ item.name }}</view>
								<view class="content progress-wrapper" v-if="item.target">
									<yyt-progress :isShowDateRate="SaleTargetQuery.month==$moment().format('YYYY-MM')" :percent="item.current == 0 ? 0 : (100 * item.current) / item.target" />
									<view class="progress-text">
										<view v-if="item.unit === '元'">
											<text class="cur">{{ item.current | formatMoney }}</text>
											<text class="total">/{{ item.target ? item.target : 0 | formatMoney }}{{ item.unit }}</text>
										</view>
										<view v-else>
											<text class="cur">{{ item.current }}</text>
											<text class="total">/{{ item.target ? item.target : 0 }}{{ item.unit }}</text>
										</view>
									</view>
								</view>
								<view v-else class="content .num-wrapper">
									<view v-if="item.unit === '元'">
										<text class="uni-bold">{{ item.current | formatMoney }}</text>
										<text class="text-sm text-gray">{{ item.unit }}</text>
									</view>
									<view v-else>
										<text class="uni-bold">{{ item.current }}</text>
										<text class="text-sm text-gray">{{ item.unit }}</text>
									</view>
								</view>
							</view>
						</block>
					</view>

					<!-- <view class="card">
						<block v-for="item in targetData.individualArr" :key="item.name">
							<view
								class="item"
								v-if="item.name == '散客月销售额' || item.name == '散客桌数' || item.name == '散客桌均' || item.name == '散客人均'"
								:style="{ order: item.order }"
							>
								<view class="title" :class="item.target && item.current >= item.target ? 'active' : ''">{{ item.name }}</view>
								<view class="content progress-wrapper" v-if="item.target">
									<progress
										class="progress-bar"
										:percent="item.current == 0 ? 0 : (100 * item.current) / item.target"
										border-radius="8"
										activeColor="#0183ff"
										active
										stroke-width="6"
									/>
									<view class="progress-text">
										<view v-if="item.unit === '元'">
											<text class="cur">{{ item.current | formatMoney }}</text>
											<text class="total">/{{ item.target ? item.target : 0 | formatMoney }}{{ item.unit }}</text>
										</view>
										<view v-else>
											<text class="cur">{{ item.current }}</text>
											<text class="total">/{{ item.target ? item.target : 0 }}{{ item.unit }}</text>
										</view>
									</view>
								</view>
								<view v-else class="content .num-wrapper">
									<view v-if="item.unit === '元'">
										<text class="uni-bold">{{ item.current | formatMoney }}</text>
										<text class="text-sm text-gray">{{ item.unit }}</text>
									</view>
									<view v-else>
										<text class="uni-bold">{{ item.current }}</text>
										<text class="text-sm text-gray">{{ item.unit }}</text>
									</view>
								</view>
							</view>
						</block>
					</view> -->

					<view class="card">
						<block v-for="item in targetData.poolArr" :key="item.name">
							<!-- <view class="item" v-if="
								item.name == '客户池到店比例'" :style="{order: item.order}">
								<view class="title">{{item.name}}</view>
								<view class="content progress-wrapper">
									<progress
										class="progress-bar"
										:percent="item.current == 0 ? 0 : (100 * item.current) / item.total"
										border-radius="8"
										activeColor="#0183ff"
										active
										stroke-width="6"
									/>
									<view class="progress-text">
										<view>
											<text class="cur">{{item.current}}</text>
											<text class="total">/{{item.target ? item.target : 0}}{{item.unit}}</text>
										</view>
									</view>
								</view>
							</view> -->
							<view
								class="item"
								v-if="
									item.name == '客户池到店比例' || item.name == '新客户数量' || item.name == '跟踪处理数' || item.name == '客户数量' || item.name == '客户整理数'
								"
								:style="{ order: item.order }"
							>
								<view class="title" :class="item.target && item.current >= item.target ? 'active' : ''">{{ item.name }}</view>
								<view class="content progress-wrapper" v-if="item.target">
									<yyt-progress :isShowDateRate="SaleTargetQuery.month==$moment().format('YYYY-MM')" :percent="item.current == 0 ? 0 : (100 * item.current) / item.target" />
									<view class="progress-text">
										<view v-if="item.unit === '元'">
											<text class="cur">{{ item.current | formatMoney }}</text>
											<text class="total">/{{ item.target ? item.target : 0 | formatMoney }}{{ item.unit }}</text>
										</view>
										<view v-else>
											<text class="cur">{{ item.current }}</text>
											<text class="total">/{{ item.target ? item.target : 0 }}{{ item.unit }}</text>
										</view>
									</view>
								</view>
								<view v-else class="content .num-wrapper">
									<view v-if="item.unit === '元'">
										<text class="uni-bold">{{ item.current | formatMoney }}</text>
										<text class="text-sm text-gray">{{ item.unit }}</text>
									</view>
									<view v-else>
										<text class="uni-bold">{{ item.current }}</text>
										<text class="text-sm text-gray">{{ item.unit }}</text>
									</view>
								</view>
							</view>
						</block>
					</view>

					<view class="card">
						<block v-for="item in targetData.memberArr" :key="item.name">
							<view
								class="item"
								v-if="item.name == '会员新开卡数' || item.name == '储值量' || item.name == '储值额' || item.name == '消费人数'"
								:style="{ order: item.order }"
							>
								<view class="title" :class="item.target && item.current >= item.target ? 'active' : ''">{{ item.name }}</view>
								<view class="content progress-wrapper" v-if="item.target">
									<yyt-progress :isShowDateRate="SaleTargetQuery.month==$moment().format('YYYY-MM')" :percent="item.current == 0 ? 0 : (100 * item.current) / item.target" />
									<view class="progress-text">
										<view v-if="item.unit === '元'">
											<text class="cur">{{ item.current | formatMoney }}</text>
											<text class="total">/{{ item.target ? item.target : 0 | formatMoney }}{{ item.unit }}</text>
										</view>
										<view v-else>
											<text class="cur">{{ item.current }}</text>
											<text class="total">/{{ item.target ? item.target : 0 }}{{ item.unit }}</text>
										</view>
									</view>
								</view>
								<view v-else class="content .num-wrapper">
									<view v-if="item.unit === '元'">
										<text class="uni-bold">{{ item.current | formatMoney }}</text>
										<text class="text-sm text-gray">{{ item.unit }}</text>
									</view>
									<view v-else>
										<text class="uni-bold">{{ item.current }}</text>
										<text class="text-sm text-gray">{{ item.unit }}</text>
									</view>
								</view>
							</view>
						</block>
					</view>
				</view>
				<view class="logo-bottom">
					<view style="width: 80rpx; height: 2rpx; margin-right: 10rpx; background: rgba(191,191,191,1);"></view>
					<image :src="picDomain + '/upload/yytApp/images/logo-bottom.png'" style="width: 80rpx; height: 40rpx;"></image>
					<view style="width: 80rpx; height: 2rpx; margin-left: 10rpx; background: rgba(191,191,191,1);"></view>
				</view>
			</view>
		</scroll-view>
	</view>
</template>

<script>
export { default } from './saleTarget.js';
</script>

<style lang="less" scoped>
@import './saleTarget.less';
</style>
