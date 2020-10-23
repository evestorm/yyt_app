<!--作者:覃彬-->
<template>
	<view class="content">
		<!--============================头部==================================================-->
		<view class="page-header nav d-flex a-center py-2 pl-3 bg-white">
			<view v-for="(item, index) in colorDocList" :key="index" class="d-flex a-center list">
				<view class="lib" :style="{ background: item.color }"></view>
				<view class="text">{{ item.label }}</view>
			</view>
		</view>

		<!--============================内容==================================================-->
		<view class="page-content" style="height:calc(100vh - 320rpx)">
			<view style="width: fit-content;background: #fff;">
				<!-- 日期+厅别固定 -->
				<view class="date-meal d-flex flex-nowrap font-weight font-28 text-center pdate">
					<view
						class="left-date bg-white py-3 d-flex flex-column j-center abs line-h"
						:style="{ height: dateH }"
					>
						日期
					</view>
					<view class="bg-white" style="min-width:calc(100vw - 126rpx)">
						<view class="dining-name d-flex a-center flex-nowrap">
							<view
								class="item"
								:style="{
									width:
										cellW *
											pageDetail.areaDailyStats[topIndex].areaDiningTypeStats.length +
										'px',
									display:
										pageDetail.areaDailyStats[topIndex].areaDiningTypeStats.length > 0
											? 'block'
											: 'none'
								}"
								v-for="(item, topIndex) in pageDetail.areaDailyStats"
								:key="topIndex"
							>
								{{ item.tableAreaName }}
							</view>
						</view>
					</view>
				</view>
				<!-- table主体 -->
				<view class=" d-flex text-center">
					<view class="table-con-data ">
						<view
							class="left-date1 bg-white d-flex align-center j-center"
							v-for="(date, dataIndex) in pageDetail.headDays"
							:key="dataIndex"
						>
							<text>{{ date }}</text>
						</view>
					</view>
					<view class="bg-white d-flex" style="min-width:calc(100vw - 126rpx)">
						<view class="d-flex  info" v-if="pageDetail.areaDailyStats">
							<!-- 区域 ：areaDailyStats   border border-primary-->
							<view
								class="area-state d-flex a-center"
								v-for="(areaItem, aIndex) in pageDetail.areaDailyStats"
								:key="aIndex"
							>
								<!-- 餐别：areaDiningTypeStats -->
								<view
									class="cell"
									v-for="(asItem, asIndex) in areaItem.areaDiningTypeStats"
									:key="asIndex"
								>
									<!-- 午餐 -->
									<view
										class="cell-item  d-flex flex-column"
										v-for="(dItem, dIndex) in asItem.diningTypeDailies"
										:key="dIndex"
									>
										<view class="line-h title d-flex a-center j-center">
											{{ asItem.diningTypeName }}
											<text v-if="dItem.orderCount > 0">*{{ dItem.orderCount }}</text>
										</view>
										<view
											class="d-flex a-center  flex-1 "
											:class="
												dItem.banquetOrderInfos.length > 3
													? 'flex-wrap'
													: 'flex-column'
											"
										>
											<view
												class="line-h text-white font-24 d-flex a-center j-center"
												v-for="(bItem, bIndex) in dItem.banquetOrderInfos"
												:key="bIndex"
												:class="
													dItem.banquetOrderInfos.length > 3
														? 'w-50 h-50'
														: 'flex-1 w-100'
												"
												:style="{
													background: colorDocList[bItem.bookOrderStatus].bgColor,
													visibility: bIndex > 3 ? 'hidden' : ''
												}"
											>
												{{ bItem.bookTableNum }}桌
											</view>
										</view>
									</view>
								</view>
							</view>
						</view>
					</view>
				</view>
			</view>
		</view>
		<!--===========================底部==================================================-->
	</view>
</template>

<script>
export { default } from './banquetPlanTable.js';
</script>

<style lang="less" scoped>
@import url('banquetPlanTable.less');
</style>
