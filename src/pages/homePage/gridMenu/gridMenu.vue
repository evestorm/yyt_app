<!--作者:杨亮-->
<template>
	<view class="gridMenu menu-wrapper" ref="menuRef">
		<view class="item" v-for="(item, index) in menuList" :key="item.code" @tap="_goNaviPage(item)">
			<view class="inner">
				<view class="badge d-flex justify-center align-center" v-if="item.operationParamJson && JSON.parse(item.operationParamJson).notCompleteCount > 0">{{ item.operationParamJson && JSON.parse(item.operationParamJson).notCompleteCount }}</view>
				<image class="img" :src="item.icon"></image>
				<text class="title">{{ item.name }}</text>
			</view>
		</view>
	</view>
</template>

<script>
    export { default } from './gridMenu.js';
</script>

<style lang="less" scoped>
    @import url('gridMenu.less');
</style>
