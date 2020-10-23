<template>
    <view class="page-box">
        <yyt-my-testcom :pageIndex="pageIndex" @onClick="testClick"> </yyt-my-testcom>
    </view>
</template>

<script>
    export { default } from './testComp.js';
</script>

<style lang="less" scoped>
    @import url('testComp.less');
</style>
