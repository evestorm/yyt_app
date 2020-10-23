<template>
	<view class="add-task">
		<view class="add-task-top">
			<view class="order-input">
				<uni-icons type="search" size="35r"></uni-icons>
				<input v-model="queryData.taskName" type="text" placeholder="请输入任务名称" />
			</view>
			<image :src="picDomain + '/upload/yytApp/banquet/shaixuan.png'" class="saixuan-img" @tap="showDrawer"></image>
		</view>
		<view class="title">
			<view class="">
				<text class="title-name">所属项目：</text>
				<text class="title-name-text">{{ projectTitle }}</text>
			</view>
			<text class="title-check-num">已选：{{ addTaskData.taskConfGUIDs.length }}</text>
		</view>
		<view class="add-proect">
			<!-- <view class="task-list"> -->
			<mescroll-uni :down="downOption" @down="downCallback" :up="upOption" @up="upCallback" :top="165" class="task-list">
				<view class="task-list-item">
					<!-- <view class="project-task">
						<checkbox class="" value="cb" checked="true" color="#0183ff" style="transform:scale(0.6)" />
						<text class="checkbox-label task-title-label">基础服务</text>
					</view> -->
					<checkbox-group>
						<label class="uni-list-cell uni-list-cell-pd" v-for="item in taskList" :key="item.id" @tap="checkboxChange(item)">
							<view><checkbox :value="item.id" :checked="item.checked" style="transform:scale(0.6)" /></view>
							<view class="checkbox-label">{{ item.taskConfName }}</view>
						</label>
					</checkbox-group>
				</view>
			</mescroll-uni>
		</view>
		<!-- 右侧筛选弹窗 -->
		<uni-drawer class="yyt-sidebar-wrapper " :visible="isShowSidebar" @close="closeDrawer" mode="right">
			<!-- <uni-popup ref="popup" type="right" class="right-popup"> -->
			<view class="right-popup">
				<view class="popup-title">任务类别</view>
				<view class="popup-list">
					<view
						class="popup-list-item popup-list-unsel"
						:class="{ popupListSel: isCheck == item.id }"
						v-for="item in taskRows"
						:key="item.id"
						@tap="checkTaskType(item.id)"
					>
						{{ item.bizOptionName }}
					</view>
				</view>
				<view class="sidebar-btn-fixed">
					<button class="cu-btn round lg line-blue" @tap="reSet()">重置</button>
					<button class="cu-btn round lg bg-blue" @tap="getPagedList()">完成</button>
				</view>
			</view>
		</uni-drawer>
		<!-- </uni-popup> -->
	</view>
</template>

<script>
export { default } from './addTask.js';
</script>

<style lang="less" scoped>
@import url('addTask.less');
</style>
