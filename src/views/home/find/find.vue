<template>
  <div class="find">
    <van-sticky>
      <hmNavBar :showIcon="false" title="发现"></hmNavBar>
    </van-sticky>
    <!-- 下拉刷新 -->
    <van-pull-refresh v-model="loading" @refresh="refresh">
      <div class="find-content">
        <findCell title="面试技巧"></findCell>
        <!-- 
        父子传值  props/emit
          传:在子组件标签定义一个属性  属性名=值
          收:子组件内定义一个props:{属性名:{type:Object}}
       -->
        <technicItem
          v-for="(item, index) in technicList"
          :key="index"
          :info="item"
        ></technicItem>
        <!-- 市场数据 -->

        <findCell title="市场数据"></findCell>
        <!-- tag
      van-tag
          color:背景颜色 
          text-color:文本颜色      
       -->
        <van-tag class="tag" color="#eceaea" text-color="#9f9eac">{{
          chartList.city
        }}</van-tag>
        <van-tag class="tag" color="#eceaea" text-color="#9f9eac">{{
          chartList.position
        }}</van-tag>
        <ul class="chart" ref="chart">
          <li
            class="chart-item"
            v-for="(item, index) in chartList.yearSalary"
            :key="index"
          >
            <!-- v-show="index < 3 || showAll" -->
            <div class="c1">{{ item.year.substr(0, 5) }}</div>
            <div class="c2">
              <div
                class="line"
                :style="{
                  width: (item.salary / +chartList.topSalary) * 100 + '%'
                }"
              >
                {{ item.salary }}
              </div>
            </div>
            <div class="c3">
              <div v-if="item.percent != undefined">
                <!-- 下降 -->
                <i class="iconfont" v-if="item.percent < 0">&#xe64e;</i>
                <!-- 上升 -->
                <i v-else class="iconfont">&#xe651;</i>
              </div>
            </div>
            <div class="c4">
              <span v-if="item.percent != undefined">{{ item.percent }}%</span>
            </div>
          </li>
        </ul>
        <div class="look-more" @click="move">
          <div v-if="!showAll">
            <span>展开更多</span> <i class="iconfont">&#xe652;</i>
          </div>
          <div v-else>
            <span>收起</span> <i class="iconfont r180">&#xe652;</i>
          </div>
        </div>
        <!-- 面经分享 -->
        <findCell
          title="面经分享"
          @click.native="$router.push('/home/shareList')"
        ></findCell>
        <div>
          <shareItem
            v-for="(item, index) in shareList"
            :key="index"
            :info="item"
          ></shareItem>
        </div>
      </div>
    </van-pull-refresh>
  </div>
</template>
<script>
// 组件套用组件  1:导入2:注册  3:当标签使用
import findCell from './findCell'
import technicItem from './technicItem'
import { articlesTechnic, chartHot, articlesShare } from '@/api/find.js'
import shareItem from './shareItem'
export default {
  name: 'find',
  components: {
    findCell,
    technicItem,
    shareItem
  },
  data () {
    return {
      technicList: [],
      chartList: '',
      showAll: false, //是否显示全部数据
      shareList: [], //面经分享数据
      loading: false //下拉刷新v-model
    }
  },
  created () {
    this.refresh()
  },

  activated () {
    // alert('缓存页面显示时')
  },
  deactivated () {
    // alert('缓存页面隐藏时')
  },
  methods: {
    move () {
      this.showAll = !this.showAll
      if (this.showAll) {
        this.$refs.chart.style.height = this.$refs.chart.scrollHeight + 'px'
      } else {
        this.$refs.chart.style.height =
          (this.$refs.chart.scrollHeight / this.chartList.yearSalary.length) *
            3 +
          'px'
      }
    },
    // 刷新
    async refresh () {
      // 10个接口,同时调用,调用完成后,做一个其它处理
      // Promise.all([articlesTechnic(),chartHot(),articlesShare()]).then(res=>{  res=[1的结果 ,2的结果,3的结果]})
      // 技巧列表
      const res = await articlesTechnic()
      this.technicList = res.data.data.list
      // 数据
      const res2 = await chartHot()
      // 找出工资最高的
      // let _max = 0
      // res2.data.data.yearSalary.forEach(item => {
      //   if (+item.salary > _max) {
      //     _max = +item.salary
      //   }
      // })
      this.chartList = res2.data.data
      this.$nextTick(() => {
        this.$refs.chart.style.height =
          (this.$refs.chart.scrollHeight / this.chartList.yearSalary.length) *
            3 +
          'px'
      })
      // 面经分享
      const res3 = await articlesShare()
      this.shareList = res3.data.data.list
      window.console.log('面经分享:', res3)
      this.loading = false
    }
  }
}
</script>
<style lang="less" scoped>
.find {
  .find-content {
    padding: 20px @p15;
  }
  .tag {
    padding: 4px 6px;
    margin-right: 10px;
  }
  .chart {
    transition: height 1s;
    overflow: hidden;
    .chart-item {
      display: flex;
      align-items: center;
      color: #545671;
      font-size: 14px;
      line-height: 20px;
      padding: 4px 0;
      .c1 {
        width: 50px;
      }
      .c2 {
        flex: 1;
        height: 14px;
        background-color: #ebdfdf;
        border-radius: 4px;
        .line {
          border-radius: 4px;
          height: 14px;
          background-color: #fe6d67;
          color: #fff;
          text-align: right;
          padding-right: 5px;
          font-size: 12px;
          line-height: 16px;
        }
      }
      .c3 {
        width: 20px;
      }
      .c4 {
        width: 40px;
      }
    }
  }
  .look-more {
    font-size: 14px;
    font-family: PingFangSC, PingFangSC-Regular;
    font-weight: 400;
    text-align: center;
    color: #545671;
    line-height: 20px;
    letter-spacing: 0px;
    .r180 {
      display: inline-block;
      // transform块级元素和部分行内元素
      transform: rotate(180deg);
    }
  }
}
</style>
