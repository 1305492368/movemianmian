// 项目根目录中创建了`vue.config.js`
// 导包
const autoprefixer = require('autoprefixer')
// 导包
const pxtorem = require('postcss-pxtorem')
const path = require('path')

// 暴露出去
module.exports = {
  // css属性如何处理
  css: {
    // 处理的选项
    loaderOptions: {
      postcss: {
        plugins: [
          autoprefixer(),
          // 使用 pxtorem库进行转换
          pxtorem({
            //  基于设计稿宽度,设计宽度是375,下面就写37.5
            //  750  rem    500  rem   500/75 rem
            rootValue: 37.5,
            propList: ['*']
          })
        ]
      }
    }
  },

  pluginOptions: {
    'style-resources-loader': {
      preProcessor: 'less',
      //   patterns这个数组就是放全局less
      patterns: [path.resolve(__dirname, './src/style/main.less')]
    }
  }
}
