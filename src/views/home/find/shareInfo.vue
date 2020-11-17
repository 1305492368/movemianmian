<template>
  <div class="shareInfo">
    <hmNavBar :path="repath"></hmNavBar>
    <div class="content">
      <h3 class="title">{{ info.title }}</h3>
      <div class="other">
        <div class="o1">{{ info.updated_at | formatTime }}</div>
        <div class="iconfont o2">&#xe644;</div>
        <div class="o3">{{ info.read }}</div>
        <div
          class="o4 iconfont"
          @click="toStar"
          :class="{ red: isLogin && userInfo.starArticles.includes(+id) }"
        >
          &#xe638;
        </div>
        <div
          class="o5"
          @click="toStar"
          :class="{ red: isLogin && userInfo.starArticles.includes(+id) }"
        >
          {{ info.star }}
        </div>
      </div>
      <div class="content-html" v-html="info.content"></div>
      <!-- 评论 -->
      <!-- 上拉加载
      van-list
         v-model:boolean  true:表示 正在加载  false:此次加载完成
         finished:boolean 值  true:所有加载完成   false:所有加载还没完成
         finished-text:加载完成后的文本显示
         @load="滚动条离底部小于300时自动执行(v-model为false在执行过程中将v-model的值转换为true,load方法加载执行完成,需要将v-model的值转换成false,判断所有加载是否完成,完成,finished的值为true)"     
      
       -->

      <div class="comment">
        <h3 class="comment-title">评论<span class="num">87</span></h3>
        <van-list
          v-model="loading"
          :finished="finished"
          finished-text="已加载完成"
          @load="load"
        >
          <div
            class="comment-item"
            v-for="(item, index) in commentList"
            :key="index"
          >
            <div class="comment-top">
              <img
                v-if="item.author.avatar"
                :src="baseUrl + item.author.avatar"
                class="c1"
                alt=""
                @click="reComment(item.id)"
              />
              <img
                @click="reComment(item.id)"
                v-else
                src="@/assets/logo.png"
                class="c1"
                alt=""
              />
              <div class="c2">
                <div class="c2-top">{{ item.author.nickname }}</div>
                <div class="c2-bottom">{{ item.created_at | formatTime }}</div>
              </div>
              <div>{{ item.star }}</div>
              <i
                class="iconfont"
                @click="toCommentStar(item)"
                :class="{
                  red: commentStar(item.id)
                }"
                >&#xe638;</i
              >
            </div>
            <div class="comment-middle">
              {{ item.content }}
            </div>
            <div
              class="comment-bottom"
              v-if="item.children_comments.length > 0"
            >
              <div
                class="comment-bottom-item"
                v-for="(item2, index2) in item.children_comments"
                :key="index2"
              >
                <span class="left">{{ item2.author }}:</span>
                <span class="right">{{ item2.content }}</span>
              </div>
            </div>
          </div>
        </van-list>
      </div>

      <!-- 工具栏 -->
      <div class="tool">
        <div class="t1" @click="shoreComment">
          我来补充两句
        </div>
        <!-- <div class="t2" :class="{ red:已登陆且 用户的collectArticles包含当前的文章id }"> -->
        <div
          class="t2"
          :class="{ red: $store.getters.getCollect(+id) }"
          @click="toCollect"
        >
          <div class="iconfont">&#xe63c;</div>
          <div class="num">{{ info.collect }}</div>
        </div>
        <div
          class="t2"
          @click="toStar"
          :class="{ red: isLogin && userInfo.starArticles.includes(+id) }"
        >
          <div class="iconfont">&#xe638;</div>
          <div class="num">{{ info.star }}</div>
        </div>
        <div class="t2">
          <div class="iconfont">&#xe63e;</div>
          <div class="num">{{ info.share }}</div>
        </div>
      </div>
      <!-- 跳出弹窗
      van-popup
         v-model="控制是否显示"
         position:显示的位置
      el-input
         type="textarea"
         rows="5"
      van-field
          type="textarea"
          rows="5"
          v-model="双向绑定"     
       -->
      <van-popup v-model="isShow" position="bottom">
        <div class="send">
          <van-field
            class="field"
            v-model="fieldValue"
            type="textarea"
            rows="4"
            placeholder="我来补充二句"
          ></van-field>
          <div class="send-btn" @click="send">发送</div>
        </div>
      </van-popup>
    </div>
  </div>
</template>
<script>
import {
  articlesShareInfo,
  articlesComments,
  sendArticlesComments,
  articlesCollect,
  articlesStar,
  articleCommentsStar
} from '@/api/find.js'
import { mapState } from 'vuex'
export default {
  computed: {
    ...mapState(['userInfo', 'isLogin']),
    // 依赖一个或者多个值产生一个新的值
    commentStar () {
      // return this.isLogin && this.userInfo.starComments.includes(+id)
      //  计算属性传参:return 一个function (){也要return一个值}
      return id => {
        return this.isLogin && this.userInfo.starComments.includes(+id)
      }
    }
  },
  data () {
    return {
      id: this.$route.params.id,
      repath: this.$route.query.repath,
      info: '', //文章详情
      baseUrl: process.env.VUE_APP_URL,
      commentList: [], //评论数据
      loading: false, //上拉加载loading
      finished: false,
      currentPage: 0,
      pageSize: 5,
      isShow: false, //弹窗是否显示
      fieldValue: '', //评论框文本内容
      parent: '' //回复评论id
    }
  },
  async created () {
    const res = await articlesShareInfo(this.id)
    this.info = res.data.data
  },
  methods: {
    init () {
      this.currentPage = 0
      this.commentList = []
      this.loading = false
      this.finished = true
      this.$nextTick(() => {
        this.finished = false
      })
    },
    async load () {
      this.currentPage++
      const _q = {
        start: (this.currentPage - 1) * this.pageSize,
        limit: this.pageSize
      }
      const res2 = await articlesComments(this.id, _q)
      this.commentList.push(...res2.data.data.list)
      this.loading = false
      if (this.commentList.length >= res2.data.data.total) {
        this.finished = true
      }
      window.console.log('文章评论:', res2)
    },
    // 文章评论
    shoreComment () {
      this.parent = ''
      this.isShow = true
    },
    // 回复评论
    reComment (id) {
      this.parent = id
      this.isShow = true
    },
    // 发送评论
    async send () {
      const res = await sendArticlesComments({
        content: this.fieldValue,
        article: this.id, //文章id
        parent: this.parent //回复评论的id  该参数有值就是回复评论,没有值就是文章评论
      })
      this.$toast.success('发表评论成功!')
      //   关闭弹窗
      this.isShow = false
      if (this.parent === '') {
        this.commentList.unshift(res.data.data)
      } else {
        //   找出this.commentList中id==this.parent的那条评论,添加数据到回复评论
        //  let _index=索引
        /*返回值=数组.findIndex((item,index)=>{return boolean值  true  返回值=index})*/

        let _index = this.commentList.findIndex((item, index) => {
          return item.id === this.parent
        })
        this.commentList[_index].children_comments.push(res.data.data)
      }
      //   this.init()
      window.console.log(res)
    },
    //收藏文章
    async toCollect () {
      const res = await articlesCollect({ id: this.id })
      window.console.log(res)
      if (res.data.data.list.includes(+this.id)) {
        this.$toast.success('收藏成功')
      } else {
        this.$toast('取消收藏')
      }
      // 更新收藏 数量
      this.info.collect = res.data.data.num
      //刷新用户信息
      this.$store.commit('setUserInfoOther', {
        key: 'collectArticles',
        value: res.data.data.list
      })
      // this.$store.dispatch('refreshUserInfo')
    },
    //点赞文章
    async toStar () {
      const res = await articlesStar({
        article: this.id
      })
      window.console.log(res)
      if (res.data.data.list.includes(+this.id)) {
        this.$toast.success('点赞成功')
      } else {
        this.$toast('取消点赞')
      }
      this.info.star = res.data.data.num
      this.$store.commit('setUserInfoOther', {
        key: 'starArticles',
        value: res.data.data.list
      })
    },
    //点赞评论
    async toCommentStar (item) {
      const res = await articleCommentsStar({ id: +item.id })
      if (res.data.data.list.includes(+item.id)) {
        this.$toast.success('点赞成功')
      } else {
        this.$toast('取消点赞')
      }
      // 更新数据
      item.star = res.data.data.num
      //更新vuex
      this.$store.commit('setUserInfoOther', {
        key: 'starComments',
        value: res.data.data.list
      })
    }
  }
}
</script>
<style lang="less" scoped>
.shareInfo {
  .content {
    padding: 20px @p15;
    .title {
      font-size: 18px;
      font-family: PingFangSC, PingFangSC-Medium;
      font-weight: 600;
      text-align: left;
      color: #181a39;
      line-height: 25px;
    }
    .other {
      display: flex;
      align-items: center;
      font-size: 12px;
      font-family: PingFangSC, PingFangSC-Regular;
      font-weight: 400;

      color: #b4b4bd;
      line-height: 16px;
      letter-spacing: 0px;
      margin-top: 15px;
      margin-bottom: 15px;
      .o1 {
        flex: 1;
      }
    }
    .content-html {
      font-size: 16px;
      font-family: PingFangSC, PingFangSC-Regular;
      font-weight: 400;
      text-align: justify;
      color: #181a39;
      line-height: 27px;
      letter-spacing: 0px;
      //   deep处理:v-html的内容在加入了scoped的时候是作用不上去的,通过/deep/ 可以穿透scoped的限制
      //   & /deep/ img {
      //     width: 100%;
      //   }
    }
    // 评论
    .comment {
      margin-top: 20px;
      padding-bottom: 60px;
      .comment-title {
        position: relative;
        font-size: 18px;
        font-family: PingFangSC, PingFangSC-Medium;
        font-weight: 600;
        text-align: left;
        color: #222222;
        line-height: 25px;
        letter-spacing: 0px;
        .num {
          position: absolute;
          top: -4px;
          left: 40px;
          font-size: 12px;
          font-family: PingFangSC, PingFangSC-Medium;
          font-weight: 500;
          text-align: left;
          color: #b4b4bd;
          line-height: 16px;
          letter-spacing: 0px;
        }
      }
      .comment-item {
        padding: 15px;
        .comment-top {
          display: flex;
          align-items: center;
          font-size: 12px;
          font-family: PingFangSC, PingFangSC-Regular;
          font-weight: 400;
          text-align: left;
          color: #b4b4bd;
          line-height: 16px;
          letter-spacing: 0px;
          .c1 {
            width: 35px;
            height: 35px;
            border-radius: 50%;
            margin-right: 10px;
          }
          .c2 {
            flex: 1;
            .c2-top {
              font-size: 12px;
              font-family: PingFangSC, PingFangSC-Semibold;
              font-weight: 600;
              text-align: left;
              color: #545671;
              line-height: 16px;
              letter-spacing: 0px;
            }
            .c2-bottom {
              font-size: 12px;
              font-family: PingFangSC, PingFangSC-Regular;
              font-weight: 400;
              text-align: left;
              color: #b4b4bd;
              line-height: 16px;
              letter-spacing: 0px;
            }
          }
        }
        .comment-middle {
          margin-left: 45px;
          padding: 12px 0;
          font-size: 16px;
          font-family: PingFangSC, PingFangSC-Regular;
          font-weight: 400;
          text-align: justify;
          color: #181a39;
          line-height: 27px;
          letter-spacing: 0px;
        }
        .comment-bottom {
          margin-left: 45px;
          background-color: #f7f4f5;
          padding: 10px;
          .comment-bottom-item {
            font-size: 14px;
            font-family: PingFangSC, PingFangSC-Semibold;
            text-align: left;
            color: #545671;
            line-height: 20px;
            letter-spacing: 0px;
            .left {
              font-weight: 600;
            }
            .right {
              font-weight: 400;
              word-break: break-all;
            }
          }
        }
      }
    }
    // 工具栏
    .tool {
      position: fixed;
      left: 0;
      bottom: 0;
      width: 100%;
      height: 60px;
      padding: @p15;
      display: flex;
      align-items: center;
      background-color: #fff;
      .t1 {
        flex: 1;
        height: 34px;
        background-color: #f7f4f5;
        padding-left: 10px;
        font-size: 14px;
        font-family: PingFangSC, PingFangSC-Regular;
        font-weight: 400;
        text-align: left;
        color: #b4b4bd;
        line-height: 34px;
        letter-spacing: 0px;
      }
      .t2 {
        color: #ccc;
        text-align: center;
        margin-left: 15px;
        .iconfont {
          font-size: 28px;
        }
        .num {
          font-size: 12px;
        }
      }
    }
    //
    .send {
      padding: 15px;
      .field {
        background-color: #f7f4f5;
      }
      .send-btn {
        text-align: right;
        font-size: 14px;
        line-height: 20px;
        color: #ccc;
        margin-top: 10px;
      }
    }
  }
  .red {
    color: red !important;
  }
}
</style>
<style lang="less">
.shareInfo {
  .content-html {
    img {
      width: 100%;
    }
  }
}
</style>
