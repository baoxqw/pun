import Vue from 'vue'
import Router from 'vue-router'
import loadView from "@/modules"

Vue.use(Router)
import Layout from "@portal/layout/index";
import Submenu from "@portal/layout/submenu";

export const constantRouterMap = [
    {
        path: '/login',
        meta: {title: '登录', noCache: true},
        //component: (resolve) => require([`@portal/layout/login`], resolve),
        component: (resolve) => require([`../views/indicators/login/login`], resolve),
        hidden: true
    },
    {
        path: '/sso/login',
        meta: {title: '统一登录', noCache: true},
        component: (resolve) => require(['@eladmin/views/ssologin'], resolve),
        hidden: true
    },
    {
        path: '/404',
        component: (resolve) => require(['@eladmin/views/features/404'], resolve),
        hidden: true
    },
    {
        path: '/401',
        component: (resolve) => require(['@eladmin/views/features/401'], resolve),
        hidden: true
    },
    {
        path: '/redirect',
        component: Layout,
        hidden: true,
        children: [
            {
                path: '/redirect/:path*',
                component: (resolve) => require(['@eladmin/views/features/redirect'], resolve)
            }
        ]
    },
    {
        path: '/',
        component: Layout,
        redirect: '/dashboard',
        children: [
            {
                path: 'dashboard',
                //component: (resolve) => require([`@portal/layout/home`], resolve),
                component: (resolve) => require([`../views/indicators/layout/home`], resolve),
                name: 'Dashboard',
                meta: {title: '首页', icon: 'index', affix: true, noCache: true}
            }
        ]
    },
    {
        path: '/user',
        component: Layout,
        hidden: true,
        redirect: 'noredirect',
        children: [
            {
                path: 'center',
                component: (resolve) => require(['@eladmin/views/system/user/center'], resolve),
                name: '个人中心',
                meta: {title: '个人中心'}
            }
        ]
    },
    {
        path: '/indicator',
        component: Layout,
        hidden: true,
        redirect: 'noredirect',
        children: [
            {
                path: 'resultSubscribe',
                component: (resolve) => require(['../views/indicators/resultSubscribe/subscribelist'], resolve),
                name: '结果订阅信息',
                meta: {title: '结果订阅信息'}
            }
        ]
    }
]

export const filterAsyncRouter = (routers) => { // 遍历后台传来的路由字符串，转换为组件对象
    return routers.filter(router => {
        if (router.component) {
            if (router.component === 'Layout') { // Layout组件特殊处理
                router.component = Layout
            } else if (router.component === 'Submenu' || router.component === 'submenu') {
                router.component = Submenu
            } else {
                // console.log('================filterAsyncRouter>>>', router)
                if (router.path.indexOf('?') > 0) { // add by Suny 20200515 处理参数
                    router.meta.cparam = router.path.substring(router.path.indexOf('?'))
                    router.path = router.path.substring(0, router.path.indexOf('?'))
                }
                const component = router.component
                router.component = loadView(component)
                //console.log('-->>>>>>>>#====',router.component)
            }
        }
        if (router.children && router.children.length) {
            router.children = filterAsyncRouter(router.children)
        }
        return true
    })
}

export default new Router({
    mode: 'history',
    scrollBehavior: () => ({y: 0}),
    routes: constantRouterMap
})
