<template>
  <div class="editInfo">
    <!-- 
      props与emit
      定义:在子组件标签上绑定一个方法  @子组件方法名="父组件方法"
      触发:在子组件内:this.$emit("子组件方法",参数)
       -->
    <hmNavBar
      :title="titleObj[type]"
      rightText="保存"
      :path="path"
      @clickRight="save"
    ></hmNavBar>
    <div class="content">
      <!-- 输入框
          van-field
             label:左边标题
             v-model:双向绑定
             slot="left-icon(左边图标)/button(右边按钮)" 
         -->
      <van-field
        v-if="type !== 'avatar'"
        class="field"
        v-model="fieldValue"
      ></van-field>
      <!-- van-uploader
                 v-model=[{url:图片地址}]
                 max-count:文件个数
                 before-read:上传前function(file){
                               file.type类型
                               file.size:字节
                               return boolean
                                     true:正常上传
                                     false中止上传
                               }
                 after-read:读取文件后
                            function(file){
                              file.content:base64文件
                              file.file:文件对象
                            }
      
       -->
      <van-uploader
        v-else
        v-model="fileList"
        :max-count="1"
        :before-read="beforeRead"
        :after-read="afterRead"
      ></van-uploader>
    </div>
  </div>
</template>
<script>
// 导入mapState
import { mapState } from 'vuex'
// 导入编辑api
import { auEdit, upload } from '@/api/my.js'
export default {
  data () {
    return {
      // avatarId: '',
      fieldValue: '',
      type: this.$route.query.type,
      titleObj: {
        nickname: '修改昵称',
        intro: '修改用户简介',
        position: '修改岗位',
        avatar: '修改头像'
      },
      path: '/home/myInfo', //回退地址
      fileList: [] //上传文件
    }
  },
  computed: {
    ...mapState(['userInfo'])
  },
  created () {
    this.fieldValue = this.userInfo[this.type]
    // 如果 type是avatar
    //     如果userInfo.avatar有值   fileList=[{url:process.env.VUE_APP_URL+avatar地址}]
    //     如果userInfo.avatar无值   fileList=[]
    if (this.type === 'avatar') {
      if (this.userInfo.avatar) {
        this.fileList = [
          { url: process.env.VUE_APP_URL + this.userInfo.avatar }
        ]
      }
    }

    if (this.type === 'position') {
      this.path = '/home/my'
    }
  },
  methods: {
    async save () {
      // 调用编辑api
      // if (this.type === 'avatar') {
      //   await auEdit({ [this.type]: this.avatarId })
      // } else {
      await auEdit({ [this.type]: this.fieldValue })
      // }

      //提示一下
      this.$toast.success('编辑成功')
      //   刷新数据
      //   调用vuex的actions方法刷新用户信息
      this.$store.dispatch('refreshUserInfo')
      // 跳转至/home/myInfo
      this.$router.push(this.path)
    },
    // 文件读取前
    beforeRead (file) {
      window.console.log(file)
      const isPng = file.type === 'image/png'
      const limit2M = file.size / 1024 / 1024 < 2
      if (!isPng) {
        this.$toast.fail('请上传png格式图片')
      }
      if (!limit2M) {
        this.$toast.fail('请上传2M内的文件')
      }
      return isPng && limit2M
    },
    //文件读取后
    async afterRead (file) {
      window.console.log(file)
      //执行上传  1:定义api   2:导入api   3:调用api
      /*
      toast:消息提示
      this.$toast.loading({
        duration:0,
        message:"上传中"
      })
         duration:时长  0表示 不消失
      this.$toast.clear()
      */

      let _formData = new FormData()
      _formData.append('files', file.file)
      this.$toast.loading({
        duration: 0
      })
      const res = await upload(_formData)
      setTimeout(() => {
        this.$toast.clear()
      }, 2000)
      window.console.log('上传成功:', res)
      // this.avatarId = res.data.data[0].id
      this.fieldValue = res.data.data[0].id
    }
  }
}
</script>
<style lang="less" scoped>
.editInfo {
  .content {
    padding: 20px @p15;
    text-align: center;
    .field {
      background-color: #f7f4f5;
    }
  }
}
</style>
