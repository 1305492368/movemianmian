<template>
  <div class="shareList">
    <hmNavBar title="面经分享" path="/home/find"></hmNavBar>
    <div class="content">
      <!-- 搜索框 -->
      <van-search
        v-model="searchValue"
        show-action
        @search="search"
        @cancel="cancel"
      ></van-search>
      <!-- 列表 -->
      <van-list v-model="loading" :finished="finished" @load="load" v-if="!bol">
        <shareItem
          v-for="(item, index) in shareList"
          :key="index"
          :info="item"
        ></shareItem>
        <div class="noData" v-if="finished && shareList.length === 0">
          暂无数据
        </div>
      </van-list>
      <!-- 大家都在搜 -->
      <div v-else>
        <h3 class="title">大家都在搜</h3>
        <!-- tag
          color:背景色  text-color:字体颜色 
           -->
        <van-tag
          v-for="(item, index) in hotList"
          :key="index"
          class="tag"
          color="#f7f4f5"
          text-color="#545671"
          @click="search(item)"
          >{{ item }}</van-tag
        >

        <div class="history">
          <h3 class="title">历史搜索</h3>
          <span class="clear" @click="clear">清空</span>
        </div>
        <!-- tag
          color:背景色  text-color:字体颜色 
           -->
        <van-tag
          v-for="(item, index) in historyList"
          :key="index"
          @click="search(item)"
          class="tag"
          color="#f7f4f5"
          text-color="#545671"
          >{{ item }}</van-tag
        >
      </div>
    </div>
  </div>
</template>
<script>
import shareItem from './shareItem'
import { articlesShare, shareTopSearch } from '@/api/find.js'
import { saveLocal, getLocal, removeLocal } from '@/utils/local.js'
export default {
  components: {
    shareItem
  },
  data () {
    return {
      hotList: [], //热搜
      historyList: JSON.parse(getLocal('history')) || [], //历史 搜索
      bol: false, //false显示列表,true显示大家都在搜
      searchValue: '',
      shareList: [],
      currentPage: 0, //页码   [0,1,2,3,4,5,6,7,8,9,10]  2   5   start:(2-1)*5  10  limit:5   3  5
      pageSize: 1, //页容量
      loading: false, //true正在加载,上拉时,它会自动变true  false:此次加载完成
      finished: false //表示 是否加载完成  false还没完成  true:所有数据已加载完成
    }
  },
  async created () {
    const res = await shareTopSearch()
    this.hotList = res.data.data
    window.console.log('hot:', res)
  },
  methods: {
    //   上加加载
    async load () {
      // 分页+1
      this.currentPage++
      let _q = {
        start: (this.currentPage - 1) * this.pageSize,
        limit: this.pageSize,
        q: this.searchValue
      }
      const res = await articlesShare(_q)
      //   数据应该是累加
      window.console.log('列表数据', res)

      res.data.data.list.forEach(item => {
        if (this.searchValue != '') {
          let _arr = item.title.split(this.searchValue)
          item.title = _arr.join(
            "<span style='color:red'>" + this.searchValue + '</span>'
          )
        }
      })
      this.shareList.push(...res.data.data.list)
      //   数据加载完成要改loading为false
      this.loading = false
      //如果数据加载完成 finished=true
      if (this.shareList.length >= res.data.data.total) {
        this.finished = true
      }
      window.console.log(res)
    },
    //   搜索事件
    search (value) {
      this.bol = false
      this.searchValue = value
      if (value.trim() !== '') {
        this.historyList.unshift(value)
      }
      // 去重 set内部不允许重复
      this.historyList = [...new Set(this.historyList)]
      //   只显示前6个   splice(起始值,个数)  [1,2,3].splice(1)
      // 删除3以后的
      this.historyList.splice(3)

      //   保存到本地
      saveLocal(JSON.stringify(this.historyList), 'history')
      window.console.log(value)
      //   1:先还原van-list用到的所有数据
      this.currentPage = 0
      this.shareList = []
      // 2:让load方法执行
      this.loading = false
      this.finished = true
      this.$nextTick(() => {
        this.finished = false
      })
    },
    // 取消事件
    cancel () {
      this.bol = true
      window.console.log('清空值')
    },
    // 清空
    clear () {
      this.historyList = []
      removeLocal('history')
    }
  }
}
</script>
<style lang="less" scoped>
.shareList {
  .content {
    padding: 8px @p15;
    .noData {
      text-align: center;
    }
    .title {
      font-size: 18px;
      font-family: PingFangSC, PingFangSC-Medium;
      font-weight: 600;
      text-align: left;
      color: #222222;
      line-height: 25px;
      letter-spacing: 0px;
    }
    .tag {
      padding: 6px 9px;
      margin-right: 15px;
    }
    .history {
      display: flex;
      justify-content: space-between;
      align-items: center;
      margin-top: 30px;
      .clear {
        font-size: 12px;
        font-family: PingFangSC, PingFangSC-Regular;
        font-weight: 400;
        text-align: left;
        color: #545671;
        line-height: 16px;
        letter-spacing: 0px;
      }
    }
  }
}
</style>
