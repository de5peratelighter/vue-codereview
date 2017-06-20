<template>
  <div class="hello">
    <h4 v-if="activeUserGetter.isAnonymous">{{ initialMessage }}</h4>
    <h4 v-else>{{onlineMessage}}</h4>
    <ul>
      <li  v-for="item in items" :key="item['.key']">
        <v-card horizontal :class="['instance', 'blue', 'darken-1', 'white--text', 'mt-3', item.status]">
          
          
          <v-card-row :img="item.submitimage" class="avatar"> <v-card-text>{{ item.submissiontime }} <br> {{item.username }}</v-card-text> </v-card-row>

          <v-card-row> <v-card-text> <a :href="item.content" target="_blank">{{ truncContent(item.content, 'changeset') }}</a></v-card-text> </v-card-row>
          
          <v-card-row> <v-card-text> <a :href="item.ticket" target="_blank">{{ truncContent(item.ticket, 'ticket') }}</a> </v-card-text> </v-card-row>
          
          <v-card-row> <v-card-text>{{ item.comment }}</v-card-text> </v-card-row>
          
          <v-card-row> <v-card-text>{{ item.status }}</v-card-text> </v-card-row>
          
        </v-card>
      </li>
    </ul>
  </div>
</template>

<script>

import firebase from 'firebase'
import FBApp from './../data/firebase-config'

var provider = new firebase.auth.GoogleAuthProvider();

import {GET_FBASE} from './../data/mutation-types'
import {mapActions, mapGetters } from 'vuex'

export default {
  name: 'CodeReview',
  data () {
    return {
      initialMessage: 'This is dummy data, please LOG IN to get the real one',
      onlineMessage : 'This is data from firebase',
      DEFAULT_DATA : this.$store.state.items
    }
  },
  firebase: {},
  computed: {
    items () {
      return this.$store.state.items
    },
    ...mapGetters(['activeUserGetter'])
  },
  methods : {
    ...mapActions([GET_FBASE]),
    getData () {
      this.$bindAsArray('anArray', FBApp.ref("wow/nice").limitToLast(5), null, () => {this.getFirebaseData(this.anArray) })
    },
    truncContent (el, identify) {
      if (identify==="ticket") {
        return el.substr(el.indexOf("SUP"));
      } else if (identify==="changeset") {
        return el.slice(-8)
      }
    }
  },
  watch: {
    activeUserGetter (newCount, oldCount) {
      if (!newCount.isAnonymous) {
        this.getData()
      } else {
        this.getFirebaseData(this.DEFAULT_DATA)
      }
      console.log(`New value ${newCount.isAnonymous}, old value ${oldCount} !`)
    }
  },
  updated () {
  },
  mounted () {
  }
}
</script>

<style scoped>
  ul, li {
    padding: 0;
    list-style: none;
  }
  a, a:visited, a:hover, a:active {
    color: inherit;
  }
  .instance {
    height: 81px !important;
    justify-content: center;
    align-items: center;
  }
  .avatar {
    background-position: right !important;
    background-size: 50px !important;
  }
  .Good {
    background: #66bb6a !important;
  }
  .Looking {
    background: #F1C232 !important;
  }
  .New {
    background: #039be5 !important;
  }      
  .NotOK {
    background: #f44336 !important;
  } 
</style>
