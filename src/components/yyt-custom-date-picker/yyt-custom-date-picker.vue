<template>
	<view>
		<scroll-view scroll-x class="time-tab bg-white nav">
			<view class="date-picker-wrapper d-flex j-start a-center">
				<view
					v-for="(item, idx) in dateArr"
					:key="idx"
					class="cu-item px-2 mx-2 text-center"
					:class="item.selected ? 'text-blue cur short' : 'text-light-muted'"
					:style="{ 'marginLeft': idx == dateArr.length - 1 ? 'auto' : '', 'width': idx == dateArr.length - 1 && item.selected ? '216rpx' : '', 'fontSize': idx == dateArr.length - 1 && item.selected ? '24rpx' : ''}"
					@tap="_onSelectDate($event, item, idx)"
				>
					{{ item.label }}
				</view>
			</view>
		</scroll-view>
		<!-- 时间范围筛选 -->
		<yyt-picker 
			mode="range"
			format="YYYY-MM-DD"
			:startYear="startDateStr" 
			:endYear="endDateStr"
			:defaultVal="defaultDateRangeArr"
			:current="false"
			@confirm="_onConfirmDateRange"
			@cancel="_onCancelPickerSelect"
			ref="dateRangePicker" 
			themeColor="#007AFF"
		></yyt-picker>
	</view>
</template>

<script>
export { default } from './yyt-custom-date-picker.js'
</script>

<style lang="less" scoped>
@import url('yyt-custom-date-picker.less');
</style>
