<template>
  <!-- van-cell
       title:左边文本
       value:右边文本
       is-link
       center:上下居中
       slot=title/default
 -->
  <div class="findCell">
    <van-cell is-link center>
      <template #title>
        <div class="title">{{ title }}</div>
      </template>
      <template #default>
        <div class="value">
          查看更多
        </div>
      </template>
    </van-cell>
  </div>
</template>
<script>
export default {
  props: ['title']
}
</script>
<style lang="less" scoped>
.findCell {
  .title {
    font-size: 18px;
    font-family: PingFangSC, PingFangSC-Medium;
    font-weight: 600;
    text-align: left;
    color: #222222;
    line-height: 25px;
    letter-spacing: 0px;
  }
  .value {
    font-size: 14px;
    font-family: PingFangSC, PingFangSC-Regular;
    font-weight: 400;
    text-align: right;
    color: #5b5d75;
    line-height: 20px;
    letter-spacing: 0px;
  }
  //   &当前父级class
  //   /deep/   >>>   v-deep
  .van-cell {
    padding-left: 0;
    padding-right: 0;
  }
  //   .van-cell__right-icon {
  //     color: red;
  //   }
}
</style>
