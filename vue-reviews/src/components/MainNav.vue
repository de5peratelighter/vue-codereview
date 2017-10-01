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
                  Log In
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
  firebase: {},
  mixins : [levelMixin],
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
              
              let usr = this.setUserData(user)
              
              this[LOGIN_ME](usr)
              
              this.$ls.set('displayName', user.displayName)
              this.$ls.set('photoURL', user.photoURL)
              this.$ls.set('isAnonymous', user.isAnonymous)
              this.$ls.set('token', user.uid)
              this.$ls.set('role', this.rules.role)
              this.$ls.set('alias', this.rules.alias)
              this.$ls.set('team', this.rules.team)
              this.$ls.set('notes', this.rules.notes)
              
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
                    usr.notes = el.val().notes
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
          this.$ls.clear()
          this[LOGIN_ME](this.DEFAULT_USER)
        }).catch(function(error) {
          console.warn(error)
        });
      }
      
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
    }
  },
  created () {
    let user = {
      displayName : this.$ls.get('displayName'),
      photoURL : this.$ls.get('photoURL'),
      isAnonymous : this.$ls.get('isAnonymous'),
      token : this.$ls.get('token'),
      role : this.$ls.get('role'),
      alias : this.$ls.get('alias'),
      team : this.$ls.get('team'),
      notes : this.$ls.get('notes')
    }
    if (user.displayName) {
      this[LOGIN_ME](user)
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