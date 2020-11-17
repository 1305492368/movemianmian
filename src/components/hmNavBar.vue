<template>
  <!-- 导航栏
         van-nav-bar
            left-text:左边文本
            right-text:右边文本
            title:中间文本
            left-arrow:左边
            slot="left/title/right"
            @click-left左边点击
            @click-right

emit
   定义 :子组件标签定义一个方法  @子组件方法名=父组件方法
   触发:子组件内  this.$emit("子组件方法名",参数)
只需要知道路由地址
       -->
  <van-nav-bar
    class="hmNavBar"
    @click-left="$router.push(path)"
    @click-right="clickRight"
  >
    <template #left v-if="showIcon">
      <i class="iconfont f44">&#xe637;</i>
    </template>
    <template #title>
      <div class="title">{{ title }}</div>
    </template>
    <template #right>
      <div class="right">{{ rightText }}</div>
    </template>
  </van-nav-bar>
</template>
<script>
export default {
  name: 'hmNavBar',
  // props: ['title', 'path', 'rightText', 'showIcon'],
  props: {
    title: {
      type: String
    },
    path: {
      type: String
    },
    rightText: {
      type: String
    },
    showIcon: {
      type: Boolean,
      default: true
    }
  },
  methods: {
    clickRight () {
      this.$emit('clickRight')
    }
  }
}
</script>
<style lang="less" scoped>
.hmNavBar {
  .title {
    font-size: 18px;
    font-family: PingFangSC, PingFangSC-Semibold;
    font-weight: 600;
    text-align: left;
    color: #222222;
    line-height: 25px;
    letter-spacing: 0px;
  }
  .right {
    font-size: 14px;
    font-family: PingFangSC, PingFangSC-Regular;
    font-weight: 400;
    text-align: left;
    color: #181a39;
    line-height: 20px;
    letter-spacing: 0px;
  }
}
</style>
