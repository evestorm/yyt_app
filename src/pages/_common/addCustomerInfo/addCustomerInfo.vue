<template>
	<!-- 编辑/新增客户 -->
	<view id="add-customer" style=" box-sizing: border-box;" class="logo-absolute-bottom-page">
		<!-- 导航栏 -->
		<z-nav-bar class="z-nav-bar" :title="navBarTitle" bgColor="#0782ff" fontColor="#FFF">
			<!-- 返回 -->
			<sw-icon type="back" size="27" slot="left" @tap="onBack" color="#FFF"></sw-icon>
			<!-- 保存 -->
			<view class="right-selector" slot="right" @tap="onSave"><text class="tools-text">保存</text></view>
		</z-nav-bar>
		<!-- <form @submit="formSubmit($event, 'DialogModal1')" @reset="formReset"> -->
		<view class="content">
			<view class="add-item">
				<view class="yyt-list-item">
					<view class="title">姓名</view>
					<input class="info" placeholder-style="fontSize:22rpx" type="text" name="customerName" v-model="customFormData.name" placeholder="请输入客户姓名" />
				</view>
				<view class="yyt-list-item">
					<view class="title">尊称</view>
					<input class="info" placeholder-style="fontSize:22rpx" type="text" name="customerNickName" v-model="customFormData.msgName" placeholder="请输入客户尊称" />
				</view>
				<view class="yyt-list-item">
					<view class="title">电话</view>
					<input class="info" placeholder-style="fontSize:22rpx" type="text" name="customerTel" v-model="customFormData.phone" placeholder="请输入电话信息" />
				</view>

				<view class="yyt-list-item">
					<view class="title">生日</view>
					<picker class="content padding-right" mode="date" :value="customFormData.birthday || '9999-99-99'" @change="chooseDate">
						<view class="picker">
							{{ customFormData.birthday }}
							<view v-show="!customFormData.birthday" class="tip" style="margin-left: 5px; font-size: 22rpx; font-family: PingFang SC; color: #999;">
								请填选择生日
							</view>
						</view>
					</picker>
					<view class="arrow-wrapper"><sw-icon :size="20" class="uni-icon-wrapper" color="#bbb" type="arrowright" /></view>
				</view>
				<view class="yyt-list-item">
					<view class="title">性别</view>
					<view class="change-Sex">
						<view class="sex-item" @tap="changeSex('男')">
							<image
								class="sex-icon"
								:src="customFormData.sex == '男' ? picDomain + '/upload/yytApp/customer/sel.png' : picDomain + '/upload/yytApp/customer/unsel.png'"
								mode=""
							></image>
							<text class="sex-name desc" :class="customFormData.sex == '男' ? 'text-sel' : ''">男</text>
						</view>
						<view class="sex-item margin-right" @tap="changeSex('女')">
							<image
								class="sex-icon"
								:src="customFormData.sex == '女' ? picDomain + '/upload/yytApp/customer/sel.png' : picDomain + '/upload/yytApp/customer/unsel.png'"
								mode=""
							></image>
							<text class="sex-name desc" :class="customFormData.sex == '女' ? 'text-sel' : ''">女</text>
						</view>
					</view>
				</view>
				<view class="yyt-list-item">
					<view class="title">单位</view>
					<input
						class="info"
						@blur="closeCompany"
						@focus="companysShow"
						placeholder-style="fontSize:22rpx;color:#999"
						type="text"
						name="customerCompnay"
						v-model="companyNameText"
						placeholder="请输入客户的单位信息"
					/>
				</view>
				<view class="search-company" v-if="isCompanysShow && companyNameText && companys.length > 0">
					<view class="search-texe">搜索</view>
					<view class="search-group-company" v-for="(item, index) in companys" :key="index" @tap="gotoCompany(item)">{{ item.name }}</view>
				</view>
				<view class="yyt-list-item" style="display: block;">
					<view class="title">备注</view>
					<textarea
						class="w-100 px-3 pt-1"
						style="height: 160rpx;"
						placeholder-style="fontSize:22rpx"
						placeholder="请输入客户备注"
						v-model="customFormData.customerRemark"
					/>
				</view>
				<!-- <view
					class="cu-form-group "
					v-for="(item, index) in companys"
					:key="index"
					v-if="isCompanysShow&&companyNameText && companys.length > 0"
					@tap="gotoCompany(item)"
				>
					{{ item.name }}
				</view> -->
			</view>

			<view class="add-item" v-if="customerId != '-1'">
				<view class="yyt-list-item yyt-list-item-column">
					<view class="title-wrapper">
						<view class="title">客户标签</view>
						<view class="arrow-wrapper"><image class="edit-icon" @tap="gotoCustomerLabel" :src="picDomain + '/upload/yytApp/customer/edit.png'" mode=""></image></view>
					</view>
					<view class="customer-tag">
						<view class="cu-tag radius yyt-grey-bg" v-if="selectTags.length > 0" v-for="(item, index) in selectTags" :key="index">{{ item.name }}</view>
					</view>
				</view>
			</view>
			<view class="add-item">
				<view class="yyt-list-item">
					<view class="title">客服经理</view>
					<view class="set-manager">
						<picker :value="index" @change="chooseSales" :range="sales" range-key="text">
							<view class="picker">
								<text class="desc" v-if="sales[index]">{{ sales[index].text }}</text>
								<sw-icon :size="20" class="uni-icon-wrapper" color="#bbb" type="arrowright" />
							</view>
						</picker>
					</view>
				</view>
			</view>

			<!-- <view class="save-button"><button class="cu-btn block bg-blue lg" formType="submit" type="primary">保存</button></view> -->
			<view class="cu-modal" :class="modalName == 'DialogModal1' ? 'show' : ''">
				<view class="cu-dialog">
					<view class="cu-bar bg-white justify-end">
						<view class="content">提示</view>
						<view class="action" @tap="hideModal"><text class="cuIcon-close text-gray"></text></view>
					</view>
					<view class="padding-xl  prompt-info">
						<text class="lg text-blue cuIcon-infofill prompt-icon"></text>
						<view class="prompt-text">
							<view>客户信息已保存成功！</view>
							<view class="flex self-start">
								<text>是否要</text>
								<text class="text-red">立即预订</text>
							</view>
						</view>
					</view>
					<view class="cu-bar bg-white ">
						<view class="action bottom flex flex-wrap">
							<button class="cu-btn line-blue text-blue lg basis-df" @tap="hideModal">否</button>
							<button class="cu-btn bg-blue lg basis-df" @tap="fastBook">是</button>
						</view>
					</view>
				</view>
			</view>
			</form>
		</view>
		<!-- 底部logo -->
		<view class="logoPic"><image src="https://pic.cwyyt.cn/upload/yyticons/0952195219_logo.png" class="bot-logo"></image></view>
	</view>
</template>

<script>
export { default } from './addCustomerInfo.js';
</script>

<style lang="less" scoped>
@import url('addCustomerInfo.less');
</style>
