<template>
  <div class="myInfo">
    <hmNavBar title="我的资料" path="/home/my"></hmNavBar>
    <div class="content">
      <mycell
        title="头像"
        :value="userInfo.avatar"
        type="img"
        class="round"
        @click.native="$router.push('/home/editInfo?type=avatar')"
      ></mycell>
      <div class="other-info">
        <!-- 路由传参
        传:1:this.$router.push("path?参数名=参数值")
           2:this.$router.push({
             path:"路径",
             query:{
               参数名:参数值
             }
           })
        收:this.$route.query.参数名        
         -->
        <mycell
          title="昵称"
          :value="userInfo.nickname"
          @click.native="$router.push('/home/editInfo?type=nickname')"
        ></mycell>
        <!-- 使用原生的事件方法  修饰符 .native 
        使用element-ui   el-input   @keyup.enter.native
        -->
        <mycell
          title="性别"
          :value="genderObj[userInfo.gender]"
          @click.native="isShowGender = true"
        ></mycell>
        <mycell
          title="地区"
          :value="area.city_list[userInfo.area]"
          @click.native="isShowCity = true"
        ></mycell>
        <mycell
          title="个人简介"
          :value="userInfo.intro"
          @click.native="$router.push('/home/editInfo?type=intro')"
        ></mycell>
      </div>
      <van-button color="#fff" block @click="exit"
        ><span class="red">退出按钮</span></van-button
      >
    </div>
    <!-- 性别 选择弹窗 -->
    <van-popup v-model="isShowGender" position="bottom">
      <!-- 选择框
          van-picker
              title
              show-toolbar
              default-index
              columns
              @confirm  function(value值,index索引){}
              @cancel 常用于关闭弹窗


              genderObj: {     ['保密','男','女']
                0: '保密',
                1: '男',
                2: '女'
              }
              Object.values(对象名)
              Object.keys(对象名)
     -->
      <van-picker
        title="修改性别"
        show-toolbar
        :columns="Object.values(genderObj)"
        :default-index="userInfo.gender"
        @confirm="genderConfirm"
        @cancel="isShowGender = false"
      ></van-picker>
    </van-popup>
    <!-- 城市选择 -->
    <van-popup v-model="isShowCity" position="bottom">
      <van-area
        title="城市选择"
        :area-list="area"
        columns-num="2"
        :value="userInfo.area"
        @cancel="isShowCity = false"
        @confirm="cityConfirm"
      ></van-area>
    </van-popup>
  </div>
</template>
<script>
// mapState 1:导入  import {mapState} from 'vuex'  2: computed:{...mapState(['userInfo'])}
import mycell from './mycell'
import { mapState } from 'vuex'
import area from '@/assets/js/area.js'
import { removeLocal } from '@/utils/local.js'
// 导入编辑api方法
import { auEdit } from '@/api/my.js'
export default {
  components: {
    mycell
  },
  computed: { ...mapState(['userInfo']) },
  data () {
    return {
      area: area,
      isShowGender: false,
      genderObj: {
        0: '保密',
        1: '男',
        2: '女'
      },
      isShowCity: false //城市选择弹框
    }
  },
  methods: {
    exit () {
      this.$dialog
        .confirm({
          title: '提示',
          message: '您确定退出吗?'
        })
        .then(() => {
          //清除token
          removeLocal()
          //修改vuex登陆状态
          this.$store.commit('setLoginStatus', false)
          //跳转到登陆页
          this.$router.push('/login')
        })
        .catch(() => {})
    },
    // 性别 确定
    async genderConfirm (value, index) {
      this.editInfo('gender', index)
      // 编辑性别
      // await auEdit({ gender: index })
      // 编辑成功后,关闭弹窗
      // this.isShowGender = false
      // 提示一下
      // this.$toast.success('修改成功')
      // 刷新数据
      // vuex处理刷新用户信息:1相当于对刷新用户信息方法做了一个封装
      // this.$store.dispatch('refreshUserInfo')
      // const res = await auInfo()
      // // 更新userInfo
      // this.$store.commit('setUserInfo', res.data.data)
      // window.console.log(res)
    },
    // 城市确定
    async cityConfirm (value, index) {
      window.console.log(value, index)
      // 编辑城市
      // await auEdit({ area: value[1].code })
      // this.isShowCity = false
      // this.$toast.success('修改成功')
      // this.$store.dispatch('refreshUserInfo')
      this.editInfo('area', value[1].code)
    },
    async editInfo (key, value) {
      //  对像的key如果希望是变量  {[变量]:值}
      await auEdit({ [key]: value })
      this.isShowGender = false
      this.isShowCity = false
      this.$toast.success('修改成功')
      this.$store.dispatch('refreshUserInfo')
    }
  }
}
</script>
<style lang="less" scoped>
.myInfo {
  height: 100%;
  background-color: #f7f4f5;
  .content {
    padding: 20px @p15;

    .round {
      border-radius: 8px;
    }
    .other-info {
      margin-top: 10px;
      margin-bottom: 10px;
    }
    .red {
      color: red;
    }
  }
}
</style>
