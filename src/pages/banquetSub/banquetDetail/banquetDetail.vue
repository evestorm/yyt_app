<template>
	<view class="container" ref="containerRef" style="position: fixed; overflow: hidden; height: 100%; width: 100vw;">
		<!-- ========================= uniapp-导航栏 START ========================= -->
		<uni-nav-bar
			left-icon="back"
			@clickLeft="tapLeftFromNav"
			title="宴会详情"
			:right-icon="(isCoordinator || isEditAll) ? 'more-filled' : ''"
			@clickRight="tapRightFromNav"
			color="#ffffff"
			background-color="#0782ff"
			:fixed="true"
			ref="navbarRef"
		></uni-nav-bar>
		<!-- 右上角门店弹窗 -->
		<uni-popup
			bubble='right'
			class="nav-popup"
			ref="morePopup"
			type="position"
			posi="top: 50px; right: 0; display: flex; justify-content: flex-end;"
			:custom="true"
			:mask-click="true"
		>
			<view class="wrapper" style="margin-right: 20rpx;">
				<view v-for="(item, index) in rightDynamicMenuArr" :key="index" class="item" @tap="seleMenu(item)">
					<image class="img" :src="item.icon"></image>
					<view class="title">{{ item.label }}</view>
				</view>
			</view>
		</uni-popup>
		<!-- ========================= uniapp-导航栏 END ========================= -->

		<!-- ========================= 客户基本信息 START ========================= -->
		<view class="customer-basic-info uni-flex uni-row" ref="customerBasicInfoRef">
			<view class="avatar-wrapper-left uni-flex uni-row yyt-flex-center">
				<view class="cu-avatar xl round margin-right" :style="{ backgroundImage: getImgUrl(banquetDetailData.headImg) }"></view>
			</view>
			<view class="other-info-wrapper-right uni-flex uni-column">
				<view class="uni-flex top">
					<view class="banquet-title">{{ banquetDetailData.banquetOrderName }}</view>
					<view class="banquet-date-wrapper uni-flex yyt-flex-center yyt-margin-left-small">
						<image class="img" :src="picDomain + '/upload/yytApp/banquet/date.png'"></image>
						<text class="date">{{ banquetDetailData.banquetDate | parseShortDate }}</text>
					</view>
				</view>
				<view class="uni-flex center">
					<text>{{ banquetDetailData.orderCstName }}</text>
					<text class="margin-left">{{ banquetDetailData.orderCstPhone }}</text>
				</view>
				<view class="uni-flex bottom">
					<image class="img" :src="picDomain + '/upload/yytApp/banquet/gongsi.png'"></image>
					<text class="company">{{ banquetDetailData.orderCstCompany }}</text>
				</view>
			</view>
		</view>
		<!-- ========================= 客户基本信息 END ========================= -->

		<!-- ========================= 宴会详情主体 START ========================= -->
		<view class="banquet-main-wrapper" :style="{ paddingTop: actionWrapperHeight + 'px' }">
			<!-- 宴会信息 / 宴会执行 切换按钮 -->
			<view class="action-wrapper" ref="actionWrapperRef">
				<view class="btn-wrapper uni-flex yyt-flex-center">
					<button @tap="showBanquetInfo" class="cu-btn round lg margin-right" :class="isActive == 1 ? 'bg-blue' : 'line-blue'">
						宴会信息
					</button>
					<button @tap="showBanquetExec" class="cu-btn round lg margin-left" :class="isActive == 2 ? 'bg-blue' : 'line-blue'">
						宴会执行
					</button>
				</view>
				<!-- [宴会信息]顶部tab切换 -->
				<scroll-view
					v-show="isActive == 1"
					scroll-x
					class="banquet-info-tab bg-white nav"
					scroll-with-animation
					:scroll-left="banquetInfoScrollLeft"
				>
					<view
						class="cu-item"
						:class="index == banquetInfoSelected ? 'text-blue cur short yyt-font-weight' : ''"
						v-for="(item, index) in banquetInfoArr"
						:key="index"
						@tap="banquetInfoTabSelect"
						:data-id="index"
					>
						{{ item.name }}
					</view>
				</scroll-view>
				<!-- [宴会执行]顶部filter -->
				<view v-show="isActive == 2 && banquetDetailData.themeConfGUID" class="banquet-exec-filter nav-filter bg-white nav uni-flex">
					<view class="cu-item text-center">
						<view class="flex yyt-flex-center yyt-h-100" @tap.stop="execSortToggle">
							<text>{{ execSortSelectedText }}</text>
							<uni-icons type="arrowdown" size="35r" color="#0183FF"></uni-icons>
						</view>
						<!-- 筛选排序 -->
						<view class="dropdown-panel" v-show="isExecSort">
							<view
								v-for="(item, index) in execSortArr"
								:key="index"
								:class="['dropdown-item', item.selected ? 'dropdown-item-sel' : '']"
								@tap="seleExecSort(item)"
							>
								{{ item.label }}
							</view>
							<view class="dropdown-mask" @touchmove.stop="moveHandle" v-show="isExecSort" @tap="hideDropdownAndMask"></view>
						</view>
					</view>
					<view class="cu-item text-center">
						<view class="flex yyt-flex-center yyt-h-100" @tap.stop="executorToggle">
							<text >{{ executorText }}</text>
							<uni-icons type="arrowdown" size="35r" color="#0183FF"></uni-icons>
						</view>
						<!-- 筛选排序 -->
						<view class="dropdown-panel" v-show="isExecutor">
							<scroll-view scroll-y="true" style="max-height: 20vh;">
								<view
									v-for="(item, index) in exectorArr"
									:key="index"
									:class="['dropdown-item', item.selected ? 'dropdown-item-sel' : '']"
									@tap="seleExector(item)"
								>
									{{ item.executorName }}
								</view>
							</scroll-view>
							<view class="dropdown-mask" v-show="isExecutor" @tap="hideDropdownAndMask"></view>
						</view>
					</view>
					<view class="cu-item text-center">
						<view class="flex yyt-flex-center yyt-h-100" @tap.stop="taskStatusToggle">
							<text>{{ taskStatusText }}</text>
							<uni-icons type="arrowdown" size="35r" color="#0183FF"></uni-icons>
						</view>
						<!-- 任务状态筛选 -->
						<view class="dropdown-panel" v-show="isTaskStatus">
							<view
								v-for="(item, index) in taskStatusArr"
								:key="index"
								:class="['dropdown-item', item.selected ? 'dropdown-item-sel' : '']"
								@tap="seleTaskStatus(item)"
							>
								{{ item.label }}
							</view>
							<view class="dropdown-mask" v-show="isTaskStatus" @tap="hideDropdownAndMask"></view>
						</view>
					</view>
				</view>
			</view>
			<!-- 宴会信息板块 -->
			<view v-show="isActive == 1" class="banquet-info-wrapper">
				<swiper
					class="swiper"
					style="height: 100%;"
					:current="banquetInfoSelected"
					@change="changeBanquetInfoSelected"
					:indicator-dots="false"
					:autoplay="false"
					:interval="500"
					:duration="300"
				>
					<swiper-item>
						<scroll-view scroll-y="true" class="scroll-view-wrapper">
							<!-- 宴会相关 -->
							<view class="banquet-relevant">
								<!-- <view class="banquet-relevant" v-show="banquetInfoSelected == 0"> -->
								<view class="yyt-list-item">
									<view class="title">宴会类型</view>
									<!-- <input class="sw-input" type="text" focus placeholder="请输入邮箱信息" /> -->
									<view class="content">{{ banquetDetailData.banquetThemeTypeName }}</view>
									<!-- <view class="arrow-wrapper"><sw-icon :size="20" class="uni-icon-wrapper" color="#bbb" type="arrowright" /></view> -->
								</view>
								<view class="yyt-list-item">
									<view class="title">宴会主题</view>
									<!-- 如果有主题，disabled不让点 -->
									<!-- <input
										class="sw-input"
										:disabled="!banquetDetailData.themeConfName"
										type="text"
										placeholder="未选择"
										:value="banquetDetailData.themeConfName"
									/> -->
									<view class="content" v-if="banquetDetailData.themeConfName">{{banquetDetailData.themeConfName}}</view>
									<view class="tip-row" @tap="addTheme" v-if="!banquetDetailData.themeConfName">未选择</view>
									<view v-if="!banquetDetailData.themeConfName" class="arrow-wrapper" @tap="addTheme">
										<sw-icon :size="20" class="uni-icon-wrapper" color="#bbb" type="arrowright" />
									</view>
								</view>
								<view class="yyt-list-item">
									<view class="title">签单日期</view>
									<view class="content">{{banquetDetailData.orderSignDate | parseShortDate}}</view>
								</view>
								<view class="members-of-the-service yyt-list-item yyt-list-item-column">
									<view class="title-wrapper">
										<view class="title">宴会服务成员</view>
										<view class="content">{{ banquetServicePersonnelArr.length }}人</view>
									</view>
									<scroll-view scroll-x="true" @touchstart.stop="" class="scroll-view_H member-avatar-content">
										<view
											v-for="(waiter, index) in banquetServicePersonnelArr"
											:key="index"
											class="member-avatar-item"
										>
											<picker class="picker-wrapper" :value="indexes[index]" @change="changeCS($event, waiter, index)" :range="sales" range-key="text">
											    <view class="picker">
													<!-- 这里更改后，客户经理和客户池经理都会跟着变 -->
											        <!-- <text v-if="ctInfo.customerPoolMarketName" class="change-cs-btn text-blue">{{ ctInfo.customerPoolMarketName ? '更换' : '添加' }}</text> -->
											        <!-- <text v-else class="change-cs-btn text-blue">{{ ctInfo.marketerName ? '更换' : '添加' }}</text> --> 
													<view
														class="cu-avatar lg round"
														:style="{ backgroundImage: getImgUrl(waiter.executorImgUrl_Server) }"
													></view>
													<view class="avatar-name-wrapper">
														<image
															v-if="waiter.isCoordinator == 1"
															class="img"
															:src="picDomain + '/upload/yytApp/banquet/tongchou.png'"
															mode=""
														></image>
														<image v-if="waiter.isMarketer == 1" class="img" :src="picDomain + '/upload/yytApp/banquet/kefujingli.png'" mode=""></image>
														<text class="name">{{ waiter.executorName }}</text>
													</view>
												</view>
											</picker>
										</view>
									</scroll-view>
								</view>
								<view class="yyt-list-item yyt-list-item-column" @tap="addOrderComments">
									<view class="title-wrapper">
										<!-- 订单备注可填写
										<view class="title">订单备注</view>
										<view class="arrow-wrapper">
											<sw-icon :size="20" class="uni-icon-wrapper" color="#bbb" type="arrowright" />
										</view>
									</view>
									<view class="tip" v-if="banquetDetailData.banquetOrderRemark.length <= 0">请填写备注信息</view>
									<view else>{{ banquetDetailData.banquetOrderRemark }}</view>
								</view>
								<view class="yyt-list-item yyt-list-item-column yyt-border-none">
									<view class="title-wrapper">
										<!-- 线索备注不可更改 -->
										<view class="title">线索备注</view>
									</view>
									<!-- <view class="tip" v-if="banquetDetailData.clueRemark.length <= 0">请填写备注信息</view> -->
									<view>{{ banquetDetailData.clueRemark }}</view>
								</view>

								<!-- 预订单信息 -->
								<view class="booking-info" v-if="isCoordinator || isEditAll">
									<view class="overview-title" @tap="gotoBooking">
										<view class="overview-subTitle">
											<!-- <view class="overview-stripe"></view> -->
											<view>预订单信息</view>
										</view>
										<view>
											<view class="info-wrapper">
												<!-- <view class="overview-dot"></view> -->
												<!-- <view class="yyt-error">{{ operate.customerFollowData.needFollowCount }}</view> -->
												<view class="text-blue">{{ banquetDetailData.bookOrderBookOrderID ? '查看预订' : '立即预订' }}</view>
											</view>
											<swIcon type="arrowright" size="25" color="#D9D9D9"></swIcon>
										</view>
									</view>
									<!-- <view class="yyt-list-item">
										<view class="title">姓名</view>
										<view class="content">何明</view>
									</view>
									<view class="yyt-list-item">
										<view class="title">电话</view>
										<view class="content">15827452331</view>
									</view> -->
									<view v-show="banquetDetailData.bookOrderBookOrderID">
										<view class="yyt-list-item">
											<view class="title">预订日期</view>
											<view class="content">{{ banquetDetailData.bookOn | parseShortDate }}</view>
										</view>
										<view class="yyt-list-item">
											<view class="title">宴会类型</view>
											<view class="content">{{ banquetDetailData.bookOrderTypeName }}</view>
										</view>
										<view class="yyt-list-item">
											<view class="title">餐别</view>
											<view class="content">{{ banquetDetailData.diningTypeName }}</view>
										</view>
										<view class="yyt-list-item">
											<view class="title">已预订桌数</view>
											<view class="content">{{ banquetDetailData.bookTableNum || 0 }}桌</view>
										</view>
										<view class="yyt-list-item" v-if="banquetDetailData.frontMoney">
											<view class="title">已付订金</view>
											<view class="content">
												<text style="color: #999999;">(¥)</text>
												{{ banquetDetailData.frontMoney | formatMoney }}
											</view>
										</view>
										<view class="yyt-list-item">
											<view class="title">区域</view>
											<view class="content">{{ banquetDetailData.areaName }}</view>
										</view>
									</view>
								</view>
							</view>
						</scroll-view>
					</swiper-item>
					<swiper-item>
						<scroll-view scroll-y="true" class="scroll-view-wrapper">
							<!-- 客户档案 -->
							<view class="account-profile">
								<!-- <view class="account-profile" v-show="banquetInfoSelected == 1"> -->
								<!-- 档案为空 -->
								<view
									class="empty uni-flex uni-column"
									@tap="addProfile"
									v-if="banquetDetailData.bOrderOfRecordViewDtos.length <= 0"
								>
									<view class="tip-wrapper uni-flex uni-row">
										<image class="img" :src="picDomain + '/upload/yytApp/banquet/info.png'" mode=""></image>
										<text class="tip">客户档案空空如也，需要您前往添加 >></text>
									</view>
									<button class="cu-btn round lg bg-blue btn">添加档案</button>
									<!-- bg-blue实心按钮 line-blue 镂空按钮 -->
								</view>
								<!-- 至少有一个档案 -->
								<view else class="profile-list" :style="(isCoordinator || isEditAll) ? 'padding-bottom: 60px;' : ''">
									<view
										class="card"
										v-for="customer in banquetDetailData.bOrderOfRecordViewDtos"
										:key="customer.id"
									>
										<view class="yyt-list-item yyt-list-item-column">
											<view class="title-wrapper" @tap="editProfile(customer.id)">
												<view class="title text-bold">{{ customer.cstRecordConfName }}</view>
												<view class="arrow-wrapper">
													<sw-icon :size="20" class="uni-icon-wrapper" color="#bbb" type="arrowright" />
												</view>
											</view>
											<view style="width: 100%;">
												<view class="yyt-list-item">
													<view class="title">姓名</view>
													<!-- <input class="sw-input" type="text" focus placeholder="请输入邮箱信息" /> -->
													<view class="content">{{ customer.cstName }}</view>
												</view>
												<view class="yyt-list-item" @tap="gotoCallPhone(customer.cstPhone)">
													<view class="title">电话</view>
													<!-- <input class="sw-input" type="text" disabled placeholder="暂无" :value="customer.cstPhone" /> -->
													<view class="content" v-if="customer.cstPhone">{{ customer.cstPhone }}</view>
													<view class="tip-row" v-if="!customer.cstPhone">暂无</view>
												</view>
												<view class="yyt-list-item">
													<view class="title">生日</view>
													<view class="content">{{ customer.cstBirthday | parseShortDate }}</view>
												</view>
											</view>
										</view>
									</view>
								</view>
								<!-- 客户档案底部按钮 -->
								<view class="profile-fixed-bottom" v-show="isActive == 1 && banquetInfoSelected == 1 && (isCoordinator || isEditAll) && banquetDetailData.bOrderOfRecordViewDtos.length > 0">
									<button class="cu-btn round lg bg-orange btn" @tap="addProfile">添加客户档案</button>
									<!-- bg-blue实心按钮 line-blue 镂空按钮 -->
									<button class="cu-btn round lg bg-blue btn" @tap="sendToTheCustomer(1)">发送给客户</button>
									<!-- bg-blue实心按钮 line-blue 镂空按钮 -->
								</view>
							</view>
						</scroll-view>
					</swiper-item>
					<swiper-item>
						<scroll-view scroll-y="true" class="scroll-view-wrapper">
							<!-- 宴会套餐 -->
							<view class="dinner-meal">
								<!-- <view class="dinner-meal" v-show="banquetInfoSelected == 2"> -->
								<view class="yyt-list-item">
									<view class="title">桌数</view>
									<view class="content">{{ banquetDetailData.packageTableCount }}<text v-if="banquetDetailData.packageSpareTableCount > 0">备{{banquetDetailData.packageSpareTableCount}}</text></view>
								</view>
								<view class="yyt-list-item">
									<view class="title">套餐</view>
									<view class="content">{{ banquetDetailData.banquetPackageName }}</view>
								</view>
								<view class="yyt-list-item">
									<view class="title">套餐价格</view>
									<view class="content">
										<text style="color: #999999;">(¥)</text>
										{{ banquetDetailData.packagePrice | formatMoney }}
									</view>
								</view>
								<view class="yyt-list-item yyt-list-item-column">
									<view class="title-wrapper"><view class="title">备注</view></view>
									<view class="uni-textarea" v-show="false">
										<!-- @blur输入框失去焦点时触发，不加style高度自定撑开，value为输入框的内容，disabled为是否可输入 -->
										<textarea placeholder="无" style="height: 80rpx;" value="" :disabled="true" />
									</view>
									<view class="tip" v-if="banquetDetailData.packageRemark.length <= 0">无</view>
									<view else>{{ banquetDetailData.packageRemark }}</view>
								</view>
							</view>
						</scroll-view>
					</swiper-item>
					<swiper-item>
						<scroll-view scroll-y="true" class="scroll-view-wrapper">
							<!-- 服务项目 -->
							<view class="service-project" v-if="banquetDetailData.bOrderOfProjectCommentViewDtos && banquetDetailData.bOrderOfProjectCommentViewDtos.length > 0">
								<!-- <view class="service-project" v-show="banquetInfoSelected == 3"> -->
								<!-- 项目卡片 -->
								<view class="card-proj" v-for="(rate, index) in banquetDetailData.bOrderOfProjectCommentViewDtos" :key="index">
									<view class="title-wrapper">
										<view class="title">{{ rate.projectConfName }}</view>
										<view class="btn"
											@tap="sendToCustomerReviews(rate)"
											v-if="rate.isCanMemberComment && rate.cstScore == 0 && rate.isTaskCompleted && rate.allCount > 0">发送给客户评价</view>
									</view>
									<!-- 评分 -->

									<!-- 根据评分是否大于0来判定用户是否评论过，只要评论过，分数一定大于0 -->
									<view class="rate-wrapper">
										<view class="score-wrapper">
											<text class="title">评分：</text>
											<text class="tip" v-if="!rate.isTaskCompleted">项目还未结束，暂未开启评分</text>
											<text class="tip" v-else-if="!rate.isCanMemberComment">项目未开启评分</text>
											<text class="tip" v-else-if="rate.cstScore == 0">等待客户评分</text>
											<sx-rate
												v-else
												disabled
												class="rate-control"
												:value="rate.cstScore"
												:default-color="'#e1e1e1'"
												:active-color="'#FC4732'"
											></sx-rate>
										</view>
										<view class="evaluate-wrapper">
											<text class="title">评价：</text>
											<text class="tip" v-if="!rate.isTaskCompleted">项目还未结束，暂未开启评价</text>
											<text class="tip" v-else-if="!rate.isCanMemberComment">项目未开启评价</text>
											<text class="tip" v-else-if="rate.cstScore == 0">等待客户评价</text>
											<view v-else class="content">{{ rate.cstComment }}</view>
										</view>
									</view>
									<!-- 回复 -->
									<view class="reply-wrapper" v-if="(isCoordinator || isEditAll) && rate.cstScore > 0">
										<view class="title-wrapper">
											<view class="title">{{(isCoordinator || isEditAll) ? '我的回复：' : '回复：'}}</view>
											<view
												class="btn"
												v-if="rate.cstScore > 0 && !rate.commentReplyContent && (isCoordinator || isEditAll)"
												@tap="gotoReply(rate)"
											>
												立即回复
											</view>
										</view>
										<view class="content">
											<view class="tip" v-if="rate.cstScore > 0 && !rate.commentReplyContent && (isCoordinator || isEditAll)">
												客户已评价，正等待您的回复噢！
											</view>
											<view v-if="rate.commentReplyContent">{{ rate.commentReplyContent }}</view>
										</view>
									</view>
								</view>
							</view>
							<!-- 宴会执行为空 -->
							<view v-else class="empty uni-flex uni-column">
								<view class="tip-wrapper uni-flex uni-row">
									<image class="img" :src="picDomain + '/upload/yytApp/banquet/info.png'" mode=""></image>
									<text class="tip">服务项目空空如也，请前往宴会执行板块完善</text>
								</view>
								<!-- <button class="cu-btn round lg bg-blue btn">立即选择主题</button> -->
								<!-- bg-blue实心按钮 line-blue 镂空按钮 -->
							</view>
						</scroll-view>
					</swiper-item>
				</swiper>
			</view>
			<!-- 宴会执行板块 -->
			<view
				v-show="isActive == 2"
				class="banquet-exec-wrapper"
				:style="{ paddingTop: banquetExecQuery.banquetExectorDisplayType == 1 && projectArr.length > 0 ? '108rpx' : '0' }"
			>
				<!-- 宴会执行为空 -->
				<view class="empty uni-flex uni-column" @tap="addTheme" v-if="!banquetDetailData.themeConfGUID">
					<view class="tip-wrapper uni-flex uni-row">
						<image class="img" :src="picDomain + '/upload/yytApp/banquet/info.png'" mode=""></image>
						<text class="tip">客户执行空空如也，需要您前往完善 >></text>
					</view>
					<button class="cu-btn round lg bg-blue btn">立即选择主题</button>
					<!-- bg-blue实心按钮 line-blue 镂空按钮 -->
				</view>

				<!-- ===== 按项目执行 ===== -->
				<block v-if="banquetExecQuery.banquetExectorDisplayType == 1">
					<view class="proj-tools-fixed uni-flex uni-row" v-show="banquetDetailData.themeConfGUID">
						<scroll-view
							scroll-x
							class="proj-tab nav"
							scroll-with-animation
							:scroll-left="projTabScrollLeft"
							:style="(isCoordinator || isEditAll) ? 'width: 90%;' : 'width: 100%;'"
						>
							<view
								v-if="projectArr.length > 0"
								class="cu-item"
								:class="index == projSelected ? 'text-blue cur short' : 'text-dark-gray'"
								v-for="(item, index) in projectArr"
								:key="index"
								@tap="projTabSelect"
								:data-id="index"
							>
								<view class="title">
									<view class="dot" :class="timeStateOfColorForTab(index)"></view>
									{{ item.projectConfName }}
								</view>
								<view class="number">{{ `(${item.executedCount}/${item.allCount})` }}</view>
							</view>
						</scroll-view>
						<view class="add-proj-wrapper uni-flex yyt-flex-center" @tap="showProjPopup">
							<uni-icons type="more-filled" size="60r" color="#0183FF"></uni-icons>
						</view>
					</view>
					<swiper
						v-if="projectArr.length > 0"
						class="swiper"
						style="height: 100%;"
						:current="projSelected"
						@change="changeProjTabSelect"
						:indicator-dots="false"
						:autoplay="false"
						:interval="500"
						:duration="300"
					>
						<swiper-item v-for="(proj, index) in projectArr" :key="proj.id">
							<scroll-view scroll-y="true" class="scroll-view-wrapper">
								<!-- 任务列表（项目划分） -->
								<view class="proj-list">
									<checkbox-group @change="projCheckboxChange">
										<view class="item"
											v-for="taskItem in proj.bOrderOfTaskViewDtos"
											:key="taskItem.id"
											@tap="gotoTask(taskItem)">
											<view class="task-title-wrapper uni-flex uni-row">
												<checkbox
													disabled
													@tap.stop="checkTheTaskCanBeClose(taskItem)"
													:value="taskItem.id"
													:checked="taskItem.isExecuted == '1'"
													class="customer-checkbox"
												/>
												<view class="title" :style="{ textDecoration: taskItem.isExecuted == '1' ? 'line-through' : 'none' }">
													{{ taskItem.taskConfName }}
												</view>
												<!-- 执行人 -->
												<view class="name">{{ taskItem.banquetTaskExecutorNames }}</view>
											</view>
											<view class="other-info-wrapper uni-flex uni-row" v-show="taskItem.isExecuted == '0'">
												<view class="date" :class="timeStateOfColor(taskItem.diffaultTime)">
													{{ taskItem.executeDate | parseShortDate }} 截止
												</view>
												<image v-if="taskItem.fileCount > 0" class="img margin-left" :src="picDomain + '/upload/yytApp/banquet/files.png'"></image>
												<image v-if="taskItem.imgCount > 0" class="img margin-left" :src="picDomain + '/upload/yytApp/banquet/picture.png'"></image>
												<view class="signature-wrapper margin-left" v-if="taskItem.cstSignImgUrl !== ''">
													<image class="img" :src="picDomain + '/upload/yytApp/banquet/sign.png'"></image>
													<image class="signature" :src="taskItem.cstSignImgUrl"></image>
												</view>
											</view>
											<view
												class="notes-wrapper uni-flex uni-row"
												v-if="
													taskItem.banquetTaskRemark && taskItem.banquetTaskRemark.length > 0 && taskItem.isExecuted == '0'
												"
											>
												<image class="img" :src="picDomain + '/upload/yytApp/banquet/remark.png'"></image>
												<view class="notes">{{ taskItem.banquetTaskRemark }}</view>
											</view>
											<view class="done-wrapper uni-flex uni-row" v-if="taskItem.isExecuted == '1'">
												<view class="dot bg-blue"></view>
												<view class="date">{{ taskItem.factExecuteDate | parseDatetime }}</view>
												<view class="name">{{ taskItem.factExecutorName }}</view>
												<view class="desc">已经完成了任务</view>
											</view>
										</view>
										<!-- 客户档案列表底部按钮 -->
										<view class="task-bottom" v-show="isActive == 2 && isCoordinator">
											<view class="yyt-list-item" style="width: 100%; margin-right: 10rpx;"
												@tap="addTask(proj.id)">
												<view class="title text-bold">添加任务</view>
												<view class="arrow-wrapper" style="height: 90rpx;">
													<uni-icons type="plusempty" size="70r" color="#aaa"></uni-icons>
													<!-- <sw-icon :size="20" class="uni-icon-wrapper" color="#aaa" type="plusempty" /> -->
												</view>
											</view>
										</view>
									</checkbox-group>
								</view>
							</scroll-view>
						</swiper-item>
					</swiper>
				</block>
				<!-- ===== 按时间执行 ===== -->
				<block v-if="banquetExecQuery.banquetExectorDisplayType == 2">
					<scroll-view scroll-y="true" class="scroll-view-wrapper">
						<!-- 任务列表（时间划分） -->
						<view class="date-list">
							<view class="item-wrapper" v-for="(time, index) in timeArr" :key="time.taskExecuteDate">
								<view class="date-wrapper uni-flex uni-row">
									<view class="date margin-right" :class="timeStateOfColor(time.diffaultTime, 'time')">{{ time.taskExecuteDate | parseShortDate }}</view>
									<view class="desc">
										<block v-if="time.signDiffDay !== ''">
											签单{{ +time.signDiffDay > 0 ? '后' : +time.signDiffDay == 0 ? '当' : '前'}}
											<text>{{ Math.abs(time.signDiffDay) == 0 ? '' : Math.abs(time.signDiffDay) }}</text>天
											<block v-if="time.executedDiffDay!==''">，</block>
										</block>
										<block v-if="time.executedDiffDay !== ''">
											宴会执行{{ +time.executedDiffDay > 0 ? '后' : +time.executedDiffDay == 0 ? '当' : '前'}}
											<text>{{ Math.abs(time.executedDiffDay) == 0 ? '' : Math.abs(time.executedDiffDay) }}</text>天
										</block>
									</view>
								</view>
								<checkbox-group @change="timeCheckboxChange($event, index)">
									<view
										v-if="time.bOrderOfTaskViewDtos.length > 0"
										class="item"
										v-for="taskItem in time.bOrderOfTaskViewDtos"
										:key="taskItem.id"
										@tap="gotoTask(taskItem)"
									>
										<view class="task-title-wrapper uni-flex uni-row">
											<checkbox
												disabled
												@tap.stop="checkTheTaskCanBeClose(taskItem)"
												:value="taskItem.id"
												:checked="taskItem.isExecuted == '1'"
												class="customer-checkbox"
											/>
											<view class="title" :style="{ textDecoration: taskItem.isExecuted == '1' ? 'line-through' : 'none' }">
												{{ taskItem.taskConfName }}
											</view>
											<!-- 执行人 -->
											<view class="name">{{ taskItem.banquetTaskExecutorNames }}</view>
										</view>
										<view class="other-info-wrapper uni-flex uni-row">
											<view class="project-name">{{ taskItem.projectConfName }}</view>
											<block v-if="taskItem.isExecuted == '0'">
												<image v-if="taskItem.fileCount > 0" class="img margin-left" :src="picDomain + '/upload/yytApp/banquet/files.png'"></image>
												<image v-if="taskItem.imgCount > 0" class="img margin-left" :src="picDomain + '/upload/yytApp/banquet/picture.png'"></image>
												<view class="signature-wrapper margin-left" v-if="taskItem.cstSignImgUrl !== ''">
													<image class="img" :src="picDomain + '/upload/yytApp/banquet/sign.png'"></image>
													<image class="signature" :src="taskItem.cstSignImgUrl"></image>
												</view>
											</block>
										</view>
										<view
											class="notes-wrapper uni-flex uni-row"
											v-show="taskItem.banquetTaskRemark && taskItem.banquetTaskRemark.length > 0 && taskItem.isExecuted == '0'"
										>
											<image class="img" :src="picDomain + '/upload/yytApp/banquet/remark.png'"></image>
											<view class="notes">{{ taskItem.banquetTaskRemark }}</view>
										</view>
										<view class="done-wrapper uni-flex uni-row" v-if="taskItem.isExecuted == '1'">
											<view class="dot bg-blue"></view>
											<view class="date">{{ taskItem.factExecuteDate | parseDatetime }}</view>
											<view class="name">{{ taskItem.factExecutorName }}</view>
											<view class="desc">已经完成了任务</view>
										</view>
									</view>
								</checkbox-group>
							</view>
						</view>
					</scroll-view>
				</block>
			</view>
		</view>
		<!-- ========================= 客户详情主题 END ========================= -->

		<!-- ========================= 其他 START ========================= -->
		<!-- 弹出取消订单提示框 -->
		<uni-popup ref="cancelPopup" type="center" class="tip-popup" :custom="true">
			<view class="wrapper">
				<view class="popup-top">
					<text>提示</text>
					<image class="popup-top-img" :src="picDomain + '/upload/yytApp/banquet/quxiao.png'" mode="" @tap="cancelOrder()"></image>
				</view>
				<!-- popup中部 -->
				<view class="popup-mid">
					<image class="popup-mid-img" :src="picDomain + '/upload/yytApp//banquet/error.png'" mode=""></image>
					<text>您确定要取消该订单？</text>
				</view>
				<view class="popup-bot">
					<view class="cancel" @tap="cancelOrder()">取消</view>
					<view class="confirm" @tap="confirmCancel()">确定</view>
				</view>
			</view>
		</uni-popup>
		<!-- 底部弹出的操作项目popup -->
		<uni-popup ref="projPopupRef" type="bottom" class="bottom-popup" :custom="true" :maskClick="true">
			<view class="wrapper">
				<view class="pop-group">
					<view class="item" @tap="addProj">新增项目</view>
					<view class="item" @tap="removeProj" v-show="projectArr.length > 0">删除项目</view>
				</view>
				<view class="pop-group"><view class="item" @tap="closeProjPopup">取消</view></view>
			</view>
		</uni-popup>
		<!-- 删除项目的中间弹窗popup -->
		<uni-popup ref="projWarningPopupRef" type="center" class="tip-popup" :custom="true">
			<view class="wrapper">
				<view class="popup-top">
					<text>提示</text>
					<image class="popup-top-img" :src="picDomain + '/upload/yytApp/banquet/quxiao.png'" mode="" @tap="cancelRemovetProj()"></image>
				</view>
				<!-- popup中部 -->
				<view class="popup-mid">
					<image class="popup-mid-img" :src="picDomain + '/upload/yytApp/banquet/error.png'" mode=""></image>
					<text class="popup-mid-text">删除项目是将项目下所有的任务都删除，您确定是否删除？</text>
				</view>
				<view class="popup-bot">
					<view class="confirm" @tap="confirmRemoveProj()">确定</view>
					<view class="cancel" @tap="cancelRemovetProj()">取消</view>
				</view>
			</view>
		</uni-popup>
		<!-- 更换主题的中间弹窗popup -->
		<uni-popup ref="changeThemePopupRef" type="center" class="tip-popup" :custom="true">
			<view class="wrapper">
				<view class="popup-top">
					<text>提示</text>
					<image class="popup-top-img" :src="picDomain + '/upload/yytApp/banquet/quxiao.png'" mode="" @tap="cancelChangeTheme()"></image>
				</view>
				<!-- popup中部 -->
				<view class="popup-mid">
					<image class="popup-mid-img" :src="picDomain + '/upload/yytApp/banquet/error.png'" mode=""></image>
					<text class="popup-mid-text">更换主题会重新配置项目和主题，确定更换吗？（已执行的任务会保留）</text>
				</view>
				<view class="popup-bot">
					<view class="cancel" @tap="addTheme()">确定</view>
					<view class="confirm" @tap="cancelChangeTheme()">取消</view>
				</view>
			</view>
		</uni-popup>
		<!-- ========================= 其他 END ========================= -->
	</view>
</template>

<script>
export { default } from './banquetDetail.js';
</script>

<style lang="less" scoped>
@import url('banquetDetail.less');
</style>

