<template>
    <div class="asider">
          
      <md-toolbar class="md-account-header md-theme-default">
            <md-avatar class="md-large">
              <template v-if="activeUserGetter.isAnonymous">
                <md-icon>face</md-icon>
              </template>
              <img v-else :src="activeUserGetter.photoURL" :title="activeUserGetter.displayName">
            </md-avatar>
            <md-layout class="review-welcome" md-align="center">
              <div>
                <span class="md-headline">{{activeUserGetter.displayName}}</span>
                <template v-if="levelEngineer(activeUserGetter.role)">
                  <notification-app></notification-app>
                </template>
              </div>
              <md-button class="md-raised md-accent" @click="logIn">
                
                <template v-if="activeUserGetter.isAnonymous">
                  G+ Log In
                  <md-tooltip md-delay="300" md-direction="bottom">Log in into the app</md-tooltip>
                </template>
              
                <template v-else>
                  Log out
                  <md-tooltip md-delay="300" md-direction="bottom">This will clear your session as well</md-tooltip>
                </template>
                
              </md-button>
            </md-layout>
      </md-toolbar>
  
      <md-layout class="md-theme-default">
        <md-list class="c-full-width">
          
          <slot></slot>
    
        </md-list>
      </md-layout>
          
   </div>
</template>

<script>
import firebase from 'firebase'
import fauth from'firebase/auth'
import { FBApp } from '@/data/firebase-config'
import { levelMixin } from '@/mixins/restrictions'
import {LOGIN_ME,SET_CURRENT_ONDUTY, SET_CURRENT_PARSER} from '@/data/mutation-types'
import {mapActions, mapGetters} from 'vuex'
const NotificationApp = () => import('@/components/NotificationApp.vue')

var provider = new firebase.auth.GoogleAuthProvider()

export default {
  name: 'MainNav',
  data () {
    return {
      DEFAULT_USER : this.$store.state.activeUser
    }
  },
  firebase: {},
  mixins : [levelMixin],
  computed : {
    ...mapGetters(['activeUserGetter', 'firebasePathGetter'])
  },
  methods : {
    ...mapActions([LOGIN_ME, SET_CURRENT_ONDUTY,SET_CURRENT_PARSER]),
    logIn () {
      if (this.activeUserGetter.isAnonymous) {
        firebase.auth().signInWithPopup(provider).then((result) => {
          let user = result.user
          this.getMyData(user)
        }).catch(function(error) {
          console.warn(error)
        });
      } else {
        firebase.auth().signOut().then(() => {
          // return to default user - this will triggers activeUserGetter watcher and dummy data to render instead of Firebase
          FBApp.ref(this.firebasePathGetter.users).ref.off('child_changed')
          this.$ls.clear()
          this[LOGIN_ME](this.DEFAULT_USER)
        }).catch(function(error) {
          console.warn(error)
        });
      }
      
    },
    getMyData (user) {
      this.$bindAsObject('rules', FBApp.ref(this.firebasePathGetter.users + '/' + user.uid), null, () => {
      // initial login, always saves data, triggered even if user isn't activated
      
        let usr = this.setUserData(user)
        
        this[LOGIN_ME](usr)

        this.getTodayOnduty('NA')
        this.getTodayOnduty('EMEA')
        this.getTodayParser()
        
        // listener for activeuser in DB, basically rerenders the entire app under if circumstances/role has changed
        FBApp.ref(this.firebasePathGetter.users +'/' + user.uid).on('child_changed', (el) => {
          usr[el.key] = el.val()
          this[LOGIN_ME](usr)
        })
        
        // listener for non-activated users, upon activating the account within DB - rerenders under new circumstances/role
        this._.isNull(this.rules['.val'])
        if (!this.activeUserGetter.role) {
          FBApp.ref(this.firebasePathGetter.users).on("child_added", (el) => {
            if (this.activeUserGetter.token == el.key) {
              // usr.role = el.val().role
              // usr.alias = el.val().alias 
              // usr.team = el.val().team
              // usr.notes = el.val().notes
              this[LOGIN_ME](usr)
            }
          })
        }
      
      })
    },
    setUserData (user) {
      return ({
        displayName: user.displayName, 
        photoURL : user.photoURL, 
        isAnonymous : user.isAnonymous,
        token : user.uid,
        role : this.rules.role, 
        alias : this.rules.alias, 
        team : this.rules.team,
        notes: this.rules.notes
      })
    },
    getTodayOnduty (region) {
        return new Promise((resolve,reject) => { // making it a promise due to THEN statements for lazy users (whenever session is not reloaded nextday)
          this.$bindAsObject('todayOnduty', FBApp.ref(this.firebasePathGetter.onDuty + '/' + this.$moment().get('year')+ '/' + region).child(this.$moment().isoWeek()), null, () => {
                if (this.todayOnduty['.value']) {
                    this[SET_CURRENT_ONDUTY]({ 'region': region, 'v' :this.todayOnduty['.value']})
                    resolve()
                }

                FBApp.ref(this.firebasePathGetter.onDuty + '/' + this.$moment().get('year')).child(this.$moment().isoWeek()).on('value', (el) => {
                    if (this.todayOnduty['.value']) {
                        this[SET_CURRENT_ONDUTY]({'region': region, 'v' : el})
                    }
                })

            })  
        })
    },
    getTodayParser () {
        return new Promise((resolve,reject) => { // making it a promise due to THEN statements for lazy users (whenever session is not reloaded nextday)
          this.$bindAsObject('todayParsing', FBApp.ref(this.firebasePathGetter.parsing + '/' + this.$moment().get('year')).child(this.$moment().isoWeek()), null, () => {
                if (this.todayParsing['.value']) {
                    this[SET_CURRENT_PARSER](this.todayParsing['.value'])
                    resolve()
                }
                
                FBApp.ref(this.firebasePathGetter.parsing + '/' + this.$moment().get('year')).child(this.$moment().isoWeek()).on('value', (el) => {
                    if (this.todayParsing['.value']) {
                        this[SET_CURRENT_PARSER](el)
                    }
                })

            })  
        })
    },
    checkSession () {
        let data = {}
        for (var a in localStorage) {
          // grab all main data from firebase instance
          if (a.includes('firebase:authUser')) {
            let item = JSON.parse(localStorage[a])
            data.uid = item.uid; data.photoURL = item.photoURL; data.isAnonymous = item.isAnonymous;
            data.displayName = item.displayName; 
          }

        }

        if (data.uid) {
          this.getMyData(data)
        }
    }
  },
  created () {
    this.checkSession()
  },
  components : {
    NotificationApp
  }
}
</script>
<style scoped>
  .c-full-width {
    width: 100%;
  }
</style>