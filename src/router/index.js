import Vue from 'vue'
import VueRouter from 'vue-router'
import login from '@/views/login/login.vue'
import home from '@/views/home/home.vue'
import my from '@/views/home/my/my.vue'
import question from '@/views/home/question/question.vue'
import questionInfo from '@/views/home/question/questionInfo.vue'
import myInfo from '@/views/home/my/myInfo.vue'
import editInfo from '@/views/home/my/editInfo.vue'
import find from '@/views/home/find/find.vue'
import shareList from '@/views/home/find/shareList.vue'
import shareInfo from '@/views/home/find/shareInfo.vue'
import store from '@/store' //store===this.$store
import { getLocal } from '@/utils/local.js'
// 导入获取用户信息api
import { auInfo } from '@/api/my.js'
Vue.use(VueRouter)

const routes = [
  {
    path: '/',
    redirect: '/login'
  },
  {
    path: '/login',
    component: login
  },
  {
    path: '/home',
    component: home,
    redirect: '/home/my',
    children: [
      {
        path: '/home/my',
        component: my,
        meta: {
          needLogin: true,
          needTab: true
        }
      },
      {
        path: '/home/myInfo',
        component: myInfo,
        meta: {
          needLogin: true
        }
      },
      {
        path: '/home/editInfo',
        component: editInfo,
        meta: {
          needLogin: true, //是否需要登陆
          needTab: false //是否需要下面的标签栏
        }
      },
      {
        path: '/home/find',
        component: find,
        meta: {
          needTab: true //是否需要下面的标签栏
        }
      },
      {
        path: '/home/shareList',
        component: shareList,
        meta: {}
      },
      {
        path: '/home/shareInfo/:id',
        component: shareInfo,
        meta: {}
      },
      {
        path: '/home/question',
        component: question,
        meta: {
          needTab: true, //是否需要下面的标签栏
          needLogin: true //是否需要登陆
        }
      },
      {
        path: '/home/questionInfo',
        component: questionInfo,
        meta: {
          needLogin: true //是否需要登陆
        }
      }
    ]
  }
]

const router = new VueRouter({
  routes
})

router.beforeEach((to, from, next) => {
  // to:去的路由
  // from :来的路由
  // next:是否通过  next()正常通过   next(path)
  window.console.log(to)
  //  如果不需要登陆
  //      直接next()
  //  需要登陆
  //       判断是否已登陆(isLogin)
  //           true(已登陆) next()
  //           false(没登陆)
  //                有token:获取用户信息,用户信息获取完成后再next()
  //                没token:去到登陆页
  if (!to.meta.needLogin) {
    next()
    // 如果没有登陆 且 有token 可以调用一下获取用户信息
    if (!store.state.isLogin && getLocal()) {
      auInfo(true).then(res => {
        window.console.log('用户信息', res)
        store.commit('setUserInfo', res.data.data)
        store.commit('setLoginStatus', true)
      })
    }
  } else {
    if (store.state.isLogin) {
      next()
    } else {
      if (getLocal()) {
        // 获取用户信息,存储用户信息,修改用户登陆状态  next()
        auInfo().then(res => {
          window.console.log('用户信息', res)
          store.commit('setUserInfo', res.data.data)
          store.commit('setLoginStatus', true)
          next()
        })
      } else {
        // 路由传参
        /*
        传:path?参数=值
        收:this.$route.query.参数名 
       发现页面需要登陆,登陆完成后,回到发现页面
       1:通过路由传参告诉登陆页,你登陆完成后要回到哪里
       2:在登陆完成后
          如果路由内有redirect  直接跳转到redirect的值
          如果没有redirect  直接跳转到my
        */
        next('/login?redirect=' + to.fullPath)
      }
    }
  }
})
router.afterEach((to, from) => {
  // 滚动条滚动到顶部
  //  document.documentElement.scrollTop|| window.pageYOffset || document.body.scrollTop
  window.scrollTo(0, 0)
})
const routerPath = VueRouter.prototype.push
VueRouter.prototype.push = function push (location) {
  return routerPath.call(this, location).catch(e => e)
}
export default router
