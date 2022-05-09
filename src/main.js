import Vue from 'vue'

import Cookies from 'js-cookie'

import 'normalize.css/normalize.css'

import Element from 'element-ui'
import 'element-ui/lib/theme-chalk/index.css'
//
import mavonEditor from 'mavon-editor'
import 'mavon-editor/dist/css/index.css'

// 数据字典
import dict from '@eladmin/components/Dict'

// 权限指令
import permission from '@eladmin/components/Permission'
import VueQuillEditor from 'vue-quill-editor'
import 'quill/dist/quill.core.css'

import 'quill/dist/quill.snow.css'

import 'quill/dist/quill.bubble.css'

// iconfont css
import '@eladmin/assets/iconfont/iconfont.css'
// 代码高亮
import VueHighlightJS from 'vue-highlightjs'
import 'highlight.js/styles/atom-one-dark.css'

import App from './App'
import store from './store'
import router from './router/routers'

//svg icons
import '@eladmin/assets/icons' // icon
import './router/index' // permission control

import accounting from 'accounting'
import TrendChart from "vue-trend-chart";

Vue.prototype.$accounting = accounting

import { dateColumnFormat, timeColumnFormat, dateFormat, numberColumnFormat ,intColumnFormat} from '@eladmin/utils/data_format'

Vue.mixin({
  methods: {
    dateColumnFormat,
    timeColumnFormat,
    numberColumnFormat,
    intColumnFormat,
    dateFormat
  }
})

Vue.use(VueHighlightJS)
Vue.use(mavonEditor)
Vue.use(permission)
Vue.use(dict)
Vue.use(VueQuillEditor, /* { default global options } */)
Vue.use(Element, {
  size: Cookies.get('size') || 'mini' // set element-ui default size
})
Vue.use(TrendChart);
Vue.config.productionTip = false

new Vue({
  el: '#app',
  router,
  store,
  render: h => h(App)
})
