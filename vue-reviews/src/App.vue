<template>
  <div id="app">

      <md-toolbar>
        <div class="md-toolbar-container">
          <md-button class="md-icon-button" @click="$refs.sidenav.toggle()">
            <md-icon >menu</md-icon>
          </md-button>
          <md-layout v-if="levelEngineer(activeUserGetter.role)">
            <md-layout v-if="currentOnDutyGetter['NA']" md-align="center">
              <strong>On-duty NA: {{currentOnDutyGetter['NA']}}</strong>
            </md-layout>
            <md-layout v-if="currentOnDutyGetter['EMEA']" md-align="center">
              <strong>On-duty EMEA: {{currentOnDutyGetter['EMEA']}}</strong>
            </md-layout>
            <md-layout v-if="currentParserGetter" md-align="center">
              <strong>Queue parser: {{currentParserGetter}}</strong>
            </md-layout>
          </md-layout>
          <control-inputs v-if="codereviewRouteActive && levelEngineer(activeUserGetter.role)" 
            :is-column="controlInputsVals.isColumn" :hidden-bydefault="controlInputsVals.hiddenBydefault"/>
        </div>
      </md-toolbar>

      <md-sidenav class="md-left" ref="sidenav">

        <main-nav>

          <md-list-item v-for="(item, index) in routes" :key="index" v-if="!checkAccess(item.access)">
            <router-link :to="{name : item.name}" class="router__link">
              <md-icon>{{ item.icon }}</md-icon>  <span>{{ item.title }}</span>
            </router-link>
          </md-list-item>

        </main-nav>

      </md-sidenav>

      <keep-alive>
        <router-view></router-view>
      </keep-alive>
  </div>
</template>

<script>
import 'animate.css/animate.min.css'

import firebase from 'firebase'
import { FBApp, messaging } from '@/data/firebase-config'
import {UPDATE_NUM, GET_FBASE, SET_PREFIXES} from './data/mutation-types'
import { levelMixin } from '@/mixins/restrictions'
import {mapActions, mapGetters} from 'vuex'
import MainNav from './components/MainNav.vue'

const ControlInputs = () => import('./components/codereview/ControlInputs.vue')

export default {
  name: 'app',
  data () {
    return {
      routes: [
        { title: 'Home', icon: 'home', name: 'CodeReview', acess : "ALL" },
        { title: 'Reviewers', icon: 'people', name: 'ReviewersList', access : "ENGINEERING" },
        { title: 'CapacityDoc', icon: 'alarm_add', name: 'CapacityDoc', access : "TEAMLEAD" },
        { title: 'Stats', icon : 'data_usage', name: 'StatsTable', access : "TEAMLEAD" },
        { title: 'Knowledge Sharing', icon: 'view_stream', name: 'KnowledgeSharing', access : "ENGINEERING" },
        // { title: 'SuperDoc', icon: 'book', name: 'SuperDoc', access : "ALL" },
        { title: 'Config', icon: 'settings', name: 'MainConfig', access : "PM" },
      ],
      controlInputsVals : {
        isColumn : false,
        hiddenBydefault : true
      }
    }
  },
  firebase : {},
  mixins: [levelMixin],
  computed : {
    ...mapGetters(['activeUserGetter', 'firebasePathGetter','currentOnDutyGetter','currentParserGetter']),
    codereviewRouteActive () {
    	return this.$route.name == "CodeReview"
    }
  },
  methods: {
    ...mapActions([SET_PREFIXES]),
    checkAccess (el) {
      return (el === 'PM' && !this.levelDEVORPM(this.activeUserGetter.role)) || (el === 'ENGINEERING' && !this.levelEngineer(this.activeUserGetter.role)) || (el === 'TEAMLEAD' && !this.levelTeamlead(this.activeUserGetter.role))
    }
  },
  created () {
    this.$bindAsObject('prefz', FBApp.ref(this.firebasePathGetter.prefixes), null, () => {
      this[SET_PREFIXES](this.prefz)
    })
  },
  mounted () {
    // resistering and using SW
    navigator.serviceWorker.register('./static/firebase-messaging-sw.js').then((registration) => {
        messaging.useServiceWorker(registration)
    })
  },
  components : {
    MainNav,
    ControlInputs
  }
}
</script>

<style>
.review-welcome > * {
  width: 100%;
  margin: 5px 8px;
  text-align: center;
}
.asider {
  background-color: #3f51b5;
  color: rgba(255, 255, 255, .87);
}
.slide-fade-enter-active {
  transition: all .1s ease;
}
.slide-fade-leave-active {
  transition: all .6s cubic-bezier(1.0, 0.5, 0.8, 1.0);
}
.slide-fade-enter, .slide-fade-leave-to
 .slide-fade-leave-active  {
  opacity: 0;
}
.router__link {
  text-decoration: none;
}
.c-full-width {
  width: 100%;
}
.c-main-section {
  margin: 0 auto;
  width: 95%;
}
</style>
