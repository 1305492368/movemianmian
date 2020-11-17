<template>
  <div class="questionInfo" v-if="list.length > 0">
    <van-sticky>
      <hmNavBar
        title="刷题"
        path="/home/question"
        rightText="答题卡"
        @clickRight="clickRightEvent"
      ></hmNavBar>
    </van-sticky>
    <div class="content" v-if="list[currIndex].detail">
      <div class="title">
        【{{ typeObj[list[currIndex].detail.type] }}】{{
          list[currIndex].detail.title
        }}
      </div>
      <div class="tag">
        <van-tag
          class="tag-item"
          color="#f7f4f5"
          text-color="#cac9d0"
          v-for="(item, index) in list[currIndex].detail.tag"
          :key="index"
          >{{ item }}</van-tag
        >
      </div>
      <!-- 单选 -->
      <div class="select" v-if="list[currIndex].detail.type === 1">
        <!-- 正确:当前答案为多少 
        错误:当前选项就是自己的条案 选项  该条案还是错的
        
        -->
        <div
          class="select-item"
          :class="{
            active: ans1 === str[index],
            error:
              list[currIndex].answer &&
              ans1 === str[index] &&
              !list[currIndex].answer.isRight,
            success:
              list[currIndex].answer &&
              list[currIndex].answer.singleAnswer === str[index]
          }"
          v-for="(item, index) in list[currIndex].detail.option"
          :key="index"
          @click="ans1Click(index)"
        >
          {{ str[index] }}.{{ item }}
        </div>
      </div>
      <!-- 多选 -->
      <div class="select" v-else-if="list[currIndex].detail.type === 2">
        <!-- 多选不管错误
          ans2=[A,B,C]
          
           -->
        <!-- success:
              list[currIndex].answer &&
              list[currIndex].answer.multipleAnswer.includes(str[index]) -->
        <div
          class="select-item"
          :class="{
            active: ans2.includes(str[index]),
            success:
              list[currIndex].answer &&
              list[currIndex].answer.multipleAnswer.includes(str[index])
          }"
          v-for="(item, index) in list[currIndex].detail.option"
          :key="index"
          @click="ans2Click(index)"
        >
          {{ str[index] }}.{{ item }}
        </div>
      </div>
      <!-- 简答 -->
      <div class="select" v-else>
        <van-field
          class="field"
          v-model="ans3"
          type="textarea"
          rows="5"
          @input="ans3Event"
          :disabled="step >= 2"
        ></van-field>
      </div>
    </div>
    <!-- 答案 -->
    <div class="answer" v-if="step > 1">
      <h3 class="a1">答案解析</h3>
      <div class="a2" v-if="list[currIndex].detail.type === 1">
        正确答案:{{ list[currIndex].answer.singleAnswer }}
      </div>
      <div class="a2" v-else-if="list[currIndex].detail.type === 2">
        正确答案:{{ list[currIndex].answer.multipleAnswer }}
      </div>
      <div class="a2" v-else>正确答案:</div>
      <div class="a3">
        <div class="a3-1">
          难度:{{ diffObj[list[currIndex].answer.difficulty] }}
        </div>
        <div class="a3-2">提交次数:{{ list[currIndex].answer.submitNum }}</div>
        <div class="a3-3">正确次数:{{ list[currIndex].answer.correctNum }}</div>
      </div>
      <div class="a4">
        {{ list[currIndex].answer.answerAnalysis }}
      </div>
    </div>
    <!-- 底部 -->
    <div class="footer">
      <div class="f1">
        <div class="iconfont">&#xe611;</div>
        <div>收藏</div>
      </div>
      <div class="f1">
        <div class="iconfont">&#xe606;</div>
        <div>反馈</div>
      </div>
      <div class="f2">{{ currIndex + 1 }}/{{ list.length }}题</div>
      <div class="f3">
        <van-button
          color="red"
          v-if="step < 2"
          :disabled="step == 0"
          @click="submit"
          >提交</van-button
        >
        <van-button color="red" v-else-if="step === 2" @click="next"
          >下一题</van-button
        >
        <van-button color="red" v-else>结束</van-button>
      </div>
    </div>
    <!-- 答题卡
    van-popup
      v-model :是否显示
      position:位置 
     -->
    <van-popup v-model="isShow" position="bottom">
      <ul class="card">
        <li
          class="card-item"
          :class="{
            'card-error': item.answer && !item.answer.isRight,
            'card-success': item.answer && item.answer.isRight
          }"
          v-for="(item, index) in list"
          :key="index"
          @click="skip(index)"
        >
          {{ index + 1 }}
        </li>
        <li class="noUse"></li>
        <li class="noUse"></li>
        <li class="noUse"></li>
        <li class="noUse"></li>
        <li class="noUse"></li>
        <li class="noUse"></li>
        <li class="noUse"></li>
      </ul>
    </van-popup>
  </div>
</template>
<script>
import {
  interviewQuestions,
  questionsSubmit,
  getQuestionsInfo
} from '@/api/question'
export default {
  data () {
    return {
      type: this.$route.query.type,
      city: this.$route.query.city,
      step: 0, //0获取题目  但没有答题  1:表示 已答题,但还没有点击提交   2:已提交.但不是最后一题   3:已提交且是最后一题
      list: [], //所有题目数据
      currIndex: 0, //代表目前是第几题
      //题型
      typeObj: {
        1: '单选',
        2: '多选',
        3: '简答'
      },
      //   难度
      diffObj: {
        1: '简单',
        2: '一般',
        3: '困难'
      },
      str: 'ABCDEFGHI',
      ans1: '', //单选题答案
      ans2: [], //多选题答案
      ans3: '', //简答题答案
      isShow: false
    }
  },
  async created () {
    const res = await interviewQuestions({
      type: this.type,
      city: this.city
    })
    this.list = res.data.data
    window.console.log(res)
  },
  methods: {
    //   单选点击
    ans1Click (index) {
      if (this.step < 2) {
        this.ans1 = this.str[index]
        this.step = 1
      }
    },
    //多选点击
    ans2Click (index) {
      if (this.step < 2) {
        //    如果以前选中过该项,现在再选中是取消(删除数组中该项)
        if (this.ans2.includes(this.str[index])) {
          //删除该项
          const _index = this.ans2.indexOf(this.str[index])
          this.ans2.splice(_index, 1)
        } else {
          //    如果以前没选中.添加该项
          this.ans2.push(this.str[index])
        }
        if (this.ans2.length > 0) {
          this.step = 1
        } else {
          this.step = 0
        }
      }
    },
    //简答题输入答案
    ans3Event () {
      if (this.ans3.length > 0) {
        this.step = 1
      } else {
        this.step = 0
      }
    },
    //提交答案
    async submit () {
      const res = await questionsSubmit({
        id: this.list[this.currIndex].id,
        singleAnswer: this.ans1,
        multipleAnswer: this.ans2
      })
      if (this.list.length === this.currIndex + 1) {
        this.step = 3
      } else {
        this.step = 2
      }
      //   保存答案
      this.list[this.currIndex].answer = res.data.data
    },
    //下一题
    async next () {
      this.currIndex++
      this.skip(this.currIndex)
      //   this.step = 0
      //   this.ans1 = '' //单选题答案
      //   this.ans2 = [] //多选题答案
      //   this.ans3 = '' //简答题答案
      //   this.currIndex++
      //   //   调用api获取题目
      //   this.$toast.loading({
      //     duration: 0
      //   })
      //   const res = await getQuestionsInfo(this.list[this.currIndex].id)
      //   //   this.list[this.currIndex].detail = res.data.data
      //   this.$toast.clear()
      //   this.$set(this.list[this.currIndex], 'detail', res.data.data)
      //   window.console.log(this.list)
    },
    //跳转至哪一题
    async skip (index) {
      this.isShow = false

      this.ans1 = '' //单选题答案
      this.ans2 = [] //多选题答案
      this.ans3 = '' //简答题答案
      this.currIndex = index
      //没有题目
      if (!this.list[index].detail) {
        this.step = 0
        //   调用api获取题目
        this.$toast.loading({
          duration: 0
        })
        const res = await getQuestionsInfo(this.list[this.currIndex].id)
        //   this.list[this.currIndex].detail = res.data.data
        this.$toast.clear()
        this.$set(this.list[this.currIndex], 'detail', res.data.data)
      } else {
        //有题目没有答案
        if (!this.list[index].answer) {
          this.step = 0
        } else {
          //有题目有答案
          //是最后一题 step=3  不是最后一题 step=2
          if (this.list.length === index + 1) {
            this.step = 3
          } else {
            this.step = 2
          }
        }
      }
    },
    //答题卡
    clickRightEvent () {
      this.isShow = true
    }
  }
}
</script>
<style lang="less" scoped>
.questionInfo {
  padding-bottom: 60px;
  .content {
    padding: @p15;
    .title {
      font-size: 16px;
      font-family: PingFangSC, PingFangSC-Regular;
      font-weight: 400;
      text-align: justify;
      color: #181a39;
      line-height: 22px;
    }
    .tag {
      padding: 15px 0;
      .tag-item {
        padding: 5px 7px;
        border: 1px solid #dfddde;
        margin-right: 10px;
      }
    }
    .select {
      margin-top: 20px;
      padding: 0 10px;
      .select-item {
        border: 1px solid #dfddde;
        padding: 6px;
        font-size: 16px;
        font-family: PingFangSC, PingFangSC-Regular;
        font-weight: 400;
        text-align: justify;
        color: #181a39;
        line-height: 22px;
        margin-bottom: 15px;
      }
      .active {
        border: 1px solid #000;
      }
      .error {
        background-color: #ffefea;
      }
      .success {
        background-color: #ddfad9;
      }
    }
    .field {
      background-color: #ccc;
    }
  }
  .answer {
    padding: @p15;
    .a1 {
      font-size: 18px;
      font-family: PingFangSC, PingFangSC-Medium;
      font-weight: 500;
      text-align: left;
      color: #222222;
      line-height: 25px;
      letter-spacing: 0px;
    }
    .a2 {
      font-size: 16px;
      font-family: PingFangSC, PingFangSC-Regular;
      font-weight: 400;
      text-align: justify;
      color: #1dc779;
      line-height: 22px;
      margin: 15px 0;
    }
    .a3 {
      font-size: 12px;
      font-family: PingFangSC, PingFangSC-Regular;
      font-weight: 400;
      text-align: left;
      color: #545671;
      line-height: 16px;
      letter-spacing: 0px;
      display: flex;
      align-items: center;
      justify-content: space-between;
      padding: 10px;
      background-color: #f7f4f5;
      border-top: 1px solid #ccc;
      border-bottom: 1px solid #ccc;
    }
    .a4 {
      margin-top: 15px;
      font-size: 16px;
      font-family: PingFangSC, PingFangSC-Regular;
      font-weight: 400;
      text-align: justify;
      color: #181a39;
      line-height: 22px;
    }
  }
  .footer {
    position: fixed;
    left: 0;
    bottom: 0;
    height: 60px;
    padding: 15px;
    width: 100%;
    display: flex;
    align-items: center;
    text-align: center;
    font-size: 12px;
    color: #ccc;
    background-color: #fff;
    .f1 {
      flex: 1;
      .iconfont {
        font-size: 28px;
      }
    }
    .f2 {
      flex: 2;
      color: #000;
      font-size: 18px;
    }
    .f3 {
      flex: 2;
    }
  }
  .card {
    padding: @p15;
    display: flex;
    flex-wrap: wrap;
    justify-content: space-between;
    .card-item {
      width: 35px;
      height: 35px;
      border-radius: 50%;
      border: 1px solid #dcdce0;
      font-size: 12px;
      color: rgb(77, 75, 75);
      text-align: center;
      line-height: 35px;
      margin: 7px 5px;
    }
    .noUse {
      width: 35px;
      height: 0;
      margin: 7px 5px;
    }
    .card-error {
      background-color: #ffefea;
    }
    .card-success {
      background-color: #ddfad9;
    }
  }
}
</style>
