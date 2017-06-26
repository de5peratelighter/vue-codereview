// The Vue build version to load with the `import` command
// (runtime-only or standalone) has been set in webpack.base.conf with an alias.
import Vue from 'vue'
import Vuex from 'vuex'
import App from './App'
import router from './router'

// Firebase
import VueFire from 'vuefire'

import VueMaterial from 'vue-material'
import 'vue-material/dist/vue-material.css'

Vue.use(Vuex)
Vue.use(VueFire)
Vue.use(VueMaterial)

Vue.material.registerTheme('default', {
  primary: 'blue',
  accent: 'red',
  warn: 'red',
  background: 'white'
})

import store from './data/store'

Vue.config.productionTip = false

const vm = new Vue({
  el: '#app',
  router,
  template: '<App/>',
  components: { App },
  store: store
})

