<template>
    <view class="sel-executor">
        <view class="select-all">
        	<label @tap="checkAll">
				<checkbox value="" :checked="isCheckAll" style="transform:scale(0.7)"/>执行人
			</label>
			<view>已选{{executorIds.length}}</view>
        </view>
		<view class="select-list">
			<checkbox-group >
				<label class="uni-list-cell uni-list-cell-pd" v-for="item in executorList" :key="item.marketerID" @tap="checkboxChange(item)">
					<view><checkbox :value="item.marketerID" :checked="item.checked" style="transform:scale(0.6)" /></view>
					<view class="checkbox-label">{{ item.marketerName }}</view>
				</label>
			</checkbox-group>
		</view>
    </view>
</template>

<script>
    export { default } from './selExecutor.js';
</script>

<style lang="less" scoped>
    @import url('selExecutor.less');
</style>
