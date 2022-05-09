import router from './routers'
import store from '../store'
import Config from '@public/config/settings'
import NProgress from 'nprogress' // progress bar
import 'nprogress/nprogress.css'// progress bar style
import {getToken, getCurrentRole, removeToken,isSSORequest} from '@eladmin/utils/auth' // getToken from cookie
import { buildMenus } from '@eladmin/api/system/menu'
import { filterAsyncRouter } from './routers'

NProgress.configure({ showSpinner: false })// NProgress Configuration

const whiteList = ['/login', '/sso/login']// no redirect whitelist

router.beforeEach((to, from, next) => {
  // console.debug('==15===router foreache>',from, to,next)
  if (to.meta.title) {
    document.title = to.meta.title + ' - ' + Config.title
  }
  NProgress.start()
  console.log("to.path==> " + to.path)
  if(isSSORequest(to)) { //单点登录
    console.log("单点登录")
    removeToken()
    next(`/login?token=${to.query.token}&type=sso`) // 跳转的登录页面
    NProgress.done()
    return;
  }
  console.log("正常登录")
  if (getToken()) {
    // console.debug('==21===router foreache>', to)
    // 已登录且要跳转的页面是登录页
    if (to.path === '/login') {
      next({ path: '/' })
      NProgress.done()
    } else {
      // console.debug('==27===router foreache>', to, store.getters.loadMenus, store.getters.authorizes)
      if (store.getters.authorizes.length === 0) { // 判断当前用户是否已拉取完user_info信息
        store.dispatch('GetInfo').then(() => { // 拉取user_info
          // 动态路由，拉取菜单
          loadMenus(next, to)
        }).catch((err) => {
          console.log(err)
          store.dispatch('LogOut').then(() => {
            location.reload() // 为了重新实例化vue-router对象 避免bug
          })
        })
        // 登录时未拉取 菜单，在此处拉取
      } else if (store.getters.loadMenus) {
        // 修改成false，防止死循环
        store.dispatch('updateLoadMenus').then(() => {
        })
        loadMenus(next, to)
      } else {
        next()
      }
    }
  } else {
     console.debug('==49===router foreache>', to)
    /* has no token*/
    if (whiteList.indexOf(to.path) !== -1 || to.path.startsWith('/assets')) { // 在免登录白名单，直接进入
      next()
    } else {
      //next(`/login?redirect=${to.fullPath || to.path}`) // 否则全部重定向到登录页
      next(`/login`) // 否则全部重定向到登录页
      NProgress.done()
    }
  }
})

export const loadMenus = (next, to) => {
  let roleId = ''
  console.log('-----loadMenus getCurrentRole()>>>', getCurrentRole())
  if (getCurrentRole() && getCurrentRole().id) {
    roleId = getCurrentRole().id
  }
    buildMenus(roleId).then(res => {
      console.log('-----loadMenus>>>', res)
      const asyncRouter = filterAsyncRouter(res.menu)
      store.commit('SET_AUTHORIZES', res.authorities)
      asyncRouter.push({ path: '*', redirect: '/404', hidden: true })
      store.dispatch('GenerateRoutes', asyncRouter).then(() => { // 存储路由
        router.addRoutes(asyncRouter) // 动态添加可访问路由表
        if (to.path === '/404' && to.redirectedFrom === '/refresh') {
          next({ path: '/' })
        } else {
          next({ ...to, replace: true })
        }
      })
    })
  /*} else {
    next({ path: '/login' })
  }*/
}

router.afterEach(() => {
  NProgress.done() // finish progress bar
})
