<template>
  <div class="question" v-if="info != ''">
    <van-dropdown-menu>
      <van-dropdown-item ref="city">
        <!-- slot="title/default" -->
        <!-- 自定义标题栏 -->
        <template #title>
          <div class="title">
            <span class="t1">面试宝典</span><span class="t2">{{ city }}</span>
          </div>
        </template>
        <template>
          <van-index-bar>
            <!-- 对象的key转换成数据
              Object.keys(对象)   
               -->
            <!-- 对象for渲染渲染也可以 -->
            <div v-for="(item, index) in Object.keys(info.citys)" :key="index">
              <van-index-anchor :index="item" class="anchor"></van-index-anchor>
              <van-cell
                v-for="(item2, index2) in info.citys[item]"
                :key="index2"
                :title="item2"
                @click="cellClick(item2)"
              ></van-cell>
            </div>
          </van-index-bar>
        </template>
      </van-dropdown-item>
    </van-dropdown-menu>
    <div class="content">
      <div class="nav">
        <van-tag
          v-for="(item, index) in info.cityPositions[city]"
          :key="index"
          color="#f7f4f5"
          text-color="#7d7e92"
          class="tag"
          :class="{ active: currIndex === index }"
          @click="currIndex = index"
          >{{ item.name }}</van-tag
        >
      </div>
    </div>
    <div class="middle">
      <div class="middle-item left-top">
        <div class="circle">
          <i class="iconfont">&#xe64f;</i>
        </div>
        <div class="txt">常错题库</div>
      </div>
      <div class="middle-item right-top">
        <div class="circle">
          <i class="iconfont">&#xe64f;</i>
        </div>
        <div class="txt">常错题库</div>
      </div>
      <div class="middle-item left-bottom">
        <div class="circle">
          <i class="iconfont">&#xe64f;</i>
        </div>
        <div class="txt">常错题库</div>
      </div>
      <div class="middle-item right-bottom">
        <div class="circle">
          <i class="iconfont">&#xe64f;</i>
        </div>
        <div class="txt">常错题库</div>
      </div>
      <div class="middle-center">
        <!-- js的css它是不会转换成rem的 -->
        <van-circle
          v-model="rate"
          :rate="endRate"
          :speed="50"
          class="vancircle"
          layer-color="none"
          :size="120 / 37.5 + 'rem'"
          :color="gradientColor"
        >
          <div class="other">
            <div class="o1">顺序刷题</div>
            <div>{{ getCollectTotal }}/{{ info.totalCount }}</div>
          </div>
        </van-circle>
      </div>
    </div>
    <!-- 累计收录 -->
    <div class="content-total">
      <h3 class="txt">累计收录</h3>
      <div class="num">23,456,245,000</div>
    </div>
    <div class="content">
      <van-button block color="#00b8d4" @click="goInfo">模拟面试</van-button>
    </div>
  </div>
</template>
<script>
import { interviewFilters } from '@/api/question.js'
// import { mapGetters, mapMutations, mapActions } from 'vuex'
import { mapGetters } from 'vuex'

export default {
  computed: {
    ...mapGetters(['getCollectTotal'])
  },
  data () {
    return {
      currIndex: 0,
      city: '全国',
      info: '',
      rate: 0,
      endRate: 30,
      //   border-image: linear-gradient(135deg, rgba(228,1,55,0.3), rgba(228,1,55,0.7) 99%) 13 13;

      gradientColor: {
        '0%': 'rgba(228,1,55,0.7)',
        '100%': 'rgba(228,1,55,0.3)'
      }
    }
  },
  async created () {
    const res = await interviewFilters()
    this.info = res.data.data
    window.console.log('城市数据:', res)
  },
  methods: {
    // 可以调用: this.setLoginStatus(false)
    // ...mapMutations(['setLoginStatus']),
    // ...mapActions(['refreshUserInfo']),
    //城市点击
    cellClick (str) {
      // this.setLoginStatus(false)
      // this.refreshUserInfo()
      this.city = str
      //   通过调用van-dropdown-item上的toggle方法关掉下拉选项
      this.$refs.city.toggle(false)
      this.currIndex = 0
    },
    goInfo () {
      this.$router.push(
        '/home/questionInfo?type=' +
          this.info.cityPositions[this.city][this.currIndex].id +
          '&city=' +
          this.city
      )
    }
  }
}
</script>
<style lang="less" scoped>
.question {
  .title {
    .t1 {
      font-size: 18px;
      font-family: PingFangSC, PingFangSC-Semibold;
      font-weight: 600;
      text-align: left;
      color: #222222;
      line-height: 25px;
      letter-spacing: 0px;
    }
    .t2 {
      font-size: 12px;
      font-family: PingFangSC, PingFangSC-Regular;
      font-weight: 400;
      text-align: center;
      color: #545671;
      line-height: 16px;
    }
  }
  .anchor {
    background-color: #f7f4f5;
  }
  .content {
    padding: 0 @p15;
    .nav {
      overflow-x: auto;
      display: flex;
      padding: 10px 0;
      .tag {
        //   flex-shrink默认值是1,位置不够时,它会自动缩小,需要修改为0
        flex-shrink: 0;
        padding: 6px 8px;
        margin-right: 15px;
      }
      .active {
        background-color: #00b8d4 !important;
        color: #fff !important;
      }
    }
  }
  .middle {
    height: 200px;
    position: relative;
    overflow: hidden;
    .middle-item {
      width: 60px;
      text-align: center;
      .circle {
        margin-left: 9px;
        width: 44px;
        height: 44px;
        background: linear-gradient(180deg, #ff8080, #ff4949);
        border-radius: 50%;
        text-align: center;
        .iconfont {
          font-size: 24px;
          line-height: 44px;
          color: #fff;
        }
      }
      .txt {
        text-align: center;
        font-size: 12px;
        margin-top: 8px;
      }
    }
    .left-top {
      position: absolute;
      top: 20px;
      left: 40px;
    }
    .right-top {
      position: absolute;
      top: 20px;
      right: 40px;
    }
    .left-bottom {
      position: absolute;
      bottom: 20px;
      left: 40px;
    }
    .right-bottom {
      position: absolute;
      bottom: 20px;
      right: 40px;
    }
    .middle-center {
      position: absolute;
      width: 120px;
      height: 120px;
      top: 50%;
      left: 50%;
      transform: translate(-50%, -50%);
      background: url(~@/assets/circle.png);
      background-size: 100%;
      .vancircle {
        width: 100%;
        height: 100%;
        padding: 10px;
      }
      .other {
        width: 100%;
        height: 100%;
        background-color: #fa5e84;
        border-radius: 50%;
        color: #fff;
        font-size: 14px;
        display: flex;
        flex-direction: column;
        justify-content: center;
      }
    }
  }
  .content-total {
    text-align: center;
    margin-bottom: 20px;
    .txt {
      font-size: 18px;
      font-family: PingFangSC, PingFangSC-Semibold;
      font-weight: 600;
      line-height: 25px;
      letter-spacing: 0px;
    }
    .num {
      font-size: 30px;
      font-family: PingFangSC, PingFangSC-Semibold;
      font-weight: 600;
      color: #545671;
      line-height: 42px;
      letter-spacing: 1px;
      margin-top: 20px;
    }
  }
}
</style>
