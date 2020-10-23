<!--作者:杨亮-->
<template>
    <view class="testMockData">
        <view v-for="(u,idx) in users" :key="idx">
			<h2>{{u.name}}</h2>
			<time>{{u.deadTime}}</time>
			<p>{{u.main}}</p>
		</view>
    </view>
</template>

<script src="./testMockData.js"></script>

<style lang="less" scoped>
    @import url('testMockData.less');
</style>
