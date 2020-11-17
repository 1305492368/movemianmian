<template>
  <div class="home">
    <!-- keepalive内的页面全会(没有其它参数配制)缓存 
          include="路由对应组件的name值",只缓存include对应页面组件
          exclude="路由对应组件的name值" 除了它包含的对应页面组件,其它都缓存
     -->
    <keep-alive include="find,my">
      <router-view></router-view>
    </keep-alive>
    <!-- 标签栏
    van-tabbar
       v-model="选中某项的索引"
       active-color:选中后的颜色 
       inactive-color:不选中时颜色 
       route:(在路由模式下v-model无效)路由模式  对应子项的to 
       placeholder:生成一个等高的元素占位
     van-tabbar-item   icon 
         to:对应path地址        
        slot="icon" 
     -->
    <van-tabbar
      v-if="$route.meta.needTab"
      route
      active-color="#e40137"
      inactive-color="#b4b4bd"
      placeholder
    >
      <van-tabbar-item>
        <span>公司</span>
        <template #icon>
          <i class="iconfont f28">&#xe63b;</i>
        </template>
      </van-tabbar-item>
      <van-tabbar-item to="/home/question">
        <span>刷题</span>
        <template #icon>
          <i class="iconfont f28">&#xe63f; </i>
        </template>
      </van-tabbar-item>
      <van-tabbar-item to="/home/find">
        <span>发现</span>
        <template #icon>
          <i class="iconfont f28">&#xe63a;</i>
        </template>
      </van-tabbar-item>
      <van-tabbar-item to="/home/my">
        <span>我的</span>
        <template #icon>
          <i class="iconfont f28">&#xe64b;</i>
        </template>
      </van-tabbar-item>
    </van-tabbar>
  </div>
</template>
<script>
export default {
  data () {
    return {}
  }
}
</script>
<style lang="less" scoped>
.home {
  height: 100%;
  .f28 {
    font-size: 28px;
  }
}
</style>
