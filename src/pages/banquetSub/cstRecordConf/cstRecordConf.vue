<template>
	<view >
		 <view>
		       
		        <view class="titletext">
		                      <text>{{titletext}}</text>
		         </view>
		        <view class="uni-list">
		            <radio-group @change="radioChange">
		                <label class="uni-list-cell uni-list-cell-pd" v-for="item in CstRecordList" :key="item.id">
		                   
		                    
							<view>
								<view class="left">   <radio :value="item.id"  style="transform:scale(0.8)"/></view>
								<view class="lefttext" ><view class="confName">{{item.cstRecordConfName}}</view><view v-if="item.cstName!=null&&item.cstName!=''" class="cstName">({{item.cstName}})</view></view>
							 
							</view>
							
		                </label>
		            </radio-group>
		        </view>
		    </view>
    </view>
</template>

<script>
		export { default } from './cstRecordConf.js';
</script>

<style>
		@import url('cstRecordConf.less');
</style>
