<template>
  <div class="shareItem">
    <h3
      class="title"
      v-html="info.title"
      @click="
        $router.push('/home/shareInfo/' + info.id + '?repath=' + $route.path)
      "
    ></h3>
    <div
      class="con van-multi-ellipsis--l3"
      @click="
        $router.push('/home/shareInfo/' + info.id + '?repath=' + $route.path)
      "
    >
      {{ info.content }}
    </div>
    <div class="other">
      <img class="o1" :src="baseUrl + info.author.avatar" alt="" />
      <span class="o2">{{ info.author.nickname }}</span>
      <span class="o3">{{ info.updated_at | formatTime }}</span>
      <i class="iconfont o4">&#xe65b;</i>
      <span class="o5">{{ info.read }}</span>
      <i class="iconfont o6">&#xe638;</i>
      <span class="o7">{{ info.star }}</span>
    </div>
  </div>
</template>
<script>
export default {
  props: {
    info: {
      type: Object
    }
  },
  data () {
    return {
      baseUrl: process.env.VUE_APP_URL
    }
  }
}
</script>
<style lang="less" scoped>
.shareItem {
  .title {
    font-size: 16px;
    font-family: PingFangSC, PingFangSC-Medium;
    font-weight: 600;
    text-align: left;
    color: #181a39;
    line-height: 23px;
    letter-spacing: 0px;
  }
  .con {
    font-size: 13px;
    font-family: PingFangSC, PingFangSC-Regular;
    font-weight: 400;
    text-align: left;
    color: #545671;
    line-height: 18px;
    letter-spacing: 0px;
    margin: 15px 0;
  }
  .other {
    display: flex;
    align-items: center;
    font-size: 12px;
    color: #b4b4bd;
    .o1 {
      width: 22px;
      height: 22px;
      border-radius: 50%;
      object-fit: cover;
    }
    .o2 {
      flex: 1;
      font-size: 12px;
      font-family: PingFangSC, PingFangSC-Regular;
      font-weight: 400;
      text-align: left;
      color: #545671;
      line-height: 16px;
      letter-spacing: 0px;
    }
    .o3 {
    }
  }
}
</style>
