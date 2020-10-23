<template>
	<view >
     <view class="edit-profile" >
	        <z-nav-bar :title="navBarTitle" bgColor="#0782ff" fontColor="#FFF" >
	        	
	        	<sw-icon type="back" size="27" slot="left" @tap="onBack"  color="#FFF" ></sw-icon>
	        	
	        	<view class="right-selector" slot="right" @tap="next"  style="margin-right: 30rpx;">
	        		<text class="save-setting-btn" >{{navbuttontext}}</text>
	        	</view>
	        </z-nav-bar>
	    </view>
	<!-- 编辑/新增宴会单 -->
    <view id="addBanquet" style="addBanquet">
		
		<view class="add-form" v-if="index==1">
		    <view class="bq-form-group ">
		        <view class="title">客户姓名:<text style="color:red">*</text></view>
		        <input class="desc" placeholder="请输入客户姓名" v-model="banquetFOrderData.orderCstName"></input>
		    </view>
			<view class="bq-form-group ">
			    <view class="title">电话:<text style="color:red">*</text></view>
			    <input class="desc" placeholder="请输入电话" type="number" v-model="banquetFOrderData.orderCstPhone"></input>
			</view>
			<view class="bq-form-group ">
			    <view class="title">宴会名称:<text style="color:red">*</text></view>
			    <input class="desc" placeholder="请输入宴会名称" v-model="banquetFOrderData.banquetOrderName"></input>
			</view>
			<view class="bq-form-group ">
			    <view class="title">单位:</view>
			    <input class="desc" placeholder="请输入单位" @blur="closeCompany" @focus="companysShow" v-model="banquetFOrderData.orderCstCompany"></input>
			</view>
			<view class="search-company" v-if="isCompanysShow&&banquetFOrderData.orderCstCompany&&companys.length>0">
				<view class="search-texe">搜索</view>
				<view class="search-group-company" v-for="(item,index) in companys" :key="index"  @tap="gotoCompany(item)">
					{{item.name}}
				</view>
			</view>
			<!-- <view class="cu-form-group " v-for="(item,index) in companys" :key="index" v-if="isCompanysShow&&banquetFOrderData.orderCstCompany&&companys.length>0" @tap="gotoCompany(item)">
				{{item.name}}
			</view> -->
		 </view>
		 
		 
		 
		 
		 
		<view class="add-form" v-if="index==2">	
			<view class="bq-form-group ">
			    <view class="title">宴会类型:</view>
				<picker  class="desc" :value="banquetThemeTypeindex"  @change="banquetThemeTypeSelect" :range="banquetFOrder" range-key="name">
					<text  v-show="banquetFOrderData.banquetThemeTypeName!=''">{{banquetFOrderData.banquetThemeTypeName}}</text> 
					<text class="text-date" v-show="banquetFOrderData.banquetThemeTypeName==''">请选择宴会类型</text>
					<image class="arrowRight" :src="picDomain + '/upload/yytApp/images/arrowRight.png'"></image>
				</picker>
			
			</view>
			<view class="bq-form-group ">
			    <view class="title">宴会日期<text style="color:red">*</text>:</view>
				<picker class="desc" mode="date" :value="banquetFOrderData.banquetDate_Date || '9999-99-99'"  @change="banquetDateSelect">
				    <view class="picker">
					   	<text  v-if="banquetFOrderData.banquetDate_Date!=''">{{banquetFOrderData.banquetDate|parseShortDate}}</text> 
						<text class="text-date" v-show='banquetFOrderData.banquetDate_Date.length==0'>请选择宴会日期</text>
						<image class="arrowRight" :src="picDomain + '/upload/yytApp/images/arrowRight.png'"></image>
					</view>
				</picker>
			</view>
			<view class="bq-form-group ">
			    <view class="title">统筹经理<text style="color:red">*</text>:</view>
				<picker class="desc" :value="coordinatorindex"  @change="coordinatorSelect" :range="marketers" range-key="marketerName">
					<text  v-show="banquetFOrderData.coordinatorName!=''">{{banquetFOrderData.coordinatorName}}</text> 
					<text class="text-date" v-show="banquetFOrderData.coordinatorName==''">请选择统筹经理</text>
					<image class="arrowRight" :src="picDomain + '/upload/yytApp/images/arrowRight.png'"></image>
				</picker>
			</view>
			<view class="bq-form-group ">
			    <view class="title">客户经理<text style="color:red">*</text>:</view>
				<picker class="desc"  :value="marketerindex"  @change="marketerSelect" :range="marketers" range-key="marketerName">
					<text  v-show="banquetFOrderData.marketerName!=''">{{banquetFOrderData.marketerName}}</text> 
					<text class="text-date" v-show="banquetFOrderData.marketerName==''">请选择客户经理</text>
					<image class="arrowRight" :src="picDomain + '/upload/yytApp/images/arrowRight.png'"></image>
				</picker>
			</view>
			<view class="bq-form-group ">
			    <view class="title">签单日期<text style="color:red">*</text>:</view>
				<picker class="desc" mode="date" :value="banquetFOrderData.orderSignDate_Date || '9999-99-99'"  @change="chooseDate">
				    <view class="picker">
					   	<text  v-if="banquetFOrderData.orderSignDate_Date!=''">{{banquetFOrderData.orderSignDate|parseShortDate}}</text> 
						<text class="text-date" v-show='banquetFOrderData.orderSignDate_Date.length==0'>请选择签单日期</text>
						<image class="arrowRight" :src="picDomain + '/upload/yytApp/images/arrowRight.png'"></image>
					</view>
				</picker>
			</view>
			<view class="bq-form-group-textarea">
			    <view class="title">宴会备注:</view>
				 <view class="uni-textarea">
					<textarea placeholder="请输入宴会备注" v-model="banquetFOrderData.banquetOrderRemark"/>
				 </view>
			</view> 
		</view>
		
		
		<view class="add-form" v-if="index==3">
		    <view class="bq-form-group">
		        <view class="title">桌数:</view>
		    
		    	<view class="desc" @tap="openPopup()">
		    		<text v-show="msg==''" class="text-date">输入桌数</text>
		    		<text v-show="msg!=''">{{msg}}</text>
		    	</view>
		    	
		    </view>
			
			<view class="bq-form-group ">
			    <view class="title">套餐:</view>
				<picker v-if="banquetPackageGUIDindex!=''"  class="desc" :value="banquetPackageGUIDindex"  @change="banquetPackageListSelect" :range="banquetPackageList" range-key="banquetPackageName">
					<text  v-show="banquetFOrderData.banquetPackageName!=''">{{banquetFOrderData.banquetPackageName}}</text> 
					<text class="text-date" v-show="banquetFOrderData.banquetPackageName==''">请选择套餐</text>
					<image class="arrowRight" :src="picDomain + '/upload/yytApp/images/arrowRight.png'"></image>
				</picker>
				
				<picker v-else class="desc"   @change="banquetPackageListSelect" :range="banquetPackageList" range-key="banquetPackageName">
					<text  v-show="banquetFOrderData.banquetPackageName!=''">{{banquetFOrderData.banquetPackageName}}</text> 
					<text class="text-date" v-show="banquetFOrderData.banquetPackageName==''">请选择套餐</text>
					<image class="arrowRight" :src="picDomain + '/upload/yytApp/images/arrowRight.png'"></image>
				</picker>
			
			</view>
			<view class="bq-form-group ">
			    <view class="title">套餐价格:</view>
			    <input class="desc" type="number" placeholder="请输入套餐价格" v-model="banquetFOrderData.packagePrice"></input>
			</view>
			
			<view class="bq-form-group-textarea">
			    <view class="title">套餐备注:</view>
				 <view class="uni-textarea">
					<textarea placeholder="请输入套餐备注" v-model="banquetFOrderData.packageRemark"/>
				 </view>
			</view> 
		
		
		</view>
			 
			 
	  <!-- <button class="cu-btn block bg-blue margin-tb-sm lg" @tap="next" v-if="index!=3">下一步</button> -->
		
		
		
		
		
			 
			 
		<!-- <view class="add-form">	
			
			
			
			<view class="bq-form-group ">
			    <view class="title">单位:</view>
			    <input class="desc" placeholder="请输入单位信息" v-model="banquetFOrderData.clueUserCompany"></input>
			</view>
			<view class="bq-form-group ">
			    <view class="title">住址:</view>
			    <input class="desc" placeholder="请输入地址信息" v-model="banquetFOrderData.clueUserAddress"></input>
			</view>
			<view class="bq-form-group ">
			    <view class="title">跟进人:</view>
				<picker v-if="getSalesAuthority.isSeeAll" class="desc" :value="index"  @change="chooseMarketer" :range="marketers" range-key="marketerName">
					<text class="text-date" v-show="marketer!=''">{{marketer}}</text> 
					<text class="text-date" v-show="marketer==''">请选择跟进人</text>
					<image class="arrowRight" :src="picDomain + '/upload/yytApp/images/arrowRight.png'"></image>
				</picker>
				<view class="desc" v-if="getSalesAuthority.isSeeAll==0">{{marketer}}</view>
			</view>
			<view class="bq-form-group ">
			    <view class="title">线索成交率:</view>
				<picker class="desc" :value="banquetFormData.clueLevel"  @change="chooseLevel" :range="levels" range-key="text">
					{{banquetFormData.levelText}}
				
					<image class="arrowRight" :src="picDomain + '/upload/yytApp/images/arrowRight.png'"></image>
				</picker>
			</view>
			
			<view class="bq-form-group bot">
			    <view class="title">档期:</view>
				<picker class="desc" mode="date" :value="banquetFOrderData.clueScheduleDate || '9999-99-99'"  @change="chooseScheduleDate">
				    <view class="picker">
				        {{clueScheduleDate}}
						<text class="text-date" v-show='clueScheduleDate.length==0'>请选择档期</text>
						<image class="arrowRight" :src="picDomain + '/upload/yytApp/images/arrowRight.png'"></image>
					</view>
				</picker>
			</view>
			<view class="bq-form-group">
			    <view class="title">桌数:</view>
			
				<view class="desc" @tap="openPopup()">
					<text v-show="msg==''" class="text-date">输入桌数</text>
					<text v-show="msg!=''">{{msg}}</text>
				</view>
				
			</view>
        </view> -->
	
		<uni-popup ref="tableCount" class="modalDlg">
			<view class="modalDlg_top">
				<view class="modalDlg_top_raedonly"></view>
				<text class="icon iconfont icon-jt-left modalDlg_top_icon" @tap="goBack"></text>
				<input type="number" placeholder="桌数" :value="tableNumDesc" @input="readyTableNum" minlength="0" :maxlength="readyTableNumLen" v-show="isShow"></input>
				<input type="number" placeholder="备桌数" :value="tableNumDesc2" @input="readyTableNum" minlength="0" :maxlength="readyTableNumLen" v-show="!isShow"></input>
				<text class="modalDlg_top_text">桌</text>
			</view>
			<view class="modalDlg_content">
				<view class="modalDlg_content_item" data-inx="1" @tap="selectExtraDesknum(1)">
					<text :class="(isChecked1==1?'is_checked1':'normal')">1</text>
				</view>
				<view class="modalDlg_content_item" data-inx="2" @tap="selectExtraDesknum(2)">
					<text :class="(isChecked1==2?'is_checked1':'normal')">2</text>
				</view>
				<view class="modalDlg_content_item" data-inx="3" @tap="selectExtraDesknum(3)">
					<text :class="(isChecked1==3?'is_checked1':'normal')">3</text>
				</view>
				<view class="modalDlg_content_item" data-inx="4" @tap="selectExtraDesknum(4)">
					<text :class="(isChecked1==4?'is_checked1':'normal')">4</text>
				</view>
				<view class="modalDlg_content_item" data-inx="5" @tap="selectExtraDesknum(5)">
					<text :class="(isChecked1==5?'is_checked1':'normal')">5</text>
				</view>
				<view class="modalDlg_content_item" data-inx="6" @tap="selectExtraDesknum(6)">
					<text :class="(isChecked1==6?'is_checked1':'normal')">6</text>
				</view>
				<view class="modalDlg_content_item" data-inx="7" @tap="selectExtraDesknum(7)">
					<text :class="(isChecked1==7?'is_checked1':'normal')">7</text>
				</view>
				<view class="modalDlg_content_item" data-inx="8" @tap="selectExtraDesknum(8)">
					<text :class="(isChecked1==8?'is_checked1':'normal')">8</text>
				</view>
				<view class="modalDlg_content_item" data-inx="9" @tap="selectExtraDesknum(9)">
					<text :class="(isChecked1==9?'is_checked1':'normal')">9</text>
				</view>
			</view>
			<view class="modalDlg_bottom">
				<text @tap="cancel1">取消</text>
				<text :class="(isChecked1==0?'is_checked1':'normal')" data-inx="0" @tap="selectExtraDesknum(0)">0</text>
				<text @tap="confirm1">确定</text>
			</view>
		</uni-popup>
		<view style="height:80rpx"></view>
    </view>
</view>
</template>

<script>
	export { default } from './addBanquetOrder.js';
</script>

<style  lang="less" scoped>
	@import url('addBanquetOrder.less');
</style>
