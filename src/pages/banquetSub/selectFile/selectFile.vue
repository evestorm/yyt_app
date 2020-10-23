<template>
	<view class="select-file">
		<view class="select-title">选择需要填写的档案</view>
		<view class="select-files">
			<radio-group @change="radioChange">
				<label class="uni-list-cell uni-list-cell-pd" v-for="(item, index) in files" :key="item.value">
					<view>
						<radio style="transform:scale(0.5)" :value="item.id" :checked="index === current" />
					</view>
					<view>{{item.cstRecordConfName}}</view>
				</label>
			</radio-group>
		</view>
	</view>
</template>

<script>
export { default } from './selectFile.js';
</script>

<style lang="less" scoped>
@import url('selectFile.less');
</style>
