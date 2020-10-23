<template>
	<!-- 可视区域容器 -->
	<view ref="list" :style="{ height }" class="infinite-list-container" @scroll="scrollEvent($event)">
		<!-- 容器内的占位，高度为总列表高度，用于形成滚动条 -->
		<view ref="phantom" class="infinite-list-phantom"></view>
		<!-- 列表实际渲染区 -->
		<view ref="content" class="infinite-list">
			<view
				class="infinite-list-item"
				ref="items"
				:id="item._index"
				:key="item._index"
				v-for="item in visibleData"
			>
				<slot ref="slot" :item="item.item"></slot>
			</view>
		</view>
	</view>
</template>

<script>
export { default } from './virtualList.js';
</script>

<style lang="less" scoped>
@import url('virtualList.less');
</style>
