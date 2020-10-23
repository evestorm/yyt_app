<template>
	<!-- 编辑/新增线索 -->
    <view id="addBanquet" style="height: 100vh; box-sizing: border-box;">
		<!-- 线索表单 -->
		<view class="add-form">
		    <view class="bq-form-group ">
		        <view class="title">姓名:<text style="color:red">*</text></view>
		        <input class="desc" placeholder-style="fontSize:22rpx" placeholder="请输入客户姓名" v-model="banquetFormData.clueUserName"></input>
		    </view>
			<view class="bq-form-group ">
			    <view class="title">电话:<text style="color:red">*</text></view>
			    <input class="desc" placeholder-style="fontSize:22rpx" placeholder="请输入电话" v-model="banquetFormData.clueUserPhone"></input>
			</view>
			<view class="bq-form-group ">
			    <view class="title">生日:</view>
				<picker class="desc" mode="date" :value="banquetFormData.clueUserBirthdayDate || '9999-99-99'"  @change="chooseDate">
				    <view class="picker">
				        {{banquetFormData.clueUserBirthdayDate}}
						<text class="text-date" v-show='!banquetFormData.clueUserBirthdayDate'>请选择生日</text>
						<image class="arrowRight" :src="picDomain + '/upload/yytApp/images/arrowRight.png'"></image>
					</view>
				</picker>
			</view>
			<view class="bq-form-group ">
			    <view class="title">单位:</view>
			    <input class="desc" placeholder-style="fontSize:22rpx" @blur="closeCompany" @focus="isCompanysShow= true" placeholder="请输入单位信息" v-model="companyNameText"></input>
			</view>
			<view class="search-company" v-if="isCompanysShow&&companyNameText&&companys.length>0">
				<view class="search-texe">搜索</view>
				<view class="search-group-company" v-for="(item,index) in companys" :key="index"  @tap="gotoCompany(item)">
					{{item.name}}
				</view>
			</view>
			<view class="bq-form-group ">
			    <view class="title">住址:</view>
			    <input class="desc" placeholder-style="fontSize:22rpx" placeholder="请输入地址信息" v-model="banquetFormData.clueUserAddress"></input>
			</view>
			<view class="bq-form-group ">
			    <view class="title">跟进人:</view>
				<picker class="desc" :value="index"  @change="chooseMarketer" :range="marketers" range-key="marketerName">
					<text class="des" v-if="marketerText!=''">{{marketerText}}</text> 
					<text class="text-date" v-else>请选择跟进人</text>
					<image class="arrowRight" :src="picDomain + '/upload/yytApp/images/arrowRight.png'"></image>
				</picker>
			</view>
			<view class="bq-form-group ">
			    <view class="title">线索成交率:</view>
				<picker class="desc" :value="levels.value"  @change="chooseLevel" :range="levels" range-key="text">
					{{banquetFormData.levelText}}
					<!-- <text class="text-date" v-show='banquetFormData.clueLevel.length==0'>请选择线索等级</text> -->
					<image class="arrowRight" :src="picDomain + '/upload/yytApp/images/arrowRight.png'"></image>
				</picker>
			</view>
			<view class="bq-form-group-textarea">
			    <view class="title">线索备注:</view>
				 <view class="uni-textarea">
					<textarea placeholder-style="fontSize:22rpx" placeholder="请输入线索信息" v-model="banquetFormData.clueRemark"/>
				 </view>
			</view>
			<view class="bq-form-group bot">
			    <view class="title">宴会类型:</view>
				<picker class="desc" :value="bookOrderIndex"  @change="chooseBookOrder" :range="bookOrderList" range-key="name">
					<text class="des" v-if="bookOrderName">{{bookOrderName}}</text> 
					<text class="text-date" v-else>请选择宴会类型</text>
					<image class="arrowRight" :src="picDomain + '/upload/yytApp/images/arrowRight.png'"></image>
				</picker>
			</view>
			<view class="bq-form-group">
			    <view class="title">档期:</view>
				<picker class="desc" mode="date" :value="banquetFormData.clueScheduleDate || '9999-99-99'"  @change="chooseScheduleDate">
				    <view class="picker">
				        {{banquetFormData.clueScheduleDate}}
						<text class="text-date" v-show='!banquetFormData.clueScheduleDate'>请选择档期</text>
						<image class="arrowRight" :src="picDomain + '/upload/yytApp/images/arrowRight.png'"></image>
					</view>
				</picker>
			</view>
			<view class="bq-form-group">
			    <view class="title">桌数:</view>
				<view class="desc" @tap="openPopup()">
					<text v-if="msg">{{msg}}</text>
					<text v-else class="text-date">输入桌数</text>
				</view>
			</view>
        </view>
		<!-- 选择桌数弹窗 -->
		<yyt-choose-table ref="addTableCount" :readyTableNum="readyTableNum" :readyTableNumLen="readyTableNumLen" @tableNum="tableNum"></yyt-choose-table>
		<view style="height:80rpx"></view>
    </view>
</template>

<script>
	export { default } from './addBanquetInfo.js';
</script>

<style  lang="less" scoped>
	@import url('addBanquetInfo.less');
</style>
