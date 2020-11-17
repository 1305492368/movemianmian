<template>
  <div class="my">
    <div class="top">
      <div class="user">
        <div class="left">
          <div class="left-top">{{ userInfo.nickname }}</div>
          <div class="left-bottom">{{ userInfo.intro }}</div>
        </div>

        <img
          v-if="userInfo.avatar"
          class="right"
          :src="baseUrl + userInfo.avatar"
          alt=""
          @click="$router.push('/home/myInfo')"
        />
        <img
          v-else
          class="right"
          src="@/assets/logo.png"
          @click="$router.push('/home/myInfo')"
          alt=""
        />
      </div>
      <ul class="data">
        <li class="item">
          <div class="num">298</div>
          <div class="txt">累计答题</div>
        </li>
        <li class="item">
          <div class="num">98</div>
          <div class="txt">收藏题目</div>
        </li>
        <li class="item">
          <div class="num">198</div>
          <div class="txt">我的错题</div>
        </li>
        <li class="item">
          <div class="num">76%</div>
          <div class="txt">正确率</div>
        </li>
      </ul>
      <!-- 单元格
      van-cell  title     value   is-link   center:居中
      slot:icon  左边图标   
           title:左边文本
           default:右边文本
           right-icon:右边图标     
       -->
      <div class="position">
        <!-- props
        传:在子组件标签上定义一个属性  属性名=值
        收:子组件内定义一个props(data兄弟):["属性名"]        
         -->
        <mycell
          class="cell"
          icon="&#xe64d;"
          title="我的岗位"
          :value="userInfo.position"
          @click.native="$router.push('/home/editInfo?type=position')"
        ></mycell>
        <!-- <van-cell center class="cell" is-link>
          <template #icon>
            <i class="iconfont pr15">&#xe64d;</i>
          </template>
          <template #title>
            <div class="title">我的岗位</div>
          </template>
          <template #default>
            <div class="value">产品经理</div>
          </template>
        </van-cell> -->
      </div>
    </div>
    <div class="content">
      <div class="middle">
        <h3>面经数据</h3>
        <ul class="data-total">
          <li class="total-item">
            <div class="t1">昨日阅读<span class="color">+300</span></div>
            <div class="num">17</div>
            <div class="txt">阅读总数</div>
          </li>
          <li class="total-item">
            <div class="t1">昨日获赞<span class="color">+300</span></div>
            <div class="num">17</div>
            <div class="txt">获赞总数</div>
          </li>
          <li class="total-item">
            <div class="t1">昨日新增<span class="color">+300</span></div>
            <div class="num">17</div>
            <div class="txt">评论总数</div>
          </li>
        </ul>
      </div>
      <div class="bottom">
        <mycell
          class="round"
          icon="&#xe655;"
          title="我的面经分享"
          value="21"
        ></mycell>
        <mycell icon="&#xe656;" title="我的消息" value="21"></mycell>
        <mycell icon="&#xe654;" title="收藏的题库" value="21"></mycell>
        <mycell icon="&#xe648;" title="收藏的企业" value="21"></mycell>
        <mycell icon="&#xe64f;" title="我的错题" value="21"></mycell>
        <mycell icon="&#xe649;" title="收藏的面试经验" value="21"></mycell>
      </div>
    </div>
  </div>
</template>
<script>
// 组件套用组件  1:导入   2:注册   3:当标签使用
/*
mapState
 1:导入  import {mapState} from 'vuex'
 2:放入计算属性
     computed:{
       ...mapState(['相应的state名字(userInfo)'])
       userInfo(){
return this.$store.state.userInfo
       },
       isLogin(){
return this.$store.state.isLogin
       }
     }
  访问state的userInfo   this.userInfo
*/

import mycell from './mycell'
import { mapState } from 'vuex'
export default {
  name: 'my',
  // 计算属性
  // 使用场景:依赖一个或者多个值产生一个新的值,特点:依赖的值改变了,它会立马改变
  /*
  基本使用:
       computed:{
         方法名(){
           return 值
         }
       }
  */

  computed: {
    ...mapState(['userInfo'])
    // user () {
    //   return this.$store.state.userInfo
    // }
  },
  components: {
    mycell
  },
  created () {
    window.console.log('mapState:', mapState(['userInfo', 'isLogin']))
  },
  data () {
    return {
      baseUrl: process.env.VUE_APP_URL
    }
  },
  methods: {}
}
</script>
<style lang="less" scoped>
.my {
  .top {
    position: relative;
    background-color: #c2002e;
    padding: 31px @p15 0;

    .user {
      display: flex;
      align-items: center;
      .left {
        flex: 1;
        .left-top {
          font-size: 21px;
          font-family: PingFangSC, PingFangSC-Semibold;
          font-weight: 600;
          text-align: left;
          color: #ffffff;
          line-height: 30px;
          letter-spacing: 0px;
        }
        .left-bottom {
          opacity: 0.7;
          font-size: 12px;
          font-family: PingFangSC, PingFangSC-Regular;
          font-weight: 400;
          text-align: left;
          color: #ffffff;
          line-height: 17px;
          letter-spacing: 0px;
        }
      }
      .right {
        width: 50px;
        height: 50px;
        border: 3px solid rgba(255, 255, 255, 0.38);
        border-radius: 50%;
      }
    }
    .data {
      display: flex;
      align-items: center;
      justify-content: space-around;
      margin-top: 30px;
      padding-bottom: 55px;
      .num {
        font-size: 21px;
        font-family: DINAlternate, DINAlternate-Bold;
        font-weight: 700;
        text-align: center;
        color: #ffffff;
        line-height: 24px;
        letter-spacing: 0px;
      }
      .txt {
        opacity: 0.7;
        font-size: 12px;
        font-family: PingFangSC, PingFangSC-Regular;
        font-weight: 400;
        text-align: center;
        color: #ffffff;
        line-height: 16px;
        letter-spacing: 0px;
      }
    }
    .position {
      position: absolute;
      left: 0;
      bottom: -16px;
      padding: 0 @p15;
      width: 100%;
    }
    .cell {
      border-top-left-radius: 8px;
      border-top-right-radius: 8px;
    }
  }
  .content {
    background-color: #f7f4f5;
    padding: 26px @p15;
    .middle {
      padding: 15px;
      background-color: #fff;
      border-radius: 8px;
      h3 {
        font-size: 14px;
        font-family: PingFangSC, PingFangSC-Semibold;
        font-weight: 600;
        text-align: left;
        color: #181a39;
        line-height: 20px;
        letter-spacing: 0px;
        margin-bottom: 20px;
      }
      .data-total {
        display: flex;
        justify-content: space-around;
        text-align: center;
        .t1 {
          font-size: 12px;
          font-family: PingFangSC, PingFangSC-Regular;
          font-weight: 400;
          text-align: center;
          color: #b4b4bd;
          line-height: 14px;
          letter-spacing: 0px;
          .color {
            color: #38c7dd;
          }
        }
        .num {
          font-size: 21px;
          font-family: DINAlternate, DINAlternate-Bold;
          font-weight: 700;
          text-align: center;
          color: #181a39;
          line-height: 24px;
          letter-spacing: 0px;
        }
        .txt {
          font-size: 12px;
          font-family: PingFangSC, PingFangSC-Regular;
          font-weight: 400;
          text-align: center;
          color: #545671;
          line-height: 16px;
          letter-spacing: 0px;
        }
      }
    }
    .bottom {
      margin-top: 20px;
      .round {
        border-top-left-radius: 8px;
        border-top-right-radius: 8px;
      }
    }
  }
}
</style>
