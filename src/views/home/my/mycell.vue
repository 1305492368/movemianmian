<template>
  <van-cell center class="mycell" is-link>
    <template #icon>
      <i class="iconfont pr15" v-html="icon"></i>
    </template>
    <template #title>
      <div class="title">{{ title }}</div>
    </template>
    <template #default>
      <img
        class="avatar"
        v-if="type === 'img' && value"
        :src="baseUrl + value"
        alt=""
      />
      <img
        class="avatar"
        v-else-if="type === 'img' && !value"
        src="@/assets/logo.png"
        alt=""
      />
      <div v-else class="value">{{ value }}</div>
    </template>
  </van-cell>
</template>
<script>
export default {
  props: ['icon', 'title', 'value', 'type'],
  data () {
    return {
      baseUrl: process.env.VUE_APP_URL
    }
  }
}
</script>
<style lang="less" scoped>
.mycell {
  .pr15 {
    padding-right: 15px;
  }
  .title {
    font-size: 14px;
    font-family: PingFangSC, PingFangSC-Regular;
    font-weight: 500;
    text-align: left;
    color: #181a39;
    line-height: 20px;
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
  .avatar {
    width: 40px;
    height: 40px;
    border-radius: 50%;
  }
}
</style>
