<!--作者:{Author}-->
<template>
    <view>
        <!--头部-->
        <view class="page-header"><page-head :title="title"></page-head></view>

        <!--内容-->
        <view class="page-content"></view>


        <!--底部-->
        <view class="page-bottom"></view>
    </view>
</template>

<script>
    export { default } from './mytemplate.js';
</script>

<style lang="less" scoped>
    @import url('mytemplate.less');
</style>
