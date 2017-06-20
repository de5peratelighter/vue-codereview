<template>
  <div id="app">
    <v-app id="example-2">
    <v-navigation-drawer persistent light :mini-variant.sync="mini" v-model="drawer">
      <v-list class="pa-0">
        <v-list-item>
          <v-list-tile avatar tag="div">
            <v-list-tile-avatar>
              <img :src="activeUserGetter.photoURL" />
            </v-list-tile-avatar>
            <v-list-tile-content>
              <v-list-tile-title>{{activeUserGetter.displayName}}</v-list-tile-title>
            </v-list-tile-content>
            <v-list-tile-action>
              <v-btn icon @click.native.stop="mini = !mini">
                <v-icon>chevron_left</v-icon>
              </v-btn>
            </v-list-tile-action>
          </v-list-tile>
        </v-list-item>
      </v-list>
      <v-list class="pt-0" dense>
        <v-divider></v-divider>
        
          <v-list-item v-for="item in items" :key="item">
            <router-link :to="{name : item.name}" class="router__link">
              <v-list-tile>
                <v-list-tile-action>
                  <v-icon>{{ item.icon }}</v-icon>
                </v-list-tile-action>
                <v-list-tile-content>
                  <v-list-tile-title>{{ item.title }}</v-list-tile-title>
                </v-list-tile-content>
              </v-list-tile>
            </router-link>
          </v-list-item>
          
          <!-- LogIn -->
          <v-list-item @click="logIn">
              <v-list-tile>
                <v-list-tile-action>
                  <v-icon>person</v-icon>
                </v-list-tile-action>
                <v-list-tile-content>
                  <v-list-tile-title v-if="activeUserGetter.isAnonymous">Log In</v-list-tile-title>
                  <v-list-tile-title v-else>Log Out</v-list-tile-title>
                </v-list-tile-content>
              </v-list-tile>
          </v-list-item>
        
        
      </v-list>
    </v-navigation-drawer>
    <v-toolbar fixed class="indigo darken-4" light>
      <v-toolbar-side-icon light @click.native.stop="drawer = !drawer"></v-toolbar-side-icon>
      <v-toolbar-title>Toolbar</v-toolbar-title>
    </v-toolbar>
    <main>
      <v-container fluid>
        <keep-alive>
          <router-view></router-view>
        </keep-alive>
      </v-container>
    </main>
  </v-app>
  
    <!--<img src="./assets/logo.png">-->
    
    <!--<div>-->
      
    <!--  <router-link :to="{name : 'ReviewersList'}">Reviewers</router-link>-->
    <!--</div>-->
    
      
  </div>
</template>

<script>

// import Tabs from './Tabs'
// import TabsItem from './TabsItem'
// import TabsContent from './TabsContent'
import firebase from 'firebase'
import 'animate.css/animate.min.css'
import {LOGIN_ME} from './data/mutation-types'
import {mapActions, mapGetters} from 'vuex'

var provider = new firebase.auth.GoogleAuthProvider()

export default {
  name: 'app',
  data () {
      return {
        drawer: true,
        items: [
          { title: 'Home', icon: 'dashboard', name: 'CodeReview'},
          { title: 'Reviewers', icon: 'question_answer', name: 'ReviewersList' }
        ],
        mini: false,
        right: null,
        DEFAULT_USER : this.$store.state.activeUser
    }
  },
  computed : {
    ...mapGetters(['activeUserGetter'])
  },
  methods : {
    ...mapActions([LOGIN_ME]),
    // ...mapMutations([LOG_ME_IN]),
    logIn () {
      
      if (this.activeUserGetter.isAnonymous) {
        firebase.auth().signInWithPopup(provider).then((result) => {
          // This gives you a Google Access Token. You can use it to access the Google API.
          var token = result.credential.accessToken;
          // The signed-in user info.
          var user = result.user
          this.logMe({displayName: user.displayName, photoURL : user.photoURL, isAnonymous : user.isAnonymous})
          
        }).catch(function(error) {
          // Handle Errors here.
          var errorCode = error.code;
          var errorMessage = error.message;
          // The email of the user's account used.
          var email = error.email;
          // The firebase.auth.AuthCredential type that was used.
          var credential = error.credential;
          // ...
        });
      } else {
        firebase.auth().signOut().then(() => {
          this.logMe(this.DEFAULT_USER)
        }).catch(function(error) {
          // An error happened.
        });
      }
      
    }
  },
  mounted () {
  }
}
</script>

<style>
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
</style>
