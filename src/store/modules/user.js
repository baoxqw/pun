import {login, getInfo, logout, ssoLogin} from '@eladmin/api/login'
import {
    getToken,
    setToken,
    removeToken,
    getCurrentRole,
    setCurrentRole,
    removeCurrentRole,
    getTheme, setTheme
} from '@eladmin/utils/auth'
import Cookies from 'js-cookie'

const user = {
    state: {
        token: getToken(),
        user: {},
        authorizes: [],
        currentRole: getCurrentRole(),
        // 第一次加载菜单时用到
        loadMenus: false,
        menus: [],
        smartbi: {},
        theme: getTheme()
    },

    mutations: {
        SET_TOKEN: (state, token) => {
            state.token = token
        },
        SET_USER: (state, user) => {
            state.user = user
        },
        SET_CURRENT_ROLE: (state, role) => {
            state.currentRole = role
        },
        SET_AUTHORIZES: (state, authorizes) => {
            state.authorizes = authorizes
        },
        SET_LOAD_MENUS: (state, loadMenus) => {
            state.loadMenus = loadMenus
        },
        SET_SMARTBI: (state, smartbi) => {
            state.smartbi = smartbi
        },
        SET_THEME: (state, theme) => {
            state.theme = theme
        }
    },

    actions: {
        // 登录
        Login({commit}, userInfo) {
            console.log('----store.Login start111>>', userInfo)
            const rememberMe = userInfo.rememberMe
            return new Promise((resolve, reject) => {
                console.log('----store.login start Promise>>')
                login(userInfo.username, userInfo.password, userInfo.code, userInfo.uuid,userInfo.loginType).then(res => {
                    // console.log('-----login--->', res)
                    Cookies.set('defaultPass', res.pwdState)
                    setToken(res.token, rememberMe)
                    commit('SET_TOKEN', res.token)
                    setUserInfo(res.user, commit)
                    // 第一次加载菜单时用到， 具体见 src 目录下的 permission.js
                    commit('SET_LOAD_MENUS', true)
                    resolve()
                }).catch(error => {
                    console.log('-----login exception>', error)
                    reject(error)
                })
            })
        },
        // sso登录
        SsoLogin({commit}, token) {
            return new Promise((resolve, reject) => {
                ssoLogin(token).then(res => {
                    Cookies.set('defaultPass', res.pwdState)
                    setToken(res.token, false)
                    commit('SET_TOKEN', res.token)
                    setUserInfo(res.user, commit)
                    // 第一次加载菜单时用到， 具体见 src 目录下的 permission.js
                    commit('SET_LOAD_MENUS', true)
                    resolve()
                }).catch(error => {
                    reject(error)
                })
            })
        },
        // 获取用户信息
        GetInfo({commit}) {
            return new Promise((resolve, reject) => {
                getInfo().then(res => {
                    setUserInfo(res, commit)
                    resolve(res)
                }).catch(error => {
                    reject(error)
                })
            })
        },
        // 登出
        LogOut({commit}) {
            return new Promise((resolve, reject) => {
                logout().then(() => {
                    logOut(commit)
                    resolve()
                }).catch(error => {
                    logOut(commit)
                    reject(error)
                })
            })
        },
        updateLoadMenus({commit}) {
            return new Promise(() => {
                commit('SET_LOAD_MENUS', false)
            })
        },
        reLoadMenus({commit}) {
            commit('SET_LOAD_MENUS', true)
        },
        setSmartbi({commit}, smartbi) {
            commit('SET_SMARTBI', smartbi)
        },
        setCurrentRole({commit}, role) {
            commit('SET_CURRENT_ROLE', role)
            setCurrentRole(role)
        },
        setTheme({commit}, theme) {
            console.log('====setTheme>', theme)
            commit('SET_THEME', theme)
            setTheme(theme)
        }
    }
}

export const logOut = (commit) => {
    commit('SET_TOKEN', '')
    commit('SET_AUTHORIZES', [])
    removeToken()
    removeCurrentRole()
}

export const setUserInfo = (res, commit) => {
    // 如果没有任何权限，则赋予一个默认的权限，避免请求死循环
    if (res.authorizes.length === 0) {
        commit('SET_AUTHORIZES', ['ROLE_SYSTEM_DEFAULT'])
    } else {
        commit('SET_AUTHORIZES', res.authorizes)
    }
    commit('SET_USER', res)
}

export default user
