<template>
	<view class="container" :style="{ overflow: ready ? 'none' : 'hidden' }">
		<div id="sw-mask" ref="mask" v-show="floorsSelectShow" @tap.stop="hideMask"></div>
		<!-- 楼层选择悬浮列表 -->
		<view class="floor-list" v-if="floorsSelectShow">
			<!-- 全部 -->
			<!-- <view class="floor-cell all" @tap="selectFloor(-1, _, true)">
				<text>全部(</text>
				<text class="span">{{ areasAll.activeCount }}</text>
				<text>/{{ areasAll.allCount }})</text>
			</view> -->
			<!-- 列表 -->
			<view class="floor-cell" v-for="(item, index) in areatbs" :key="index" :data-table-area-id="item.tableAreaID" @tap="selectFloor(index, _, true)">
				<text :class="index === pickerData.curFloorIdx ? 'text-blue' : ''">{{ item.name }}(</text>
				<text class="span">{{ item.tableNumber }}</text>
				<text>/{{ item.sumCount }})</text>
			</view>
		</view>

		<!-- 顶部选择menu -->
		<view class="menu">
			<!-- 时间 -->
			<view class="menu-item date-picker">
				<!-- <text class="cuIcon-form text-blue" style="padding-right: 5px;"></text>
				{{ pickerData.date }} -->
				<view class="toLeft yyt-extend-area" @tap="rightCallback">
					<image class="yyt-small-img" src="https://pic.cwyyt.cn/upload/yyticons/1311151115_下拉@2x.png" mode=""></image>
				</view>
				<text @tap="popPickerModal">{{ pickerData.date }}</text>
				<view class="toRight yyt-extend-area" @tap="leftCallBack">
					<image class="yyt-small-img" src="https://pic.cwyyt.cn/upload/yyticons/1311151115_下拉@2x.png" mode=""></image>
				</view>
			</view>
			<!-- 餐别 -->
			<view class="menu-item meals-picker">
				<scroll-view v-if="mealsType.length > 3" scroll-x class="bg-white nav" scroll-with-animation :scroll-left="scrollLeft" style="max-width: 230rpx;">
					<view class="cu-item" :class="index == curMealIdx ? 'text-blue cur' : ''" v-for="(item, index) in mealsType" :key="index" @tap="mealSelect" :data-id="index">
						{{ item.name }}
					</view>
				</scroll-view>
				<scroll-view v-else scroll-x class="bg-white nav text-center" style="max-width: 230rpx;">
					<view class="cu-item" :class="index == curMealIdx ? 'text-blue cur' : ''" v-for="(item, index) in mealsType" :key="index" @tap="mealSelect" :data-id="index">
						{{ item.name }}
					</view>
				</scroll-view>
			</view>
			<!-- 楼层 -->
			<view class="menu-item floors-picker" @tap="triggerFloors">
				<text class="cur-floor-name" v-if="areatbs.length > 0">
					{{ areatbs[pickerData.curFloorIdx].name }}(
					<text class="span">{{ areatbs[pickerData.curFloorIdx].tableNumber }}</text>
					/{{ areatbs[pickerData.curFloorIdx].sumCount }})
				</text>
				<text v-else>{{ areaIsLoaded ? '暂无数据' : '加载中...' }}</text>
				<text class="cuIcon-unfold text-blue" style="padding-left: 5px;"></text>
			</view>
		</view>
		<!-- 骨架屏 -->
		<yyt-st-skeleton :show="!ready" :top="100">
			<!-- 卓台展示 -->
			<view class="table-list">
				<mescroll-uni
					:down="downOption"
					@down="downCallback"
					:up="upOption"
					@up="upCallback"
					:top="200"
					@scroll="scrollChg"
					:bottom="50"
					:left="leftOption"
					@left="leftCallBack"
					:right="rigthOption"
					@right="rightCallback"
				>
					<swiper :style="{ height: scrollHeight + 'px' }" @transition="swiperTransition" @animationfinish="swiperFinish">
						<swiper-item>
							<view class="table-wrapper clearfix inner-content">
								<block v-for="(areaItem, areaIndex) in areatbs.filter(x => !x.isAllArea)" :key="areaIndex">
									<!-- 全部的是才展示区域 -->
									<view class="area-name" style="clear: both; color: #868686;" v-if="pickerData.curFloorIdx === 0">{{ areaItem.name }}</view>
									<!-- 桌台 table 列表 -->
									<!-- <view class="table-info preventEvent" v-for="(table, index) in items.filter(x => x.areaID == areaItem.tableAreaID)" :key="index" @tap="chooseTable(table)" @touchstart="handleTouchStart($event, table)" @touchmove="handleTouchMove" @longpress="handleLongpress($event, table)"> -->
									<!-- <view class="table-info preventEvent" :class="{ 'lock-bg': table.orderList && table.orderList.length == 0 && table.tableIsLock }" v-for="(table, index) in items.filter(x => x.areaID == areaItem.tableAreaID)" :key="index" @tap="chooseTable(table)" @touchstart="handleTouchStart($event, table)" @touchmove="handleTouchMove" @touchend="handleTouchEnd"> -->
									<view
										class="table-info preventEvent"
										:class="{ 'lock-bg': table.orderList && table.orderList.length == 0 && table.tableIsLock }"
										v-for="(table, index) in items.filter(x => x.areaID == areaItem.tableAreaID)"
										:key="index"
										@tap="chooseTable(table)"
										@touchstart="handleTouchStart($event, table)"
										@touchmove="handleTouchMove"
										v-longpress="handleLongpress"
									>
										<!-- <view class="table-info preventEvent" v-for="(table, index) in items.filter(x => x.areaID == areaItem.tableAreaID)" :key="index" @tap="chooseTable(table)" @touchstart="handleTouchStart($event, table)" @touchmove="handleTouchMove" v-longpress:handlePress="table"> -->
										<view class="table-name" :class="{ hiden: table.orderList && table.orderList.length == 0 }">
											{{ table.tableName }}
											<view v-if="table.orderList && table.orderList.length == 0 && table.tableIsLock" class="icon iconfont icon-suoding lock"></view>
										</view>
										<view class="customer-wrapper">
											<view class="table-center" :class="{ 'lock-bg-color': table.tableIsLock }">
												<view class="table-name-center" v-if="table.orderList && table.orderList.length == 0">{{ table.tableName }}</view>
												<view class="table-seating-center">{{ table.seating }}人</view>
											</view>
											<!-- 选中状态（打钩） -->
											<view class="checked" v-if="table.orderList && table.orderList.length == 0 && table.selected">
												<text class="cuIcon-check" :class="table.tableIsLock ? 'text-lock' : 'text-blue'" style="font-size: 140rpx; position: relative; top: -80rpx;"></text>
											</view>
											<view
												v-for="(order, oindex) in table.orderList"
												:key="oindex"
												@tap="gotoOrderInfo(index, order)"
												class="customer-info"
												:class="selfOrderList(order).statusClass"
												:style="{
													height: 100 / table.orderList.length + '%',
													overflowY: table.orderList.length > 2 ? 'auto' : 'hidden'
												}"
											>
												<view class="customer-name" :style="{ fontSize: 24 / table.orderList.length + 'rpx' }">
													<span class="name">{{ order.bookerName }}({{ order.bookOrderTypeName }})</span>
													<span class="icon" :style="{ background: 'url(' + order.picURL + ') no-repeat', backgroundSize: 'cover' }"></span>
												</view>
												<view class="customer-status" :style="{ fontSize: 24 / table.orderList.length + 'rpx' }">
													<span class="order-status">{{ selfOrderList(order).statusStr }}</span>
													<image
														v-if="order.hyDisRecordGUID"
														class="order-img"
														:src="picDomain + '/upload/yytApp/images/fenxiao.png'"
														mode="aspectFit"
													></image>
													<image v-if="selfOrderList(order).showImg" class="order-img" :src="selfOrderList(order).imgSrc" mode="aspectFit"></image>
												</view>
												<view class="seller" v-show="table.orderList.length !== 2" :style="{ fontSize: 24 / table.orderList.length + 'rpx' }">
													<span class="time" v-if="selfOrderList(order).showWillArrivedOn">{{ order.willArrivedOn }}</span>
													<span
														class="icon iconfont icon-kefu text-white"
														:style="{ fontSize: 24 / table.orderList.length + 'rpx', paddingRight: '2px', paddingLeft: '6px' }"
													></span>
													<span class="seller-name">{{ order.marketer }}</span>
												</view>
											</view>
										</view>
									</view>
								</block>
							</view>
						</swiper-item>
					</swiper>

					<!-- <view class="bottom">下拉选中下个区域</view> -->
				</mescroll-uni>
			</view>
		</yyt-st-skeleton>

		<!-- 选择时间modal -->
		<yyt-picker
			mode="date"
			:defaultVal="defaultDate"
			:endYear="endYear"
			:current="false"
			@cancel="cancelDatePicker"
			@confirm="chooseDate($event)"
			ref="datePicker"
			themeColor="#39b54a"
		></yyt-picker>

		<!-- 长按选择 -->
		<!-- 		<view class="cu-modal show" v-show="canShowLockModal" @tap="hideLocakModal">
			<view class="cu-dialog" @tap.stop="">
				<radio-group class="block">
					<view class="cu-list menu text-left">
						<view class="cu-item" v-for="(item,index) in lockModalList" :key="index">
							<label class="flex justify-between align-center flex-sub">
								<view class="flex-sub">item.label</view>
								<radio class="round"></radio>
							</label>
						</view>
					</view>
				</radio-group>
			</view>
		</view> -->

		<uni-popup ref="lockModal">
			<view class="wrapper">
				<view class="popup-mid">
					<view class="lock-list">
						<view class="item" v-for="(item, index) in calcLockModalList" :key="index" @tap="selectLockModal(item)">{{ item.label }}</view>
					</view>
				</view>
			</view>
		</uni-popup>

		<!-- 确定按钮 -->
		<view class="padding flex d-flex flex-nowrap confirm-btn confirm">
			<!-- 确定 -->
			<button @tap="confirm" class="flex-1 cu-btn block bg-blue margin-tb-sm lg" type="" :disabled="!isShowBtn">确定</button>
			<!-- 锁台 -->
			<button @tap="selectLockModal()" v-show="$cw.canOperLockedTable()" class="yyt-margin-left-bg cu-btn block margin-tb-sm lg" style="background:#DD6375;color:#fff" type="" :disabled="!lockBtnInfo.canLock">{{ lockBtnInfo.lockStatus == 0 ? '解锁' : '锁台' }}</button>
		</view>
	</view>
</template>

<script src="./selectTable.js"></script>

<style lang="less" scoped>
@import url('selectTable.less');
</style>
