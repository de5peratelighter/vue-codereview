// The Vue build version to load with the `import` command
// (runtime-only or standalone) has been set in webpack.base.conf with an alias.
import Vue from 'vue'
import Vuex from 'vuex'
import App from './App'
import router from './router'

// Firebase
import VueFire from 'vuefire'
// Vuetify
import Vuetify from 'vuetify'
import 'vuetify/dist/vuetify.min.css'

Vue.use(Vuetify)
Vue.use(Vuex)
Vue.use(VueFire)

import store from './data/store'

Vue.config.productionTip = false

// import VueResource from 'vue-resource'
// Vue.use(VueResource);
// Vue.http.options.root = `https://${store.state.fireConfig.core.databaseURL}/wow/`

// Vue.http.interceptors.push((request,next) => {
//   console.log(request);
//   next(response => {
//     console.log(response.json());
//   });
// })



/* eslint-disable no-new */
const vm = new Vue({
  el: '#app',
  router,
  template: '<App/>',
  components: { App },
  store: store
})

