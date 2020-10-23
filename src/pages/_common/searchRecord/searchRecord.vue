<template>
	<view id="search-record" :style="{ height: searchText ? '100%' : 'auto' }">
		<!-- 顶部搜索框 -->
		<view class="search-input">
			<input
				type="text"
				class="input"
				placeholder="请输入电话/姓名/速查码"
				v-model="searchText"
				v-focus
				@input="updateSearchkeyword"
			/>
			<view class="search-right">
				<navigator open-type="navigateBack" :delta="1">
					<view class="cancel">取消</view>
				</navigator>
				<!-- <view class="cancel yyt-extend-area" v-show="searchText" @tap="searchText = ''">取消</view> -->
			</view>
			
		</view>
		<!-- 搜索栏内容为空，则显示搜索历史UI -->
		<view class="search-record" v-if="!searchText">
			<view class="search-history">
				<view class="header">
					<text class="cuIcon-time custom-gray" style="padding-right: 10rpx;"></text>
					<text class="title">搜索历史</text>
				</view>
				<view class="content" v-if="searchHistoryArr.length > 0">
					<text
						class="history-item bg-gray"
						v-for="(item, index) in searchHistoryArr"
						:key="index"
						@tap="searchText = item"
					>
						{{ item }}
					</text>
				</view>
			</view>
			<view class="del-history" v-if="searchHistoryArr.length > 0">
				<text class="custom-gray cuIcon-delete" style="padding-right: 10rpx;"></text>
				<text class="title" @tap="delHistory">清除历史记录</text>
			</view>
		</view>
		<!-- 搜索栏内容为空，则显示 通话记录 + 客户列表 tab 切换栏 -->
		<view class="call-customer" v-if="!searchText">
			<view class="customer-tab">
				<text
				v-if="!isiOS"
					class="tab-item tab-left"
					@tap="changeCallTab(0)"
					:class="curInx == 0 ? 'tab-active' : ''"
				>
					通话记录
				</text>
				<text
					class="tab-item tab-right"
					@tap="changeCallTab(1)"
					:class="curInx == 1 ? 'tab-active' : ''"
					:style="{ 'border-top-left-radius': isiOS ? '10rpx' : '', 'border-bottom-left-radius': isiOS ? '10rpx' : '' }"
				>
					我的客户
				</text>
			</view>
			<view class="customer-group">
				<!-- <scroll-view
						scroll-y
						scroll-with-animation
						:style="{'height':scrollviewHight+'px'}"
					> -->
				<view class="customer-item" v-if="curInx == 0">
					<view class="call-record" v-for="(item, index) in callPhoneRecodeInfo" :key="index">
						<view class="customer-top" @tap="goCustomerHandle(item)">
							<view class="customer-info">
								<view class="customer-name">
									<text class="title">姓名:</text>
									<!-- 客户名、通讯录名 -->
									<text v-if="item.customerName || item.customSaveName" class="name-desc">{{ item.customerName }} {{item.customSaveName ? `(${item.customSaveName})` : ''}}</text>
									<text v-else class="name-desc">非客户</text>
									<image
										class="rank-icon"
										mode="widthFix"
										:src="picDomain + item.customerLevelImgUrl"
										v-if="item.isNotCustomer == '0' && item.customerLevelImgUrl"
									/>
								</view>
								<view class="customer-tel">
									<text class="title">电话:</text>
									<text class="desc">{{ item.phone }}</text>
								</view>
								<view class="customer-add" v-if="!fromBook && item.isNotCustomer">
									<text class="lg text-blue cuIcon-friendadd add-icon"></text>
									<text class="desc text-blue" @tap.stop="addCustomer(item)">新增客户</text>
								</view>
							</view>
							<view class="customer-company" v-if="!item.isNotCustomer">
								<text class="title">单位:</text>
								<text class="desc">{{ item.company || '暂无单位' }}</text>
							</view>
						</view>
						<view class="customer-fee" v-if="item.isNotCustomer == '0'">
							<view class="customer-habit">
								<view
									class="customer-tag"
									v-if="item.tags !== undefined && item.tags.length > 0"
								>
									<text class="title">标签:</text>
									<view class="content">
										<text
											class="tag-item text-blue desc"
											v-for="(tag, index) in item.tags"
											:key="index"
										>
											{{ tag }}
										</text>
										<!-- <text class="tag-item desc">双十一参加活动</text>
												<text class="tag-item desc">有券就买客户</text>
												<text class="tag-item desc">进3个月新增会员</text>
												<text class="tag-item desc">三月份有可能举办婚宴</text> -->
									</view>
								</view>
								<view class="customer-frequency">
									<text class="title">消费频次:</text>
									<text class="desc custom-gray">{{ item.payCount }}</text>
								</view>
								<view class="customer-consume">
									<view class="customer-average">
										<text class="title">订单均额:</text>
										<text class="desc custom-gray">
											{{ (item.bookMoneyAvg || '0') | currency }}元
										</text>
									</view>
									<view class="customer-money">
										<text class="title">金额:</text>
										<text class="desc custom-gray">
											{{ item.bookMoneySum | currency }}元
										</text>
									</view>
								</view>
							</view>
							<view class="recent-booking" v-if="item.latelyBook">
								<view class="booking-top desc">
									<text class="title_text">近期预订</text>
									<text class="title_date">
										{{ item.latelyBook.bookOn | parseShortDate }}
									</text>
								</view>
								<view class="booking-content ">
									<view class="booking-item custom-gray title">
										<text>餐别:</text>
										<text>{{ item.latelyBook.diningTypeName }}</text>
									</view>
									<view class="booking-item custom-gray title">
										<text>类型:</text>
										<text>{{ item.latelyBook.bookOrderTypeName }}</text>
									</view>
									<view class="booking-item custom-gray title">
										<text>桌数:</text>
										<text>{{ item.latelyBook.bookTableNum }}桌</text>
									</view>
								</view>
							</view>
							<view class="recore-handle" v-if="!fromBook">
								<view class="handle-item">
									<text class="lg  text-blue uni-icon uni-icon-phone icon"></text>
									<text class="text-blue desc" @tap="followConsumeRecord(item)">
										跟踪消费记录
									</text>
								</view>
								<view class="lineFlag"></view>
								<view class="handle-item">
									<text class="lg  text-blue uni-icon uni-icon-plus  icon"></text>
									<text class="text-blue desc" @tap="fastBook(item)">立即预订</text>
								</view>
							</view>
						</view>
						<view class="customer-footer">
							<text class="date">{{ item.beginTime }}</text>
							<text class="text-red desc" v-if="!item.isNotCustomer">客户</text>
							<text class="text-red desc" v-else>非客户</text>
						</view>
					</view>
				</view>
				<view class="customer-item" v-else>
					<view
						class="customer-list"
						v-for="(item, index) in customerListInfo"
						:key="index"
						@tap="goCustomerHandle(item)"
					>
						<view class="rank-info">
							<view class="rank-info-top">
								<image
									class="customer-img"
									mode="widthFix"
									:src="getCustomerImg(item.headImg)"
								/>
								<image
									class="rank-icon"
									v-if="item.customerLevelImgUrl"
									mode="widthFix"
									:src="item.customerLevelImgUrl"
								/>
							</view>
							<view class="rank-info-bottom">
								<text class="customer-name">{{ item.customerName }}</text>
							</view>
						</view>
						<view class="compay-info">
							<text class="tel">{{ item.phone }}</text>
							<text class="company">{{ item.companyName }}</text>
						</view>
						<view class="fast-book" v-if="!fromBook">
							<text class="lg  text-blue cuIcon-roundadd title padding-xs"></text>
							<text class="book text-blue" @tap.stop="fastBook(item)">立即预订</text>
						</view>
					</view>
					<uni-load-more
						:status="status"
						:contentText="contentText"
						color="#007aff"
					></uni-load-more>
				</view>
				<!-- </scroll-view> -->
			</view>
		</view>

		<!-- 搜索栏内容不为空，则显示搜索结果 -->
		<view class="list-customer" v-if="searchText">
			<!-- goCustomerHandle 方法中判断是否从今日预订过来的 -->
			<view
				class="customer-list"
				v-for="(item, index) in searchCustomerAndRecord"
				:key="index"
				@tap="goCustomerHandle(item)"
			>
				<!-- 是客户，最左侧显示头像等级图标和客户名字；非客户显示文字{非客户} -->
				<view class="rank-info" v-if="!item.isNotCustomer" @tap="gotoCustomer">
					<view class="rank-info-top">
						<image
							class="customer-img"
							mode="widthFix"
							:src="getCustomerImg(item.headImg)"
							v-if="!item.isNotCustomer"
						/>
						<image
							class="rank-icon"
							v-if="item.customerLevelImgUrl"
							mode="widthFix"
							:src="item.customerLevelImgUrl"
						/>
					</view>
					<view class="rank-info-bottom" v-if="!item.isNotCustomer&&!item.isRecord">
						<text class="customer-name text-cut">{{ item.customerName }}</text>
					</view>
					<view class="rank-info-bottom" v-if="!item.isNotCustomer&&item.isRecord">
						<text class="customer-name text-cut">{{ item.customerName }}（通讯录）</text>
					</view>
				</view>
				<view class="rank-info" v-else @tap="gotoCustomer"><view>非客户</view></view>
				<!-- 是客户：显示上下两行，手机号+公司（没公司显示为空，但占位）；非客户：不显示公司，只显示手机号，垂直居中显示 -->
				<view class="compay-info" v-if="!item.isNotCustomer" @tap="gotoCustomer">
					<view class="tel text-cut" @tap="gotoCustomer">{{ item.phone }}</view>
					<view class="company">{{ item.companyName }}</view>
				</view>
				<view class="compay-info" v-else style="justify-content: center;" @tap="gotoCustomer">
					<view class="tel text-cut" @tap="gotoCustomer" style="flex: none;">{{ searchText }}</view>
				</view>

				<!-- 如果从今日预订过来的，最右侧就不显示任何内容；
					否则根据当前用户是否已经是客户来决定显示 立即预订，还是新增客户  -->
				<view class="booking-handle" v-if="!fromBook" @tap="gotoCustomer">
					<view class="fast-book" v-if="!item.isNotCustomer">
						<text class="lg  text-blue cuIcon-roundadd  padding-xs"></text>
						<text class="book text-blue" @tap.stop="fastBook(item)">立即预订</text>
					</view>
					<view class="add-book" v-else>
						<text class="lg text-blue cuIcon-friendadd add-icon padding-xs"></text>
						<text class="book text-blue" @tap.stop="addCustomer(item)">新增客户</text>
					</view>
				</view>
			</view>
		</view>
	</view>
</template>

<script>
export { default } from './searchRecord.js';
</script>

<style lang="less" scoped>
@import url('searchRecord.less');
</style>
