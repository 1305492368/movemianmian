<template>
  <div class="login">
    <!-- 导航栏
         van-nav-bar
            left-text:左边文本
            right-text:右边文本
            title:中间文本
            left-arrow:左边
            slot="left/title/right"
       -->
    <!-- <van-nav-bar @click-left="$router.push('/home/find')">
      <template #left>
        <i class="iconfont f44">&#xe637;</i>
      </template>
    </van-nav-bar> -->
    <hmNavBar path="/home/find"></hmNavBar>
    <div class="content">
      <h3 class="title">您好,请登陆</h3>
      <van-form ref="form">
        <van-field
          placeholder="请输入手机号"
          v-model="form.mobile"
          :rules="rules.mobile"
          name="mobile"
        >
          <template #left-icon>
            <i class="iconfont pr20">&#xe60b;</i>
          </template>
        </van-field>
        <van-field
          placeholder="请输入验证码"
          v-model="form.code"
          :rules="rules.code"
        >
          <template #left-icon>
            <i class="iconfont pr20">&#xe60c;</i>
          </template>
          <template #button>
            <!-- 倒计时
            1:定义一个倒计时时间
            2:在点击获取验证码验证通过后进行倒计时
              在进行倒计时前就 倒计时--
               如果倒计时<=0
                  倒计时时间还原
                  清理倒计时事件
             3:html处理
                如果倒计时时间!=总时间,显示倒计时时间
                 
            
            
            
             -->
            <div class="code" @click="getCode" v-if="totalTime === 6">
              获取验证码
            </div>
            <div class="code" v-else>{{ totalTime }}S后重试</div>
          </template>
        </van-field>
      </van-form>
      <div class="tip">
        登录即同意<span class="tip-color">《用户使用协议》</span>和<span
          class="tip-color"
          >《隐私协议》</span
        >
      </div>
      <van-button color="#E40137" block round @click="submit">确定</van-button>
    </div>
  </div>
</template>
<script>
// 导入获取验证码api
import { auCode, auLogin } from '@/api/login.js'
import { saveLocal, getLocal } from '@/utils/local.js'
export default {
  data () {
    return {
      totalTime: 6,
      form: {
        //	是string手机号
        mobile: '',
        //	是string验证码
        code: ''
      },
      rules: {
        mobile: [
          { required: true, message: '请输入手机号', trigger: 'onChange' },
          {
            validator: value => {
              const _reg = /^(0|86|17951)?(13[0-9]|15[012356789]|166|17[3678]|18[0-9]|14[57])[0-9]{8}$/
              return _reg.test(value)
            },
            message: '请正确输入手机号',
            trigger: 'onChange'
          }
        ],
        code: [{ required: true, message: '请输入验证码', trigger: 'onChange' }]
      }
    }
  },
  created () {
    window.console.log('当前路由信息:', this.$route)
    // 如果有token就直接进入my页面
    if (getLocal()) {
      this.$router.push('/home/my')
    }
  },
  methods: {
    //   获取验证码
    /*
    1:删除.then 在.then前面方法加个await
    2:定义一个变量=await的方法返回值(没有返回值就不用理了)
    3:.await最近的父级方法加一个async
   try{有可能出错代码}catch(error){出错后的处理}  
    */

    async getCode () {
      try {
        await this.$refs.form.validate('mobile')
        // .then(() => {
        this.totalTime--
        let _time = setInterval(() => {
          this.totalTime--
          if (this.totalTime <= 0) {
            this.totalTime = 6
            clearInterval(_time)
          }
        }, 1000)
        const res = await auCode({
          mobile: this.form.mobile
        })
        // .then(res => {
        this.$toast.success(res.data.data)
        window.console.log(res)
        // })
        // this.$toast.success('验证成功')
        // })
      } catch {
        // .catch(() => {
        this.$toast.fail('验证失败')
        // })
      }
    },
    // 确定按钮点击
    submit () {
      this.$refs.form
        .validate()
        .then(() => {
          auLogin(this.form).then(res => {
            this.$toast.success('登陆成功')
            window.console.log('登陆信息:', res)
            saveLocal(res.data.data.jwt)
            this.$store.commit('setUserInfo', res.data.data.user)
            // 修改登陆状态
            this.$store.commit('setLoginStatus', true)
            const _redirect = this.$route.query.redirect
            if (_redirect) {
              this.$router.push(_redirect)
            } else {
              this.$router.push('/home')
            }
          })
        })
        .catch(() => {
          this.$toast.fail('验证失败')
        })
    }
  }
}
</script>

<style lang="less" scoped>
// scoped  加了scoped:只管当前组件和子组件的最外层  不加就是全局
.login {
  .content {
    padding: 0 @p15;
    .title {
      font-size: 18px;
      font-family: PingFangSC, PingFangSC-Semibold;
      font-weight: 600;
      text-align: left;
      color: #222222;
      line-height: 25px;
      letter-spacing: 0px;
      margin-top: 50px;
      margin-bottom: 65px;
    }
    .pr20 {
      padding-right: 20px;
    }
    .code {
      font-size: 16px;
      font-family: PingFangSC, PingFangSC-Regular;
      font-weight: 400;
      text-align: left;
      color: #00b8d4;
      line-height: 23px;
      letter-spacing: 0px;
    }
    .tip {
      margin-top: 27px;
      margin-bottom: 44px;
      font-size: 12px;
      font-family: PingFangSC, PingFangSC-Regular;
      font-weight: 400;
      text-align: left;
      color: #181a39;
      line-height: 16px;
      letter-spacing: 0px;
    }
    .tip-color {
      color: #00b8d4;
    }
  }
}
</style>
