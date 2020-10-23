<!--作者:覃彬-->
<template>
	<view class="yyt-choose-table">
		<uni-popup ref="tableCount" class="modalDlg">
			<view class="modalDlg_top">
				<view class="modalDlg_top_raedonly"></view>
				<text class="icon iconfont icon-jt-left modalDlg_top_icon" @tap="goBack"></text>
				<input type="number" placeholder="桌数" :value="tableNum" @input="readyTableNum" minlength="0" :maxlength="readyTableNum" v-show="isShowLen"></input>
				<input type="number" placeholder="备桌数" :value="tableLenNum" @input="readyTableNum" minlength="0" :maxlength="readyTableNumLen" v-show="!isShowLen"></input>
				<text class="modalDlg_top_text">桌</text>
			</view>
			<view class="modalDlg_content">
				<view class="modalDlg_content_item" data-inx="1" @tap="selectExtraDesknum(1)">
					<text :class="(isChecked==1?'is_checked1':'normal')">1</text>
				</view>
				<view class="modalDlg_content_item" data-inx="2" @tap="selectExtraDesknum(2)">
					<text :class="(isChecked==2?'is_checked1':'normal')">2</text>
				</view>
				<view class="modalDlg_content_item" data-inx="3" @tap="selectExtraDesknum(3)">
					<text :class="(isChecked==3?'is_checked1':'normal')">3</text>
				</view>
				<view class="modalDlg_content_item" data-inx="4" @tap="selectExtraDesknum(4)">
					<text :class="(isChecked==4?'is_checked1':'normal')">4</text>
				</view>
				<view class="modalDlg_content_item" data-inx="5" @tap="selectExtraDesknum(5)">
					<text :class="(isChecked==5?'is_checked1':'normal')">5</text>
				</view>
				<view class="modalDlg_content_item" data-inx="6" @tap="selectExtraDesknum(6)">
					<text :class="(isChecked==6?'is_checked1':'normal')">6</text>
				</view>
				<view class="modalDlg_content_item" data-inx="7" @tap="selectExtraDesknum(7)">
					<text :class="(isChecked==7?'is_checked1':'normal')">7</text>
				</view>
				<view class="modalDlg_content_item" data-inx="8" @tap="selectExtraDesknum(8)">
					<text :class="(isChecked==8?'is_checked1':'normal')">8</text>
				</view>
				<view class="modalDlg_content_item" data-inx="9" @tap="selectExtraDesknum(9)">
					<text :class="(isChecked==9?'is_checked1':'normal')">9</text>
				</view>
			</view>
			<view class="modalDlg_bottom">
				<text @tap="cancel">取消</text>
				<text :class="(isChecked==0?'is_checked1':'normal')" data-inx="0" @tap="selectExtraDesknum(0)">0</text>
				<text @tap="_confirm">确定</text>
			</view>
		</uni-popup>
	</view>
</template>

<script>
export { default } from './yyt-choose-table.js';
</script>

<style lang="less" scoped>
@import url('yyt-choose-table.less');
</style>
