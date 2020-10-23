<template>
	<view class="customer-list">
		<!-- ========================= 通讯录入口 START ========================= -->
		<view class="contacts-wrapper yyt-list-row yyt-margin-top-bg" @tap="gotoContacts">
			<view class="left">
				<image class="icon" :src="picDomain + '/upload/yytApp/customer/contacts.png'" mode=""></image>
				<view class="title">手机通讯录客户</view>
			</view>
			<view class="right">
				<!-- <view class="content">2333</view> -->
				<image class="icon" :src="picDomain + '/upload/yytApp/images/arrowRight.png'" mode=""></image>
			</view>
		</view>
		<!-- ========================= 通讯录入口 END ========================= -->
		<!-- ========================= 搜索栏 START ====================== -->
		<view class="search-wrapper">
			<sw-icon type="search" size="35r"></sw-icon>
			<input @input="searchChange" type="text" placeholder="请输入客户姓名、电话" />
		</view>
		<!-- ========================= 搜索栏 END ========================= -->

		<!-- ========================= 顶部筛选 START ========================= -->
		<!-- 顶部filter -->
		<view class="bg-white nav uni-flex nav-filter px-3" ref="navRef">
			<!-- 消费排序 -->
			<view class="cu-item text-center">
				<view class="flex yyt-flex-center yyt-h-100" @tap.stop="consumeSortToggle">
					<text>{{ consumeSortSelectedText }}</text>
					<uni-icons type="arrowdown" size="35r" color="#0183FF"></uni-icons>
				</view>
				<view class="dropdown-panel" v-show="showConsumeSort">
					<view
						v-for="(item, index) in consumeSortArr"
						:key="index"
						:class="['dropdown-item', item.selected ? 'dropdown-item-sel' : '']"
						@tap="seleConsumeSort(item)"
					>
						{{ item.label }}
					</view>
					<view class="dropdown-mask" v-show="showConsumeSort" @tap="hideDropdownAndMask"></view>
				</view>
			</view>
			<!-- 所有 / 客户池 筛选 -->
			<view class="cu-item text-center">
				<view class="flex yyt-flex-center yyt-h-100" @tap.stop="customerFilterToggle">
					<text>{{ customerFilterSelectedText }}</text>
					<uni-icons type="arrowdown" size="35r" color="#0183FF"></uni-icons>
				</view>
				<!-- 筛选排序 -->
				<view class="dropdown-panel" v-show="showCustomerType">
					<view
						v-for="(item, index) in customerTypeArr"
						:key="index"
						:class="['dropdown-item', item.selected ? 'dropdown-item-sel' : '']"
						@tap="seleCustomerFilter(item)"
					>
						{{ item.label }}
					</view>
					<view class="dropdown-mask" v-show="showCustomerType" @tap="hideDropdownAndMask"></view>
				</view>
			</view>
			<!-- 客户经理筛选 -->
			<view class="cu-item text-center">
				<view class="flex yyt-flex-center yyt-h-100" @tap.stop="CSManagerFilterToggle">
					<!-- 现在这儿显示的是总数 -->
					<text>{{ currentSelCS.label | currentTopLabel(currentSelCS.value, CSManagerFilterArr) }}</text>
					<uni-icons
						v-show="$cw.canSeeAllCustomer()"
						type="arrowdown"
						size="35r"
						color="#0183FF"
					></uni-icons>
				</view>
				<!-- <uni-icons v-show="$storage.getSalesAuthority().isSeeAll" type="arrowdown" size="35r" color="#0183FF"></uni-icons> -->

				<view class="dropdown-panel" v-show="isCSManagerFilter">
					<scroll-view scroll-y="true" style="max-height: 28vh;">
						<view
							v-for="(item, index) in CSManagerFilterArr"
							:key="index"
							:class="['dropdown-item', item.selected ? 'dropdown-item-sel' : '']"
							@tap="seleCSManagerFilter(item)"
						>
							{{ item.count !== undefined ? `${item.label}(${item.count})` : item.label }}
						</view>
					</scroll-view>
					<view
						class="dropdown-mask"
						v-show="isCSManagerFilter"
						@tap.stop="hideDropdownAndMask"
					></view>
				</view>
			</view>
			<!-- 批量操作 -->
			<view class="cu-item text-center text-blue" @tap="batchOperate">
				<text>{{ !isBatch ? '批量操作' : '取消' }}</text>
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
		<!-- ========================= 筛选 END ========================= -->

		<!-- ========================= 筛选结果的总条数 START ========================= -->
		<view class="filter-result-wrapper yyt-list-row yyt-margin-top-small">
			<view class="left">
				<!-- 这儿显示的当前筛选条件下列表总数 -->
				<view class="title">共筛选客户{{ curListRowCount ? curListRowCount : '0' }}位</view>
			</view>
		</view>
		<!-- ========================= 筛选结果的总条数 END ========================= -->

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
			<checkbox-group @change="checkboxChange">
				<view
					class="yyt-customer-card uni-flex"
					v-for="(ct, index) in customerList"
					:key="ct.customerID"
					@tap="gotoCustomInfo(ct)"
				>
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
						<!-- 复选框 -->
						<checkbox
							v-if="isBatch"
							:value="ct.customerID"
							:checked="ct.selected"
							class="customer-checkbox yyt-extend-area"
							@tap.stop
						/>
						<button
							class="cu-btn round line-blue yyt-margin-right-small"
							@tap.stop="gotoCallPhone(ct.phone,0)"
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
						<!-- bg-blue实心按钮 line-blue 镂空按钮 -->
						<!-- 这个功能砍掉了 -->
						<!-- <view @tap.stop="">
							<yyt-bubble-menu
								v-if="calcMoreList(ct).length > 0"
								:list="calcMoreList(ct)"
								:extraData="ct"
								@selectMenu="triggerMenu"
							></yyt-bubble-menu>
						</view> -->
					</view>
				</view>
			</checkbox-group>
		</mescroll-uni>
		<!-- ========================= 列表 END ========================= -->

		<!-- ========================= 侧边栏 START ========================= -->
		<!-- ====================== 抽屉开始 ================================ -->
		<uni-drawer class="yyt-sidebar-wrapper" :visible="isShowSidebar" @close="closeDrawer" mode="right">
			<scroll-view scroll-y="true" class="scroll-view-wrapper">
				<view class="scroll-inner-wrapper">
					<view class="conditions-item" v-if="customerLevelArr.length > 0">
						<view class="title-wrapper">
							<text class="title">客户等级</text>
							<!-- <view class="arrow-wrapper"><sw-icon :size="20" class="uni-icon-wrapper" color="#bbb" type="arrowright" /></view> -->
						</view>
						<view class="content">
							<view
								v-for="(item, index) in customerLevelArr"
								:key="index"
								class="cu-tag round"
								:class="[filterData.levelID == item.value ? 'bg-blue' : 'line-blue']"
								@tap="selectCustomerLevelFromSidebar(item)"
							>
								{{ item.label }}
							</view>
						</view>
					</view>

					<!-- <view class="conditions-item" v-if="CSManagerFilterArr.length > 0 && getSalesAuthorityFromStorage().isSeeAll"> -->
					<view class="conditions-item" v-if="CSManagerFilterArr.length > 0 && $cw.canSeeAllCustomer()">
						<view class="title-wrapper">
							<text class="title">客户经理</text>
							<!-- <view class="arrow-wrapper"><sw-icon :size="20" class="uni-icon-wrapper" color="#bbb" type="arrowright" /></view> -->
						</view>
						<view class="content">
							<view
								v-for="(item, index) in CSManagerFilterArr"
								:key="index"
								class="cu-tag round"
								:class="[filterData.sellerID == item.value ? 'bg-blue' : 'line-blue']"
								@tap="selectCSManagerFromSidebar(item)"
							>
								{{ item.label }}
							</view>
						</view>
					</view>

					<!-- <view class="conditions-item" v-if="wajueArr.length > 0">
						<view class="title-wrapper">
							<text class="title">挖掘条件</text>
						</view>
						<view class="content">
							<view
								v-for="(item, index) in wajueArr" :key="index"
								class='cu-tag round' :class="[ filterData.wajueID == item.value ? 'bg-blue' : 'line-blue' ]"
								@tap="selectWajueFromSidebar(item)">{{item.label}}</view>
						</view>
					</view> -->

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
								<view class="tags-content">{{ currentTagsObj.content }}</view>
							</view>
						</view>
					</view>

					<view class="conditions-item" style="display: none;">
						<view class="title-wrapper">
							<text class="title">消费情况</text>
							<view class="arrow-wrapper">
								<sw-icon :size="20" class="uni-icon-wrapper" color="#bbb" type="arrowright" />
							</view>
						</view>
						<view class="content">
							<view class="date-range" @tap="clickDateRange">
								<text id="start-date" class="input">
									{{
										filterData.startDate ? filterData.startDate.slice(0, 10) : '起始日期'
									}}
								</text>
								<text class="span">-</text>
								<text id="end-date" class="input">
									{{ filterData.endDate ? filterData.endDate.slice(0, 10) : '结束日期' }}
								</text>
							</view>
							<view class="consume-range">
								<view class="sub-title">人均消费范围（¥）</view>
								<view>
									<view class="moveContent">
										<!-- <input type="text" value="0" class="consume-money-range" /> -->
										<slider-range
											class="consume-money-range"
											:value="sliderRangeMoney.rangeValue"
											:min="sliderRangeMoney.min"
											:max="sliderRangeMoney.max"
											:step="sliderRangeMoney.step"
											:height="barSumHeight"
											:bar-height="barHeight"
											:block-size="blockSize"
											:background-color="barBackgroundColor"
											:active-color="barActiveColor"
											:format="formatMoneyRange"
											@change="handleMoneyRangeChange"
										></slider-range>
									</view>
								</view>
							</view>
							<view class="count-range">
								<view class="sub-title">消费频次范围（次）</view>
								<view>
									<view class="moveContent">
										<!-- <input type="text" value="0" class="consume-count-range" style="display: none;" /> -->
										<slider-range
											class="consume-count-range"
											:value="sliderRangeCount.rangeValue"
											:min="sliderRangeCount.min"
											:max="sliderRangeCount.max"
											:step="sliderRangeCount.step"
											:height="barSumHeight"
											:bar-height="barHeight"
											:block-size="blockSize"
											:background-color="barBackgroundColor"
											:active-color="barActiveColor"
											:format="formatCountRange"
											@change="handleCountRangeChange"
										></slider-range>
									</view>
								</view>
							</view>
						</view>
					</view>

					<view class="conditions-item">
						<view class="title-wrapper" @tap="gotoCompanyPage">
							<text class="title">单位</text>
							<text class="desc span">{{ currentCompanyObj.name }}</text>
							<view class="arrow-wrapper">
								<sw-icon :size="20" class="uni-icon-wrapper" color="#bbb" type="arrowright" />
							</view>
						</view>
					</view>

					<view class="conditions-item">
						<view class="title-wrapper"><text class="title">整理状态</text></view>
						<view class="content">
							<view
								v-for="(item, index) in settleFilterArr"
								:key="index"
								class="cu-tag round"
								:class="[filterData.settleStatus == item.value ? 'bg-blue' : 'line-blue']"
								@tap="selectSettleFromSidebar(item)"
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

		<!-- ========================= 其他组件 START ========================= -->
		<!-- 侧边栏时间范围选择 -->
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
		<!-- 批量指定更改客户经理后弹出的picker(排除自己) -->
		<yyt-picker
			mode="selector"
			v-if="CSManagerBatchArr.length != 0"
			@cancel="cancelChangeCSManagerNoSelfPicker"
			@confirm="confirmChangeCSManagerNoSelf"
			ref="CSManagerNoSelfPicker"
			themeColor="#4E92DF"
			:selectList="CSManagerBatchArr"
		></yyt-picker>
		<!-- ========================= 其他组件 END ========================= -->

		<!-- ========================= 批量操作 START ========================= -->
		<!-- 底部操作按钮 -->
		<view class="yyt-batch-container" v-if="isBatch">
			<view @tap="toggleAllSel" class="left-wrapper">
				<checkbox :checked="isAllSel" class="customer-checkbox yyt-extend-area" />
				<view class="text">
					<view class="p">{{ isAllSel ? '取消全选' : '全选' }}</view>
					<view class="p">
						(已选:
						<text class="span" style="color: #EE1D1D;">{{ checkboxSelectNum }}</text>
						)
					</view>
				</view>
			</view>
			<view class="batch_list">
				<!-- 没有权限调整客户经理，则批量操作时不显示此按钮 -->
				<text
					class="span yyt-orange-bg"
					@tap="showBatchCSManagerPanel"
					v-show="$cw.canBatchChangeCS()"
				>
					更换客户经理
				</text>
				<text class="span yyt-warning-bg" @tap="showBatchMoveTrackPanel">移入跟踪</text>
				<text class="span bg-blue" @tap="goBatchLables">打标签</text>
			</view>
		</view>
		<!-- 批量更换客户经理触发 -->
		<view class="customPool_popup" v-if="isShowBatchOfCSManagerPanel">
			<view class="rule_list ul">
				<view class="li">选择更换规则</view>
				<view class="li" @tap="changeMarketer(1, '是否按最后一次追踪更换客户经理?')">
					按最后一次追踪
				</view>
				<view class="li" @tap="changeMarketer(2, '是否按最后一次消费更换客户经理?')">
					按最后一次消费
				</view>
				<view class="li" @tap="changeMarketer(3, '是否分配至客户经理?')">分配至客户经理</view>
				<!-- <view class="li" @tap="changeMarketer(4)">更换到指定客户经理</view> -->
				<view class="li" @tap="isShowBatchOfCSManagerPanel = false">取消</view>
			</view>
			<!-- 确认提示框 -->
			<uni-popup
				class="yyt-popup-wrapper"
				:show="isMarketConfirm"
				type="center"
				:custom="true"
				:mask-click="false"
			>
				<view class="send-msg">
					<view class="modal-content_message_title">
						<view class="modal-content_message_title_tip">提示</view>
						<image
							class="closeBtn"
							:src="picDomain + '/upload/yytApp/images/closePic.png'"
							@tap="isMarketConfirm = false"
						></image>
					</view>
					<view class="modal-content_message_Info">
						<!-- 提示描述 -->
						<view class="change_makert_content">
							<!-- @*<span class="fa fa-exclamation-circle"></span>*@ -->
							<view class="change_makert_text">
								<view class="p">{{ marketConfirmTips }}</view>
								<!-- @*<p>面向20个客户更换至：</p>
									<p>周琴(07)，杨梅(06)，顾玮玮(13)，周琴(02)，周琴(02)，杨梅(04)，顾玮(03)，?</p>*@ -->
							</view>
						</view>
						<!-- 按钮区 -->
						<view class="sendMessageInfo">
							<view class="change_makert_foot">
								<button
									type="button"
									class="customPool_cancel"
									v-on:click="isMarketConfirm = false"
								>
									取消
								</button>
								<button type="button" class="customPool_confirm" v-on:click="confirmMarkert">
									确定
								</button>
							</view>
						</view>
					</view>
					<view class="footer"></view>
				</view>
			</uni-popup>
		</view>
		<!-- 批量更换客服操作成功后的提示 -->
		<uni-popup
			class="yyt-popup-wrapper"
			:show="isMarketConfirmTips"
			type="center"
			:custom="true"
			:mask-click="false"
		>
			<view class="send-msg">
				<view class="modal-content_message_title">
					<view class="modal-content_message_title_tip">提示</view>
					<image
						class="closeBtn"
						:src="picDomain + '/upload/yytApp/images/closePic.png'"
						@tap="isMarketConfirmTips = false"
					></image>
				</view>
				<view class="modal-content_message_Info">
					<!-- 提示描述 -->
					<view class="change_makert_content" style="text-align:left;padding-left: 30rpx;">
						<!-- @*<span class="fa fa-exclamation-circle"></span>*@ -->
						<view class="change_makert_text">
							<view class="p" style="color: #0185FE;">已将{{ customNum }}个客户更换至：</view>
							<view class="p" style="font-size: 26rpx;">{{ customTips }}</view>
							<!-- @*<p>面向20个客户更换至：</p>
								<p>周琴(07)，杨梅(06)，顾玮玮(13)，周琴(02)，周琴(02)，杨梅(04)，顾玮(03)，?</p>*@ -->
						</view>
					</view>
				</view>
				<view class="footer"></view>
			</view>
		</uni-popup>
		<!-- 移入跟踪的弹窗 -->
		<view class="customPool_popup" v-if="isShowBatchOfMoveTrackPanel">
			<view class="track_box">
				<view class="p">批量移入跟踪列表</view>
				<view class="track_content">
					<view class="div">
						<label>移入跟踪日期：</label>
						<!-- <input type="date" placeholder="请选择日期" v-model="moveTrackDate" /> -->
						<picker
							fields="month"
							class="desc"
							mode="date"
							:value="'9999-99-99'"
							@change="chooseMoveTrackDate"
						>
							<view class="picker">
								{{ moveTrackDate.slice(0, 7) || '请选择日期' }}
								<text class="text-gray  icon iconfont icon-riqi2 "></text>
							</view>
						</picker>
					</view>
					<view class="div" @tap="goRemark">
						<label>备注：</label>
						<input type="text" readonly placeholder="请输入备注" :value="moveTrackRemark" />
					</view>
				</view>
				<view class="track_footer">
					<button
						type="button"
						class="customPool_cancel"
						v-on:click="isShowBatchOfMoveTrackPanel = false"
					>
						取消
					</button>
					<button type="button" class="customPool_confirm" v-on:click="moveTrackConfirm">
						确定
					</button>
				</view>
			</view>
		</view>
		<!-- 批量多选均分客服经理 -->
		<multiple-select
		  v-model="showMultipleSelPicker"
		  :data="CSManagerBatchArr"
		  :default-selected="mutipleSelDefaultSelected"
		  @confirm="confirmMultipleSel"
		></multiple-select>
		<!-- ========================= 批量操作 END ========================= -->
	</view>
</template>

<script>
export { default } from './customList.js';
</script>

<style lang="less" scoped>
@import url('customList.less');
</style>
