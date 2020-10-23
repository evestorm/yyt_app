<template>
	<view>
		<!-- 跟进人 -->
		<view class="top">
			<view class="cue-input">
				<uni-icons type="search" size="35r" @tap="searchBanquet()"></uni-icons>
				<input type="text" placeholder="请输入线索姓名、电话" @input="searchChange" @focus="triggerSearch" />
			</view>
			<view class="">
				<view class="cue-screen">
					<view @tap="clickTitle1()" class="cue-screen-view">
						<text>{{ cuetitle1 }}</text>
						<uni-icons type="arrowdown" size="35r" color="#0183ff"></uni-icons>
					</view>
					<view @tap="clickTitle2()" class="cue-screen-view">
						<text>{{ cuetitle2 }}</text>
						<uni-icons type="arrowdown" size="35r" color="#0183ff"></uni-icons>
					</view>
					<view @tap="clickTitle3()" class="cue-screen-view">
						<text v-cloak>{{ showMarketerNameAndCount }}</text>
						<!-- <text v-cloak>{{ marketerName + '(' + clueCount + ')' }}</text> -->
						<uni-icons color="#0183ff" v-if="$cw.canSeeYHClueAll()" type="arrowdown" size="35r"></uni-icons>
					</view>
					<image :src="picDomain + '/upload/yytApp/banquet/shaixuan.png'" class="saixuan-img" @tap="isShowSidebar = true"></image>
				</view>
				<view class="click-show">
					<!-- handle点击出现  排序 -->
					<view class="listUnsel" :class="{ listSel: isActive }">
						<view class="list-item" v-for="(item, cindex) in PageConstData.chooseHandleStyle" :key="cindex">
							<text @tap="chooseHandleClick(item)" :class="item.selected ? 'sel' : ''">{{ item.label }}</text>
						</view>
					</view>
					<!-- 线索来源 -->
					<view class="origin-none" :class="{ originSel: isOrigin }">
						<view class="parent-list" :class="{ bg: pageData.clueSourceType == item.value }" v-for="(item, index) in originList" :key="index">
							<text @tap="pageData.clueSourceType = item.value">{{ item.label }}</text>
							<scroll-view scroll-y="true" class="child-list">
								<view
									class="list-item"
									v-for="(child, childIndex) in originList[pageData.clueSourceType ? pageData.clueSourceType - 1 : 0].children"
									:key="childIndex"
								>
									<view class="child-text" @tap="chooseOrigin(pageData.clueSourceType, child)">
										<!-- :class="item.value==pageData.clueSourceType && child.selected ? 'sel' : ''" -->
										<text>{{ child.label }}</text>
									</view>
								</view>
							</scroll-view>
						</view>
					</view>
					<!-- 跟进人 -->
					<view class="fllow-none" :class="{ fllowSel: isFllow }">
						<scroll-view scroll-y="true" class="child-list center-text">
							<view class="list-item" v-for="(item, fllowIndex) in followList" :key="fllowIndex">
								<view class="child-text" @tap="followConfirm(item)">
									<text :class="{ sel: item.selected }">{{ item.label }}</text>
								</view>
							</view>
						</scroll-view>
					</view>
					<!-- 蒙版 -->
					<view class="menban-none" :class="{ mengban: isMengban1 }" @tap="clickMengBan"></view>
				</view>
			</view>
			<view class="filter-result-wrapper">
				<view class="left">
					<!-- 这儿显示的当前筛选条件下列表总数 -->
					<view class="page-num">共筛选{{ getBAnquetCut.pageNum }}条宴会线索</view>
				</view>
			</view>
		</view>
		<!-- 线索主体 -->
		<mescroll-uni :down="downOption" @down="downCallback" :up="upOption" @up="upCallback" :top="navFilterBottom" firstReload="false">
			<view class="sec">
				<!--展示列表项-->
				<banquet-cue-item :banquetCuelist="getBAnquetCut.banquetCuelist"></banquet-cue-item>
			</view>
		</mescroll-uni>
		<uni-drawer class="yyt-sidebar-wrapper" :visible="isShowSidebar" @close="isShowSidebar = false" mode="right">
			<view class="right-popup">
				<view class="right-popup-sec">
					<view class="pop-top">
						<view class="title">创建日期</view>
						<view class="creat-time">
							<picker class="dataInput" mode="date" :value="pageData.clueCreateStartDate" @change="startDateChange">
								<view class="uni-input  black">{{ pageData.clueCreateStartDate ? pageData.clueCreateStartDate : '起始时间' }}</view>
							</picker>
							<text class="mid-line">——</text>
							<picker class="dataInput" mode="date" :value="pageData.clueCreateEndDate" @change="endDateChange">
								<view class="uni-input  black">{{ pageData.clueCreateEndDate ? pageData.clueCreateEndDate : '最后时间' }}</view>
							</picker>
						</view>
					</view>
					<view class="pop-mid">
						<view class="title">线索状态</view>
						<view class="line-flex">
							<view
								class="btn"
								v-for="(item, statusIndex) in PageConstData.clueStatusArr"
								:key="statusIndex"
								@tap="pageData.clueStatus = item.value"
								:class="{ bluebg: pageData.clueStatus == item.value }"
							>
								{{ item.label }}
							</view>
						</view>
					</view>
					<view class="pop-bot">
						<view class="title">线索成交率</view>
						<view class="line-flex">
							<view
								class="btn"
								v-for="(item, leveIndex) in PageConstData.clueLevel"
								:key="leveIndex"
								@tap="pageData.clueLevel = item.value"
								:class="{ bluebg: pageData.clueLevel == item.value }"
							>
								{{ item.label }}
							</view>
						</view>
					</view>
					<view class="sidebar-btn-fixed">
						<button class="cu-btn round lg line-blue" @tap="reSet()">重置</button>
						<button class="cu-btn round lg bg-blue" @tap="getCluePagedList(pageData)">完成</button>
					</view>
				</view>
			</view>
		</uni-drawer>
	</view>
</template>

<script>
export { default } from './banquetCue.js';
</script>

<style scoped lang="less">
@import url('banquetCue.less');
</style>
