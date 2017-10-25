// The Vue build version to load with the `import` command
// (runtime-only or standalone) has been set in webpack.base.conf with an alias.
import Vue from 'vue'
import Vuex from 'vuex'
import App from './App'
import router from './router'

// Moment
import moment from 'moment-timezone'
moment.tz.guess()
Object.defineProperty(Vue.prototype, '$moment', { get () {return this.$root.moment}})

// Firebase
import VueFire from 'vuefire'

// Vue Material
import VueMaterial from 'vue-material'
import 'vue-material/dist/vue-material.css'

import VueClipboard from 'vue-clipboard2'

// Lodash

import lodash from 'lodash'
import VueLodash from 'vue-lodash/dist/vue-lodash.min'

// Local storage
import VueLocalStorage from 'vue-ls'

// Shortkey bindings
import VueShortkey from 'vue-shortkey'
 
Vue.use(Vuex)
Vue.use(VueFire)
Vue.use(VueMaterial)
Vue.use(VueClipboard)
Vue.use(VueLodash, lodash)
Vue.use(VueLocalStorage)
Vue.use(VueShortkey)

Vue.material.registerTheme('default', {
  primary: 'blue',
  accent: 'red',
  warn: 'orange',
  background: 'white'
})

Vue.material.setCurrentTheme('default')

import './style.scss'

import store from './data/store'

Vue.config.productionTip = false

const vm = new Vue({
  el: '#app',
  data : {
    moment
  },
  router,
  template: '<App/>',
  components: { App },
  store: store
})

