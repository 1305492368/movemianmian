<template>
  <div class="techincItem">
    <div class="left">
      <!-- van-multi-ellipsis--l2   van内置class,最多显示2行 -->
      <div class="left-top van-multi-ellipsis--l2">{{ info.title }}</div>
      <div class="left-bottom">
        <!-- 过滤器:字符加工
            定义:   filters(data和methods兄弟):{
              本质就是一个function,一定要return 一个值
              注意点:方法内不能用this
               方法名(参数){                 
             return 加工后的参数
               }
               }
            调用  使用地方:(v-bind  插值语法)   {{参数 | 方法名}} 

            全局使用:  Vue.filter(方法名,function(参数){return 值})       
         -->
        <span class="l1">{{ info.updated_at | formatTime }}</span>
        <i class="iconfont l2">&#xe644;</i>
        <span class="l3">{{ info.read }}</span>
        <i class="iconfont l4">&#xe638;</i>
        <span class="l5">{{ info.star }}</span>
      </div>
    </div>
    <img class="right" v-if="info.cover" :src="baseUrl + info.cover" alt="" />
  </div>
</template>
<script>
import moment from 'moment'
export default {
  props: {
    info: {
      type: Object
    }
  },
  // filters: {
  //   formatTime (val) {
  //     // 需求:转换成与当前时间比较的小时差(24小时内) 超过24小时,使用正常时间
  //     //  moment时间a.diff(moment时间b,'hours')     moment时间a-moment时间b的小时差
  //     const _diff = moment().diff(moment(val), 'h')
  //     if (_diff < 1) {
  //       return '刚刚'
  //     } else if (_diff >= 1 && _diff < 240) {
  //       return _diff + '小时前'
  //     } else {
  //       return moment(val).format('YYYY/MM/DD HH:mm:ss')
  //     }
  //   }
  // },
  data () {
    return {
      baseUrl: process.env.VUE_APP_URL
    }
  }
}
</script>
<style lang="less" scoped>
.techincItem {
  display: flex;
  //    align-items默认值stretch是高度适应(高度会拉伸以适合高度)
  align-items: center;
  margin-bottom: 20px;
  .left {
    flex: 1;
    display: flex;
    // 拉伸高度以适应
    align-self: stretch;
    // 改变flex主轴方向
    flex-direction: column;
    // 主轴方向两端对齐
    justify-content: space-between;
    .left-top {
      font-size: 16px;
      font-family: PingFangSC, PingFangSC-Medium;
      font-weight: 500;
      text-align: left;
      color: #181a39;
      line-height: 22px;
      letter-spacing: 0px;
    }
    .left-bottom {
      margin-top: 15px;
      display: flex;
      font-size: 12px;
      color: #ccc;
      align-items: center;
      .l1 {
        flex: 1;
      }
    }
  }
  .right {
    width: 113px;
    height: 75px;
    // 让图片不变形  cover与contain
    object-fit: contain;
    margin-left: 15px;
  }
}
</style>
