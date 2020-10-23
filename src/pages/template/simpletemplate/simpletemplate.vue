<!--作者:{Author}-->
<template>
    <view class="page-box">
        <!--头部-->
        <view class="page-top"><page-head :title="title"></page-head></view>

        <!--内容-->
        <view class="page-center"></view>


        <!--底部-->
        <view class="page-bottom"></view>
    </view>
</template>

<script>
    export { default } from './simpletemplate.js';
</script>

<style lang="less" scoped>
    @import url('simpletemplate.less');
</style>
