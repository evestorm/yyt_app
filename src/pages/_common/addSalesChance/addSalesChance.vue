<!-- 这个页面没人用了 -->
<template>
	<view id="add-sales-chance">
		<z-nav-bar title="添加销售机会" bgColor="rgb(248, 248, 248)">
			<sw-icon type="back" size="27" slot="left" @tap="onBack"></sw-icon>
		</z-nav-bar>
		<form>
			<view class="add-item">
				<view class="cu-form-group">
				    <view class="title">手机:</view>
				    <input class="desc" placeholder="请输入手机号" name="customerTel" v-model="PhoneQueryText"></input>
				</view>
				<!-- 根据用户输入手机号，实时展示候选名单 -->
				<view class="cu-form-group"
					v-show="PhoneQueryText && customData.length > 0"
					v-for="(CustomDataItem, index) in customData"
					:key="index"
					@tap="gotoCustom(CustomDataItem)"
					>
					 <text class="customer-name">{{CustomDataItem && CustomDataItem.name}}</text>
					 <text class="customer-tel">{{CustomDataItem && CustomDataItem.phone}}</text>
				</view>
				<view class="cu-form-group">
				    <view class="title">姓名:</view>
					<text v-if="customFormData.customerName">{{customFormData.customerName}}</text>
				    <input class="desc" v-else type="text" placeholder="请输入姓名" name="customerName" v-model="customFormDataText.customerName"></input>
				</view>
				<view class="cu-form-group">
				    <view class="title">单位:</view>
				    <text
						v-if="customFormData.customerName"
						v-text="customFormData.company?customFormData.company:'暂无单位'"
						>{{customFormData.company}}</text>
				    <input class="desc" v-else type="text" placeholder="请输入单位" name="customerCompnay" v-model="customFormDataText.company"></input>
				</view>
				<view class="cu-form-group">
				    <view class="title">生日:</view>
					<text v-if="customFormData.birthday">{{customFormData.birthday | parseShortDate}}</text>
					<picker v-else class="desc picker" mode="date" :value="(customFormDataText.birthday || '9999-99-99') | parseShortDate"  @change="chooseBirthday($event)">
					    <view class="picker">
					        {{customFormDataText.birthday | parseShortDate}}
							<text class="text-gray  icon iconfont icon-riqi2 "></text>
					    </view>
					</picker>
				</view>
				<view class="cu-form-group">
				    <view class="title">性别:</view>
				    <view class="change-Sex"  v-if="customFormData.sex=='女'">
				        <!-- <view class="sex-item margin-right" @tap="changeSex('女')"> -->
				        <view class="sex-item margin-right" v-if="customFormData.sex=='女'">
				            <text class="sex-name desc" :class="customFormData.sex=='女'?'text-red':''">女</text>
				            <text class="lg icon iconfont icon-sexw  sex-icon" :class="customFormData.sex=='女'?'text-red':''"></text>
				        </view>
				        <!-- <view class="sex-item" @tap="changeSex('男')"> -->
				        <view class="sex-item" v-if="customFormData.sex=='男'">
				            <text class="sex-name desc" :class="customFormData.sex=='男'?'text-blue':''">男</text>
				            <text class="lg  icon iconfont icon-sexm  sex-icon" :class="customFormData.sex=='男'?'text-blue':''"></text>
				        </view>
				    </view>
					<view class="sexItem" v-else>
						<span>性别暂无</span>
					</view>
				</view>
				<view class="cu-form-group ">
					<!-- 仅做展示，不修改 -->
					<view class="title">客户等级:</view>
					<view class="customer-level-wrapper">
						<view class="customRank_icon">
							<view class="level-container">
								<view class="img-wrapper">
									<image class="level-img" mode="scaleToFill" :src="customFormData.customerLevelImgUrl_Server"></image>
								</view>
							</view>
						</view>
					</view>
				</view>
			</view>
		    
			<view class="add-item">
				<view class="cu-form-group">
				    <view class="title">客户经理:</view>
				    <view class="set-manager">
				        <picker :value="index" @change="chooseSales" :range="sales" range-key="marketerName">
				            <view class="picker">
				                <!-- <text class="desc" v-if="sales[index]">{{sales[index].marketerName}}</text> -->
				                <text class="desc" v-if="customFormData.marketerName">{{customFormData.marketerName}}</text>
				                <text class="desc" v-else>未配置</text>
				                <text class="text-gray  icon iconfont icon-tools "></text>
				            </view>
				        </picker>
				    </view>
				</view>
				<view class="cu-form-group">
				    <view class="title">机会日期:</view>
					<!-- <picker mode="date" :value="customFormDataText.expectOn|parseShortDate" start="2015-09-01" end="2020-09-01" @change="chooseDate1($event)"> -->
					<picker class="desc" mode="date" :value="(customFormDataText.expectOn  || '9999-99-99') | parseShortDate" @change="chooseDate($event)">
						<view class="picker">
							{{customFormDataText.expectOn | parseShortDate}}
							<text class="text-gray  icon iconfont icon-riqi2 "></text>
						</view>
					</picker>
				</view>
				<view class="cu-form-group">
					<label class="title">机会备注:</label>
					<input class="desc" placeholder="请输入机会备注" name="customerRemark" v-model="customFormDataText.remark"></input>
				</view>
			</view>
			
			<view class="add-item">
				<view class="quick-wrapper">
					<view class="quick-title-wrapper">
						<view class="quick-title">快捷备注</view>
						<view class="right-icon">
							<sw-icon :type="tagListIsOpen ? 'arrowup' : 'arrowdown'" size="20" @tap="changeRemarkWrapper"></sw-icon>
						</view>
					</view>
					<view class="quick-tag-list" :style="{height: tagListIsOpen ? 'auto' : '0'}">
						<view class="quick-tag-item"
							:class="{'active':currentSelectTag.tagID==cy63TagDataItem.id}"
							v-for="(cy63TagDataItem, index) in cy63TagData" :key="index"
							@tap="remarkClick(cy63TagDataItem)">
							{{cy63TagDataItem.tagContent}}
						</view>
					</view>
				</view>
			</view>
			
			<view class="padding flex flex-direction">
			    <button class="cu-btn bg-blue lg" @tap="save">保存</button>
			</view>
		</form>
		
		
	</view>
</template>

<script>
export { default } from './addSalesChance.js';
</script>

<style lang="less" scoped>
	@import url('addSalesChance.less');
</style>
