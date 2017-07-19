<template>
  <div>
    <md-layout md-gutter>
      <ul class="c-main-section">
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
                <md-card-content>
                  
                <md-button :id="'dialog'+key" @click="openDialog(key)"> <md-icon v-if="item.comment||item.reviewerComment">chat_bubble</md-icon> <md-icon v-else>chat_bubble_outline</md-icon> </md-button>
                
                  <md-dialog :md-open-from="'#dialog'+key" :md-close-to="'#dialog'+key" :ref="String(key)"> <!-- String(key) removes dialog undefined bug with the zero-index key -->
                  
                    <div v-if="item.comment">
                      <md-dialog-title>From author</md-dialog-title>
                      <md-dialog-content>{{ item.comment }}</md-dialog-content>
                    </div>
                    <div v-if="item.reviewerComment">
                      <md-dialog-title>From reviewer</md-dialog-title>
                      <md-dialog-content>{{ item.reviewerComment }}</md-dialog-content>
                    </div>
                    <md-dialog-content>
                      <md-input-container>
                          <label :for="'label'+key">New comment</label>
                          <md-textarea :id="'#label'+key" v-model="newInput"></md-textarea>
                          <md-button class="md-primary" @click="updateComment(item)">Add</md-button>
                      </md-input-container>
                    </md-dialog-content>
                    <md-dialog-actions>
                      <md-button class="md-primary" @click="closeDialog(key)">Ok</md-button>
                    </md-dialog-actions>
                  </md-dialog>
                
                </md-card-content>
              </md-layout>
              
              <md-layout>
                <md-input-container>
                <label for="status" style="color:inherit">{{ item.reviewer ? item.reviewer : 'Codereviewer will set the status' }}</label>
                  <md-select name="status" v-model="item.status" :disabled="activeUserGetter.displayName === item.username">
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
import FBApp from '@/data/firebase-config'

var provider = new firebase.auth.GoogleAuthProvider();

import {GET_FBASE} from '@/data/mutation-types'
import {mapActions, mapGetters } from 'vuex'
import NewInstance from './NewInstance.vue'

export default {
  name: 'CodeReview',
  data () {
    return {
      initialMessage: 'This is dummy data, please LOG IN to get the real one',
      onlineMessage : 'This is data from firebase',
      newInput : '',
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
    ...mapGetters(['activeUserGetter', 'displayNumGetter', 'firebasePathGetter'])
  },
  methods : {
    ...mapActions([GET_FBASE]),
    getData () {
      this.$bindAsArray('anArray', FBApp.ref(this.firebasePathGetter.main).limitToLast(Number(this.displayNumGetter)), null, () => {this[GET_FBASE](this.anArray) })
    },
    truncContent (el, typer) {
      // TIME - for compatibility with old dates $moment is provided with additional parameter (from old Polymer project w/o $moment in place)
      return (
        typer === "ticket" ? el.substr(el.indexOf("SUP")) :
        typer === "changeset" ? el.slice(-8) :
        typer === "time" ?  this.$moment(el, 'DD-MM-YYYY, hh:mm:ss').format('DD-MMM, h:mm A') : ""
      )
    },
    onSelectChange (el) {
      if (event && el['.key'] && !this.activeUserGetter.isAnonymous) {
        FBApp.ref(this.firebasePathGetter.main +"/" + el['.key']).update({status: el.status, reviewer : this.activeUserGetter.displayName})
      } else {
        this.dummyDataMessage()
      }
    },
    openDialog(ref) {
      this.newInput = ''
      this.$refs[ref][0].open();
    },
    closeDialog(ref) {
      this.newInput = ''
      this.$refs[ref][0].close();
    },
    updateComment(el) {
      if (el['.key'] && !this.activeUserGetter.isAnonymous) {
        
        let newData = {} // check whether we should update reviewer's comment or user's Comment
        if (this.activeUserGetter.displayName === el.reviewer) {
          newData = {reviewerComment: this.newInput} 
        } else if (this.activeUserGetter.displayName === el.username) {
          newData = {comment: this.newInput}
        }
        
        FBApp.ref(this.firebasePathGetter.main +"/" + el['.key']).update(newData)
      } else {
        this.dummyDataMessage()
      }
    },
    dummyDataMessage () {
      
      console.log('This is not real data')
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
  activated () {
      if (!this.activeUserGetter.isAnonymous) {
        this.getData()
      } else {
        this[GET_FBASE](this.DEFAULT_DATA)
      }
  },
    // this.$bindAsArray('anArray', FBApp.ref("wow/nice").limitToLast(5), null, () => {this[GET_FBASE](this.anArray) })
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
