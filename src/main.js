import Vue from 'vue'
import App from './App.vue'
import router from './router'
import store from './store'
import Vant from 'vant'
import 'vant/lib/index.css'
// 导入flexible
import 'amfe-flexible'
// 导入公共css
import 'normalize.css'
// 导入iconfont
import '@/style/font/iconfont.css'
// 导入初始化样式文件
import '@/style/base.css'
// 导入公共的导航栏
import hmNavBar from '@/components/hmNavBar'
// 导入moment
import moment from 'moment'
Vue.use(Vant)
Vue.config.productionTip = false

/*
全局注册
Vue.component(名字,导入的组件名)
*/
Vue.component(hmNavBar.name, hmNavBar)
/*
全局过滤器
Vue.filter("方法名",function(参数){
  return 加工后的参数
})
{{参数  | 方法名}}
*/

Vue.filter('formatTime', function (val) {
  // 需求:转换成与当前时间比较的小时差(24小时内) 超过24小时,使用正常时间
  //  moment时间a.diff(moment时间b,'hours')     moment时间a-moment时间b的小时差
  const _diff = moment().diff(moment(val), 'h')
  if (_diff < 1) {
    return '刚刚'
  } else if (_diff >= 1 && _diff < 240) {
    return _diff + '小时前'
  } else {
    return moment(val).format('YYYY/MM/DD HH:mm:ss')
  }
})
new Vue({
  router,
  store,
  render: h => h(App)
}).$mount('#app')
