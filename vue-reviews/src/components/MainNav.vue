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
                <notification-app v-if="activeUserGetter.role"></notification-app>
              </div>
              <md-button class="md-raised md-accent" @click="logIn">
                <span v-if="activeUserGetter.isAnonymous">Log In</span>
                <span v-else>Log Out</span>
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
import { FBApp } from '@/data/firebase-config'
import {LOGIN_ME} from '@/data/mutation-types'
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
  computed : {
    ...mapGetters(['activeUserGetter', 'firebasePathGetter'])
  },
  methods : {
    ...mapActions([LOGIN_ME]),
    logIn () {
      if (this.activeUserGetter.isAnonymous) {
        firebase.auth().signInWithPopup(provider).then((result) => {
          let user = result.user
          this.$bindAsObject('rules', FBApp.ref(this.firebasePathGetter.users + '/' + user.uid), null, () => {
              // initial login, always saves data, triggered even if user isn't activated
              let usr = {
                displayName: user.displayName, 
                photoURL : user.photoURL, 
                isAnonymous : user.isAnonymous,
                token : user.uid,
                role : this.rules.role, 
                alias : this.rules.alias, 
                team : this.rules.team
              }
              this[LOGIN_ME](usr)
              
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
                    usr.role = el.val().role
                    usr.alias = el.val().alias 
                    usr.team = el.val().team
                    this[LOGIN_ME](usr)
                  }
                })
              }
              
          })
          
        }).catch(function(error) {
          console.warn(error)
        });
      } else {
        firebase.auth().signOut().then(() => {
          // return to default user - this will triggers activeUserGetter watcher and dummy data to render instead of Firebase
          FBApp.ref(this.firebasePathGetter.users).ref.off('child_changed')
          this[LOGIN_ME](this.DEFAULT_USER)
        }).catch(function(error) {
          console.warn(error)
        });
      }
      
    }
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