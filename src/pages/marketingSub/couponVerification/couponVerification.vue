<!--作者:杨亮-->
<template>
	<view class="couponVerification">
		<!-- ========================= 导航栏 START ========================= -->
		<z-nav-bar class="z-nav-bar" :title="'卡券核销'" :back="false" bgColor="#0782ff" fontColor="#FFF">
			<!-- 返回 -->
			<sw-icon type="back" size="27" slot="left" @tap="onBack" color="#FFF"></sw-icon>
			<!-- 卡券核销 -->
			<navigator
				url="/pages/marketingSub/verificationRecord/verificationRecord"
				hover-class="none"
				open-type="navigate"
				class="right-selector d-flex align-center"
				slot="right"
			>
				<text class="icon iconfont icon-hexiaojilu" style="font-size: 24rpx;"></text>
				<text class="yyt-margin-left-small" style="position: relative; top: 2rpx;">核销记录</text>
			</navigator>
		</z-nav-bar>
		<!-- ========================= 导航栏 END ========================= -->

		<!-- ========================= 扫卡券码 START ========================= -->
		<view class="scancode-wrapper d-flex align-center justify-between bg-white px-2">
			<view class="title">卡券码</view>
			<view class="code-inner-wrapper mr-auto">
				<input type="number" confirm-type="search" placeholder="请输入卡券码" v-model="getCodeInfoIn.cardCode" @confirm="confirmSearch" />
			</view>
			<view class="scancode-inner-wrapper" @tap="openScanner">
				<text id="reader" class="icon iconfont icon-saoma text-blue font-weight" style="font-size: 42rpx;"></text>
			</view>
		</view>
		<!-- ========================= 扫卡券码 END ========================= -->

		<!-- ========================= 卡券信息 START ========================= -->
		<view v-show="getCodeInfoOut.cardCode" class="card-info-wrapper d-flex flex-column align-start bg-white yyt-margin-top-bg p-2">
			<view class="card-item d-flex align-center justify-start" v-for="(item, idx) in PageConstData.listArr" :key="idx">
				<view class="title">{{ item.value }}</view>
				：
				<view class="desc" :class="{ active: item.value == '姓名' && getCodeInfoOut['customerID'] }" @tap="gotoCustomerInfo">{{ getCodeInfoOut[item.key] }}</view>
			</view>
		</view>
		<!-- ========================= 卡券信息 END ========================= -->

		<!-- ========================= 核销按钮 START ========================= -->
		<view class="btn-wrapper">
			<button
				:disabled="!getCodeInfoOut.cardCode || !getCodeInfoOut.isShowWriteOff"
				@tap="triggerVerification"
				type="default"
				class="hexiao d-flex align-center justify-center"
				:class="{ disable: !getCodeInfoOut.cardCode || !getCodeInfoOut.isShowWriteOff }"
			>
				核销
			</button>
		</view>
		<!-- ========================= 核销按钮 END ========================= -->
	</view>
</template>

<script src="./couponVerification.js"></script>

<style lang="less" scoped>
@import url('couponVerification.less');
</style>
