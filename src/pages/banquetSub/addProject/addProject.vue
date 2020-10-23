<template>
	<view class="">
		<view class="add-proect">
			<view class="title">
				<text class="title-name">项目</text>
				<text class="title-check-num">已选：{{ projectNum }}个项目({{ taskNum }}个任务)</text>
			</view>
			<mescroll-uni :down="downOption" @down="downCallback" :up="upOption" @up="upCallback" :top="100" class="task-list">
				<!-- <view class=""> -->
				<view class="task-list-item" v-for="item in projectList" :key="item.id" @tap="gotoAddTask(item)">
					<label class="checkbox-label" @tap.stop="checkboxChange(item)">
						<view>
							<checkbox :value="item.id" :checked="item.checked" style="transform:scale(0.6)" />
							<text class="">{{ item.projectConfName }}</text>
						</view>
					</label>
					<view class="jump">
						<text class="task-num" v-show="item.taskConfGUIDs.length != 0">{{ item.taskConfGUIDs.length }}个任务</text>
						<image class="arrowRight" :src="picDomain + '/upload/yytApp/images/arrowRight.png'"></image>
					</view>
				</view>
				<!-- </view> -->
			</mescroll-uni>
		</view>
	</view>
</template>

<script>
export { default } from './addProject.js';
</script>

<style lang="less" scoped>
@import url('addProject.less');
</style>
