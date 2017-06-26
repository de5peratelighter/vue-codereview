<template>
    <div class="asider">
          
          <md-toolbar class="md-account-header md-theme-default">
                <md-avatar class="md-large">
                  <img :src="activeUserGetter.photoURL" :title="activeUserGetter.displayName">
                </md-avatar>
                <md-layout class="review-welcome" md-align="center">
                  <div class="md-headline">{{activeUserGetter.displayName}}</div>
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
import {LOGIN_ME} from './../data/mutation-types'
import {mapActions, mapGetters} from 'vuex'

var provider = new firebase.auth.GoogleAuthProvider()

export default {
  name: 'MainNav',
  data () {
    return {
      DEFAULT_USER : this.$store.state.activeUser
    }
  },
  computed : {
    ...mapGetters(['activeUserGetter'])
  },
  methods : {
    ...mapActions([LOGIN_ME]),
    logIn () {
      if (this.activeUserGetter.isAnonymous) {
        firebase.auth().signInWithPopup(provider).then((result) => {
          let user = result.user
          this[LOGIN_ME]({displayName: user.displayName, photoURL : user.photoURL, isAnonymous : user.isAnonymous, sessionLength: this.session})
        }).catch(function(error) {
          console.warn(error)
        });
      } else {
        firebase.auth().signOut().then(() => {
          // return to default user - this will triggers activeUserGetter watcher and dummy data to render instead of Firebase
          this[LOGIN_ME](this.DEFAULT_USER)
        }).catch(function(error) {
          console.warn(error)
        });
      }
      
    }
  }
}
</script>
<style scoped>
  .c-full-width {
    width: 100%;
  }
</style>