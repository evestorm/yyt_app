<template>
	<view>
		<view class="title">
			<view class="">
				<checkbox @tap="checkAll" class="" value="cb" :checked="isCheckAll" color="#0183ff" style="transform:scale(0.6)" />
				<text class="title-name">所属项目：</text>
				<text class="title-name-text">{{ projectList.projectConfName }}</text>
			</view>
			<text class="title-check-num">已选：{{ selNum }}</text>
		</view>
		<view class="add-proect">
			<view class="task-list">
				<view class="task-list-item">
					<checkbox-group>
						<label class="uni-list-cell uni-list-cell-pd" v-for="item in taskList" :key="item.id" @tap="checkboxChange(item)">
							<view>
								<checkbox class="checkbox-label" :value="item.id" :checked="item.checked" style="transform:scale(0.6)" />
								{{ item.taskConfName }}
							</view>
						</label>
					</checkbox-group>
				</view>
			</view>
		</view>
	</view>
</template>

<script>
export { default } from './addProjectTask.js';
</script>

<style lang="less" scoped>
@import url('addProjectTask.less');
</style>
