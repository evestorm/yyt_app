<template>
	<view>
		<view class="files">
			<view class="file-name">{{title}}</view>
			<view class="file-list">
				<view class="file-list-item">
					<text class="item-title">姓名</text>
					<input v-show='btnState!=2' class="item-sec" type="text" v-model="fileData.cstName" placeholder="请输入客户姓名" />
					<view class="item-sec" v-show='btnState==2'>{{fileData.cstName}}</view>
					
				</view>
				<view class="file-list-item">
					<text class="item-title">电话</text>
					<input v-show='btnState!=2' class="item-sec" type="number" v-model="fileData.cstPhone" placeholder="请输入电话" />
					<view class="item-sec" v-show='btnState==2'>{{fileData.cstPhone}}</view>
				</view>
				<view class="file-list-item">
					<text class="item-title">生日</text>
					<picker class="item-sec" mode="date" @change="chooseDate" :value="fileData.cstBirthday_date || '9999-99-99'" :disabled="btnState==2">
						<view class="picker">
							<text  v-show="fileData.cstBirthday">{{fileData.cstBirthday|parseShortDate}}</text>
							<text class="text-date" v-show="!fileData.cstBirthday&&btnState!=2">请选择生日</text>
							<image v-show="btnState!=2" class="arrowRight" :src="picDomain + '/upload/yytApp/images/arrowRight.png'"></image>
						</view>
					</picker>
					<!-- <input class="item-sec" type="text" v-model="fileData" placeholder="请输入客户姓名" /> -->
					<!-- <view class="item-sec">李先生</view> -->
				</view>
				<view class="file-list-item">
					<text class="item-title">性别</text>
					<radio-group class="item-sec" @change="radioChange" :disabled="btnState==2">
						<label class="radio" :disabled="btnState==2">
							<radio style="transform:scale(0.5)" value="1" :checked="fileData.cstSex==1"  :disabled="btnState==2"/>
							男
						</label>
						<label class="radio" :disabled="btnState==2">
							<radio style="transform:scale(0.5)" value="2" :checked="fileData.cstSex==2" :disabled="btnState==2"/>
							女
						</label>
					</radio-group>

				<!-- 	<view class="item-sec">{{fileData.cstSex==1?'男':'女'}}</view> -->
				</view>
				
				<view class="file-list-item">
				   	<text class="item-title">民族</text>
					<picker v-show='btnState!=2' class="desc" :value="fileData.cstNationindex"  @change="NationSelect" :range="NationData" range-key="name">
						<text  v-show="fileData.cstNation!=''">{{fileData.cstNation}}</text> 
						<text class="text-date" v-show="fileData.cstNation==''">请选择民族信息</text>
						<image class="arrowRight" :src="picDomain + '/upload/yytApp/images/arrowRight.png'"></image>
					</picker>
					<view v-show='btnState==2' class="item-sec">{{fileData.cstNation}}</view>
				</view>
				<!-- <view class="file-list-item">
					<text class="item-title">民族</text>
					<input v-show='btnState!=2' class="item-sec" type="text" v-model="fileData.cstNation" placeholder="请输入民族信息" />
					<view v-show='btnState==2' class="item-sec">{{fileData.cstNation}}</view>
				</view> -->
				<view class="file-list-item">
					<text class="item-title">住址</text>
					<input class="item-sec" v-show='btnState!=2' type="text" v-model="fileData.cstAddress" placeholder="请输入地址信息" />
					<view class="item-sec" v-show='btnState==2'>{{fileData.cstAddress}}</view>
				</view>
			<view class="file-list-item">
				<text class="item-title">单位</text>
				<input class="item-sec" v-show='btnState!=2' @blur="closeCompany" @focus="companysShow" type="text" v-model="fileData.cstCompany" placeholder="请输入单位信息" />
				<view class="item-sec" v-show='btnState==2'>{{fileData.cstCompany}}</view>
			</view>
			<view class="search-company" v-if="isCompanysShow&&fileData.cstCompany&&companys.length>0">
				<view class="search-texe">搜索</view>
				<view class="search-group-company" v-for="(item,index) in companys" :key="index"  @tap="gotoCompany(item)">
					{{item.name}}
				</view>
			</view>
			<!-- <view class="cu-form-group " v-for="(item,index) in companys" :key="index" v-if="isCompanysShow&&fileData.cstCompany&&companys.length>0" @tap="gotoCompany(item)">
				{{item.name}}
			</view> -->
				<view class="file-list-item">
					<text class="item-title">职业</text>
					<input class="item-sec" v-show='btnState!=2' type="text" v-model="fileData.cstJob" placeholder="请输入职业信息" />
					<view class="item-sec" v-show='btnState==2'>{{fileData.cstJob}}</view>
				</view>
			</view>
		</view>
		<!-- 按钮区 -->
		<view class="foot-btn">
			<!-- 提交 -->
			<view class="btn big-btn blue-bg" @tap="creatFile" v-show='btnState==1'>提交</view>
			<!-- 删除+编辑 -->
			<view class="btn-flex" v-show='btnState==2'>
				<view class="btn small-btn" @tap="delFile">删除</view>
				<view class="btn small-btn blue-bg" @tap="editFile">编辑</view>
			</view>
			<view class="btn-flex" v-show='btnState==3'>
			 <!-- 保存 -->
			       <view class="btn small-btn" @tap="delFile">删除</view>
			       <view class="btn small-btn blue-bg" @tap="updateFile">保存</view>
			</view>
		</view>
		<!-- 弹出删除确认框 -->
		<uni-popup ref="delPopup" type="center" class="del-popup">
			<view class="popup-top">
				<text>提示</text>
				<image class="popup-top-img" :src="picDomain + '/upload/yytApp/banquet/quxiao.png'" mode="" @tap="cancel"></image>
			</view>
			<view class="popup-mid">
				<image class="popup-mid-img" :src="picDomain + '/upload/yytApp/banquet/error.png'" mode=""></image>
				<text>您确定要删除该档案？</text>
			</view>
			<view class="popup-bot">
				<view class="cancel" @tap="cancel">取消</view>
				<view class="confirm" @tap="confirm">确定</view>
			</view>
		</uni-popup>
		<!-- 底部logo -->
		<view class="logoPic"><image src="https://pic.cwyyt.cn/upload/yyticons/0952195219_logo.png" class="bot-logo"></image></view>
	</view>
</template>

<script>
export { default } from './writeFile.js';
</script>

<style lang="less" scoped>
@import url('writeFile.less');
</style>
