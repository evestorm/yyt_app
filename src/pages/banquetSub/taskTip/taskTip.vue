<template>
    <view class="task-tip">
		<image class="task-img" :src="picDomain + '/upload/yytApp/banquet/task-tips.png'" mode=""></image>
		<view class="task-info">
			<view class="task-title">此任务还可以进行以下操作：</view>
			<ol type='1' class="task-list"> 
				<li class="task-list-item" v-show="tipList.isOpenToCst==1&&tipList.isSign==0&&tipList.isCanSign==1">客户签字</li>
				<li class="task-list-item" v-show="tipList.isOpenToCst==1&&tipList.isCstUploadFile==0&&tipList.isCanCstUploadFile==1">客户上传图片</li>
				<li class="task-list-item" v-show="tipList.isUploadFile==0&&tipList.isCanUPloadFile==1">上传文件</li>
				<li class="task-list-item" v-show="tipList.isUploadImg==0&&tipList.isCanUploadImg==1">上传图片</li>
				<li class="task-list-item" v-show="tipList.isRemark==0&&tipList.isCanRemark==1">添加备注</li>
				<li class="task-list-item" v-show="tipList.isRelatedDate==0&&tipList.isRelateDate==1">{{ralationTaskText}}</li>
			</ol>
		 </view>
		 <!-- 底部按钮 -->
		 <view class="foot-btn">
		 	<view class="btn suc" @tap="goOn">完成任务</view>
			<view class="btn go" @tap="goBack">继续完善</view>
		 </view>
		
    </view>
</template>

<script>
    export { default } from './taskTip.js';
</script>

<style lang="less" scoped>
    @import url('taskTip.less');
</style>
