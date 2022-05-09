//import variables from '@/assets/styles/element-variables.scss'
import defaultSettings from '@public/config/settings'

let settings = defaultSettings

const {tagsView, hamburger, fixedHeader, sidebarLogo, uniqueOpened, showFooter, footerTxt, caseNumber, logo, showBreadcrumb, showThemeSelect} = settings

const state = {
    //theme: theme,
    showSettings: false,
    tagsView: tagsView,
    fixedHeader: fixedHeader,
    sidebarLogo: sidebarLogo,
    uniqueOpened: uniqueOpened,
    showFooter: showFooter,
    footerTxt: footerTxt,
    caseNumber: caseNumber,
    logo: logo,
    hamburger: hamburger,
    showBreadcrumb: showBreadcrumb,
    showThemeSelect: showThemeSelect
}

const mutations = {
    CHANGE_SETTING: (state, {key, value}) => {
        if (state.hasOwnProperty(key)) {
            state[key] = value
        }
    }
}

const actions = {
    changeSetting({commit}, data) {
        commit('CHANGE_SETTING', data)
    }
}

export default {
    namespaced: true,
    state,
    mutations,
    actions
}

