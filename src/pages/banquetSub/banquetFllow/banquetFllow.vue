<template>
	<view class="banquet-fllow">
		<view class="banquet-fllow-title">线索备注</view>
		<view class="fllow-top">			
			<textarea class="fllow-top-textarea" v-model="queryFllow.clueRemark" placeholder=""  maxlength='300'/>
			<text class="fllow-top-textarea-tip">{{queryFllow.clueRemark.length}}/300</text>
		</view>
		<view class="banquet-fllow-title">图片</view>
		<view class="top-img">
			<view class=" ">
				<yyt-load-img @loadImagesrc='getImageSrc'></yyt-load-img>
			</view>
			<view class="fllow-top-textarea-tip">最多可以上传3张图片</view>
		</view>
		<view class="fllow-card">
			<yyt-collapse>
				<yyt-collapse-item title="客户信息">
					<view class="my-bq-mid">
						<view class="my-bq-mid1-info">
							<view class="title">姓名:</view>
							<input placeholder-style="fontSize:22rpx" placeholder="请输入客户姓名" @change="nameChange()" class="des" type="text" v-model="banquetInfo.yhClue.clueUserName"/> <!-- v-model="banquetInfo.yhClue.clueUserAddress" --> 
						</view>
						<view class="my-bq-mid1-info">
							<view class="title">电话:</view>
							<input placeholder-style="fontSize:22rpx" placeholder="请输入客户电话" @blur="regPhone()" @change="phoneChange()" class="des" type="text" v-model='banquetInfo.yhClue.clueUserPhone' /> <!-- v-model="banquetInfo.yhClue.clueUserAddress" --> 
						</view>
						<view class="my-bq-mid1-info">
							<view class="title">
								生日:
							</view>
							<picker v-if="banquetInfo.yhClue.clueUserBirthdayDate" class="desc" mode="date" :value="banquetInfo.yhClue.clueUserBirthdayDate|parseShortDate"  @change="chooseDate">
							    <view class="picker">
							        {{banquetInfo.yhClue.clueUserBirthdayDate|parseShortDate}}
									<text class="text-date" v-show='banquetInfo.yhClue.clueUserBirthdayDate==0'>请选择生日</text>
									<image :src="picDomain + '/upload/yytApp/images/arrowRight.png'" mode="" class="arrowRight" @change="chooseDate"></image>
								</view>
							</picker>
							<picker v-if="banquetInfo.yhClue.clueUserBirthdayDate==''" class="desc" mode="date" :value="banquetInfo.yhClue.clueUserBirthdayDate ||'9999-99-99'"  @change="chooseDate">
							    <view class="picker">
							        {{banquetInfo.yhClue.clueUserBirthdayDate}}
									<text class="text-date" v-show='banquetInfo.yhClue.clueUserBirthdayDate==0'>请选择生日</text>
									<image :src="picDomain + '/upload/yytApp/images/arrowRight.png'" mode="" class="arrowRight" @change="chooseDate"></image>
								</view>
							</picker>
						</view>
						<view class="my-bq-mid1-info">
							<view class="title">单位:</view>
							<input placeholder-style="fontSize:22rpx" @blur="closeCompany" @focus="companysShow" placeholder="请输入单位信息" class="des" type="text" v-model="companyNameText" /> <!-- v-model="banquetInfo.yhClue.clueUserAddress" --> 
						</view>
						<view class="search-company" v-if="isCompanysShow&&companyNameText&&companys.length>0">
							<view class="search-texe">搜索</view>
							<view class="search-group-company" v-for="(item,index) in companys" :key="index"  @tap="gotoCompany(item)">
								{{item.name}}
							</view>
						</view>
						<!-- <view class="cu-form-group " v-for="(item,index) in companys" :key="index" v-if="isCompanysShow&&companyNameText&&companys.length>0" @tap="gotoCompany(item)">
							{{item.name}}
						</view> -->
						<view class="my-bq-mid1-info">
							<view class="title">住址:</view>
							<input placeholder-style="fontSize:22rpx" @change="addressChange()" placeholder="请输入地址信息" class="des" type="text" v-model="banquetInfo.yhClue.clueUserAddress"/> <!--  --> 
						</view>
					</view>
				</yyt-collapse-item>
			</yyt-collapse>
		</view>
		<view class="fllow-card">
			<yyt-collapse>
				<yyt-collapse-item title="客户档案">
					
					<view class="my-bq-mid">
						<view class="my-bq-mid1-info">
							<view class="title" @tap="chooseLevel">成交率:</view>
							<picker class="desc" v-model="banquetInfo.yhClue.clueLevel-1"  @change="chooseLevel" :range="levels" range-key="text">
								<!-- {{levelText||banquetInfo.yhClue.clueLevel==3 ? '高' : banquetInfo.yhClue.clueLevel==2 ? '中' : banquetInfo.yhClue.clueLevel==1 ?'低':''}} -->
								<text v-show="levelText==''" class="des">{{banquetInfo.yhClue.clueLevel==3 ? 'A' : banquetInfo.yhClue.clueLevel==2 ? 'B' : banquetInfo.yhClue.clueLevel==1 ?'C':''}}</text>
								<text  class="des" v-show="levelText!=''">{{levelText}}</text>
								<image class="arrowRight" :src="picDomain + '/upload/yytApp/images/arrowRight.png'"></image>
							</picker>
						</view>
						<view class="my-bq-mid1-info">
							<view class="title" >宴会类型:</view>
							<picker class="desc" :value="bookOrderIndex"  @change="chooseBookOrder" :range="bookOrderList" range-key="name">
								<text class="des" v-show="bookOrderName!=''">{{bookOrderName}}</text> 
								<text class="text-date" v-show="bookOrderName==''">请选择宴会类型</text>
								<image class="arrowRight" :src="picDomain + '/upload/yytApp/images/arrowRight.png'"></image>
							</picker>
						</view>
						<view class="my-bq-mid1-info">
							<view class="title" >跟进人:</view>
							<picker class="desc" :value="index"  @change="chooseMarketer" :range="marketers" range-key="marketerName">
								<text class="des" v-show="marketer!=''">{{marketer}}</text> 
								<text class="text-date" v-show="marketer==''">请选择跟进人</text>
								<image class="arrowRight" :src="picDomain + '/upload/yytApp/images/arrowRight.png'"></image>
							</picker>
						</view>
						<view class="my-bq-mid1-info">
							<view class="title">档期:</view>
							<picker v-if="banquetInfo.yhClue.clueScheduleDate" class="desc" mode="date" :value="banquetInfo.yhClue.clueScheduleDate|parseShortDate"  @change="chooseScheduleDate">
							    <view class="picker">
							        {{banquetInfo.yhClue.clueScheduleDate|parseShortDate}}
									<text class="text-date" v-show='banquetInfo.yhClue.clueScheduleDate==0'>请选择档期</text>
									<image :src="picDomain + '/upload/yytApp/images/arrowRight.png'" mode="" class="arrowRight"></image>
								</view>
							</picker>
							<picker v-if="banquetInfo.yhClue.clueScheduleDate==''" class="desc" mode="date" :value="index"  @change="chooseScheduleDate">
							    <view class="picker">
							        {{banquetInfo.yhClue.clueScheduleDate}}
									<text class="text-date" v-show='banquetInfo.yhClue.clueScheduleDate==0'>请选择档期</text>
									<image :src="picDomain + '/upload/yytApp/images/arrowRight.png'" mode="" class="arrowRight"></image>
								</view>
							</picker>
						</view>
						<view class="my-bq-mid1-info">
							<view class="title">桌数:</view>
							<!-- <input readonl  class="des" placeholder="输入桌数" v-model="msg" @tap="openPopup()"></input> -->
							<view v-show="msg!=''" class="des" @tap="openPopup()">{{msg}}</view>
							<!-- <view v-show="msg==''" class="des" @tap="openPopup()">输入桌数</view> -->
						</view>
					</view>
				</yyt-collapse-item>
			</yyt-collapse>
		</view>
		<!-- 选择桌数弹窗 -->
		<uni-popup ref="tableCountChange" class="modalDlg">
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
		<!-- 底部logo -->
		<view class="logoPic">
			<image src="https://pic.cwyyt.cn/upload/yyticons/0952195219_logo.png" class="bot-logo"></image>
		</view>
	</view>
</template>



<script>
	export { default } from './banquetFllow.js';
</script>

<style  lang="less" scoped>
	@import url('banquetFllow.less');
</style>