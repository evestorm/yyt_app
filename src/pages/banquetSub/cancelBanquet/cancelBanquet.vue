<template>
	<view class="">
		<view class="fllow-top">
			<view class="fllow-fllow">
				<textarea class="fllow-top-textarea" v-model="queryData.clueCancleReason" placeholder="请填写取消的原因" />
				<text class="fllow-top-textarea-tip">{{ textearaLength }}/300</text>
			</view>
		</view>
		<view class="cancel">
			<view class="cancelTitle">快捷备注</view>
			<view class="cancelEdit" @tap="showEdit()">{{edits.length==0?'':isEdit?'取消':'删除项'}}</view>
			<view class="">
				<view class="edits">
					<!-- 编辑项 -->
					<view class="editList" v-for="(item, index) in edits" :key="index">
						<view class="editList-text" @tap="pushRemark(item.bizOptionName)">{{ item.bizOptionName }}</view>
						<image @tap="delRemark(item.id)" v-show="isEdit" class="editList-img" :src="picDomain + '/upload/yytApp/banquet/clices.png'" mode=""></image>
					</view>
					<view class="edit-add" @tap="addPopup()"><image class="edit-add-img" :src="picDomain + '/upload/yytApp/banquet/add.png'" mode=""></image></view>
				</view>
			</view>
		</view>
		<!-- //确认提示框 -->
		<uni-popup ref="delRemarkItem" type="center" class="tip-popup" :custom="true">
			<view class="wrapper">
				<view class="popup-top">
					<text class="top-msg">提示</text>
					<image @tap="closePopup()" class="popup-top-img" :src="picDomain + '/upload/yytApp/banquet/quxiao.png'" mode=""></image>
				</view>
				<view class="popup-mid">
					<image class="popup-mid-img" :src="picDomain + '/upload/yytApp/banquet/error.png'" mode=""></image>
					<text class="text">是否确认删除该快捷备注？</text>
				</view>
				<view class="popup-bot">
					<view class="cancel" @tap="closePopup()">取消</view>
					<view class="confirm" @tap="deleteByDto()">确定</view>
				</view>
			</view>
		</uni-popup>
		<uni-popup ref="cancelPopup" type="bottom" class="cancel-popup">
			<view class="cancel-popup-title">添加快捷备注</view>
			<view class="cancel-popup-mid">
				<text class="mid-text">备注:</text>
				<input class="mid-input" type="text" v-model="editInput" placeholder="请输入快捷备注" />
			</view>
			<view class="bot">
				<view class="btn qx" @tap="qxChangCustomer()">取消</view>
				<view class="btn qd" @tap="qdChangCustomer()">确定</view>
			</view>
		</uni-popup>
	</view>
</template>

<script>
export { default } from './cancelBanquet.js';
</script>

<style lang="less" scoped>
@import url('cancelBanquet.less');
</style>
