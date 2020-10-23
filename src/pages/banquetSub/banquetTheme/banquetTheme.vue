<template>
	<view class="theme" style="height:calc(100vh - 80upx)">
		<scroll-view scroll-y style="height:calc(100vh - 80upx)">
			<view
				v-for="(item, index) in themeConfListItem"
				:key="index"
				class="theme-from-type"
				:class="{ themeSel: typeId == item.bookOrderTypeID }"
				@tap="changeOrderType(item.bookOrderTypeID)"
			>
				{{ item.name }}
			</view>
		</scroll-view>
		<view class="" v-for="(item, parentIndex) in themeConfListItem" :key="themeConfListItem.parentIndex">
			<view class="theme-list" v-show="item.bookOrderTypeID == typeId">
				<view class="" v-for="(theme, childiIndex) in item.themeConfItems" :key="theme.id">
					<view class="theme-list-item" :class="{ themeItemSel: themeId == theme.id }" @tap="changeTheme(theme.id, theme.themeConfName)">
						<image
							class="theme-img"
							:src="themeId == theme.id ? picDomain + '/upload/yytApp/banquet/themeSel.png' : picDomain + '/upload/yytApp/banquet/theme.png'"
							mode=""
						></image>
						<view class="theme-list-item-text" :class="{ themeItemTextSel: themeId == theme.id }">{{ theme.themeConfName }}</view>
					</view>
				</view>
				<view class="no-data" v-show="item.themeConfItems.length == 0">
					<image class="img" src="https://pic.cwyyt.cn/upload/img/20200206/15000707_nodata.png" mode=""></image>
					<view class="text">该宴会类型暂无主题</view>
				</view>
			</view>
		</view>
		<!-- 无主题提示 -->
		<view class="no-datas" v-show="themeConfListItem.length == 0">
			<image class="img" src="https://pic.cwyyt.cn/upload/img/20200206/15000707_nodata.png" mode=""></image>
			<view class="text">暂无主题</view>
		</view>
	</view>
</template>

<script>
export { default } from './banquetTheme.js';
</script>

<style lang="less" scoped>
@import url('banquetTheme.less');
</style>
