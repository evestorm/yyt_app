<template>
	<view class="home-setting">
		<!-- 导航栏 -->
		<z-nav-bar class="z-nav-bar" :title="'首页设置'" :back="false" bgColor="#0782ff" fontColor="#FFF">
			<!-- 返回 -->
			<sw-icon type="back" size="27" slot="left" @tap="onBack" color="#FFF"></sw-icon>
			<!-- 保存 -->
			<view class="right-selector" slot="right" @tap="saveTheConfig">
				<text class="tools-text">保存</text>
			</view>
		</z-nav-bar>
		<!-- 配置列表 -->
		<div class="options-wrapper">
			<!-- 首页快速菜单 -->
			<view class="menu-list list-title">
				<text>应用入口设置</text><text>长按上下拖动进行排序</text>
			</view>
			<drag-sort-settings ref="menuList" :limit="99" :list="menuList" :props="props" @change="onDragChange($event, 'menuList')" @changeOpenStatus="triggerOpenStatus"></drag-sort-settings>
			<!-- 运营概况板块设置 -->
			<!-- <view class="operation-list list-title">
				<text>运营概况设置</text><text>长按上下拖动进行排序</text>
			</view>
			<drag-sort-settings ref="operationList" :list="operationList" :props="props" @change="onDragChange($event, 'operationList')" @changeOpenStatus="triggerOpenStatus"></drag-sort-settings> -->
		</div>
	</view>
</template>

<script>
export { default } from './homeSetting.js';
</script>

<style lang="less" scoped>
@import url('homeSetting.less');
</style>
