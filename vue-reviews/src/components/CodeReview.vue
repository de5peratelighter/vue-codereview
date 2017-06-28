<template>
  <div>
    <md-layout md-gutter>
      <ul class="c-instance-list">
        <h4 v-if="activeUserGetter.isAnonymous">{{ initialMessage }}</h4>
        <h4 v-else>{{onlineMessage}}</h4>
        
        <li  v-for="(item, key) in items" :key="key">
          
          <md-card :class="[item.status, 'instance']">
            <md-layout md-align="center" md-vertical-align="center" md-gutter md-row>
              
              <md-layout>
                <md-card-content>{{ truncContent(item.submissiontime, 'time') }} <br> {{item.username }}</md-card-content>
              </md-layout>
              
              <md-layout>
                <md-avatar class="md-large">
                  <img :src="item.submitimage" :alt="item.username">
                </md-avatar>
              </md-layout>
              
              <md-layout>
                <md-button :href="item.content" target="_blank">
                  {{ truncContent(item.content, 'changeset') }}
                </md-button>
              </md-layout>
              
              <md-layout>
                <md-button :href="item.ticket" target="_blank">
                  {{ truncContent(item.ticket, 'ticket') }}
                </md-button>
              </md-layout>
              
              <md-layout>
                <md-card-content>{{ item.comment }}</md-card-content>
              </md-layout>
              
              <md-layout>
                <md-input-container>
                <label for="status">{{ item.reviewer }}</label>
                  <md-select name="status" v-model="item.status">
                    <md-option v-for="option in selectOptions" :key="option.id" :value="option.name" @selected="onSelectChange(item)">{{option.name}}</md-option>
                  </md-select>
                </md-input-container>
              </md-layout>
              
            </md-layout>
          </md-card>
          
        </li>
      </ul>
    </md-layout>
    <new-instance></new-instance>
  </div>
</template>

<script>

import firebase from 'firebase'
import FBApp from './../data/firebase-config'

var provider = new firebase.auth.GoogleAuthProvider();

import {GET_FBASE} from './../data/mutation-types'
import {mapActions, mapGetters } from 'vuex'
import NewInstance from './NewInstance.vue'

export default {
  name: 'CodeReview',
  data () {
    return {
      initialMessage: 'This is dummy data, please LOG IN to get the real one',
      onlineMessage : 'This is data from firebase',
      DEFAULT_DATA : this.$store.state.items,
      selectOptions :  [
        { id: 1, name: 'New' },
        { id: 2, name: 'Looking' },
        { id: 3, name: 'Good' },
        { id: 4, name: 'NotOK' }],
    }
  },
  firebase: {},
  computed: {
    items () {
      return this.$store.state.items
    },
    ...mapGetters(['activeUserGetter', 'displayNumGetter'])
  },
  methods : {
    ...mapActions([GET_FBASE]),
    getData () {
      this.$bindAsArray('anArray', FBApp.ref("wow/nice").limitToLast(Number(this.displayNumGetter)), null, () => {this[GET_FBASE](this.anArray) })
    },
    truncContent (el, typer) {
      return (
        typer === "ticket" ? el.substr(el.indexOf("SUP")) :
        typer === "changeset" ? el.slice(-8) :
        typer === "time" ? el : ""
      )
    },
    onSelectChange (el) {
      if (event && el['.key'] && !this.activeUserGetter.isAnonymous) {
        FBApp.ref("wow/nice/" + el['.key']).update({status: el.status, reviewer : this.activeUserGetter.displayName})
      }
    }
  },
  watch: {
    activeUserGetter (newCount, oldCount) {
      if (!newCount.isAnonymous) {
        this.getData()
      } else {
        this[GET_FBASE](this.DEFAULT_DATA)
      }
    },
    displayNumGetter (newValue, oldValue) {
      if (!this.activeUserGetter.isAnonymous) {this.getData () }
    }
  },
  mounted () {
    // this.$bindAsArray('anArray', FBApp.ref("wow/nice").limitToLast(5), null, () => {this[GET_FBASE](this.anArray) })
  },
  components : {
    NewInstance
  }
}
</script>

<style scoped>
  ul, li {
    padding: 0;
    list-style: none;
  }
  .c-instance-list {
    margin: 0 auto;
    width: 95%;
  }
  a, a:visited, a:hover, a:active {
    color: inherit;
  }
  .instance {
    height: 81px !important;
    overflow: hidden;
  }
  .instance, .instance label {
    color: #fff;
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
