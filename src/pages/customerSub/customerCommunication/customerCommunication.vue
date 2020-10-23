<template>
    <div class="customer-communication">
    	<z-nav-bar class="z-nav-bar" ref="zNavBar" :isactive="isactive" @onactive="onactive" :back="false" :titleswitch="true" bgColor="#0782ff" fontColor="#FFF" :titles="ttl">
			<sw-icon type="back" size="27" slot="left" @tap="onBack" color="#FFF"></sw-icon>
		</z-nav-bar>
		<view v-if="!isiOS">
			<call-records ref="callRecords" v-show="isactive == 0"></call-records>
		</view>
		<view v-if="isLoadAddressBook">
				<address-book ref="addressBook" v-show="isactive == 1"></address-book>
		</view>
    </div>
</template>

<script>
export { default } from './customerCommunication.js';
</script>

<style lang="less" scoped>
@import url('customerCommunication.less');
</style>