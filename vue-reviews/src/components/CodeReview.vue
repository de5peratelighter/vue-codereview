<template>
  <div>
    <md-layout md-gutter>
      <ul class="c-main-section">
        <div v-if="activeUserGetter.isAnonymous"> 
          <h4>{{ initialMessage }}</h4>
        </div>
        <div v-else-if="levelEngineer(activeUserGetter.role)">
          <h4>{{welcomeMessage}}</h4>
        </div>
        <div v-else-if="!levelEngineer(activeUserGetter.role)">{{noaccessMessage}}</div>
        
        <li  v-for="(item, key) in items" :key="key">
          
          <md-card :class="[item.status, 'instance']">
            <md-layout md-align="center" md-vertical-align="center" md-gutter md-row>
              
              <md-layout>
                <md-card-content>{{ truncContent(item.st, 'time') }} <br> {{item.username }}</md-card-content>
              </md-layout>
              
              <md-layout>
                <md-avatar class="md-large">
                  <img :src="item.si" :alt="item.username">
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
                  
                <md-button :id="'dialog'+key" @click="updateDialog(key,'open')"> <md-icon v-if="item.comment||item.reviewerComment">chat_bubble</md-icon> <md-icon v-else>chat_bubble_outline</md-icon> </md-button>
                
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
                      <md-button class="md-primary" @click="updateDialog(key,'close')">Ok</md-button>
                    </md-dialog-actions>
                  </md-dialog>
                
                </md-card-content>
              </md-layout>
              
              <md-layout>
                <md-input-container>
                <label for="status" style="color:inherit">{{ item.reviewer ? item.reviewer : 'Codereviewer will set the status' }}</label>
                  <md-select :disabled="!levelReviewer(activeUserGetter.role)" name="status" v-model="item.status">
                    <md-option v-for="option in selectOptions" :key="option.id" :value="option.name" @selected="onSelectChange(item)">{{option.name}}</md-option>
                  </md-select>
                </md-input-container>
              </md-layout>
              
            </md-layout>
          </md-card>
          
        </li>
      </ul>
    </md-layout>
    <div v-if="levelEngineer(activeUserGetter.role)">
      <new-instance :inputs="codeReviewInputs" :requiredword="newInstanceRequiredWord" :path="firebasePathGetter.main" relcomponent="codereview"> </new-instance>
    </div>
    
  </div>
</template>

<script>

import firebase from 'firebase'
import { FBApp } from '@/data/firebase-config'
import {GET_FBASE} from '@/data/mutation-types'
import {mapActions, mapGetters } from 'vuex'
import { levelMixin } from '@/mixins/restrictions'
import { newInstanceMixin } from '@/mixins/inputs'
import { notificationMixin } from '@/mixins/notifications'

const NewInstance = () => import('@/components/NewInstance.vue')

export default {
  name: 'CodeReview',
  data () {
    return {
      initialMessage: 'This is dummy data, please LOG IN to get the real one',
      noaccessMessage : 'Ask PM to activate your account(via skype, hipchat)',
      welcomeMessage: 'Welcome!',
      newInput : '',
      newInstanceRequiredWord: 'bazaarvoice',
      DEFAULT_DATA : this.$store.state.items,
      selectOptions :  [
        { id: 1, name: 'New' },
        { id: 2, name: 'Looking' },
        { id: 3, name: 'Good' },
        { id: 4, name: 'NotOK' }],
      reviewers : []
    }
  },
  firebase: {},
  mixins: [levelMixin, newInstanceMixin, notificationMixin],
  computed: {
    items () {
      return this.$store.state.items
    },
    ...mapGetters(['activeUserGetter', 'displayNumGetter', 'firebasePathGetter'])
  },
  methods : {
    ...mapActions([GET_FBASE]),
    getData () {
      this.$bindAsArray('itemsArray', FBApp.ref(this.firebasePathGetter.main).limitToLast(Number(this.displayNumGetter)), null, () => {
        this[GET_FBASE](this.itemsArray)
        // this.$bindAsObject('todayReviewersArray', FBApp.ref(this.firebasePathGetter.schedule).child(this.today.format('YYYY-MM-DD')), null, () => {
        //   this.reviewers = this.todayReviewersArray['.value'].split(',').slice(0,-1)
        // })
        
      })
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
      if (event && el['.key'] && !this.activeUserGetter.isAnonymous && this.levelReviewer(this.activeUserGetter.role)) {
        FBApp.ref(this.firebasePathGetter.main +"/" + el['.key']).update({status: el.status, reviewer : this.activeUserGetter.alias}).then(()=> {
           this.$bindAsObject('itemOwner', FBApp.ref(this.firebasePathGetter.notifications + '/' + el.username), null, () => {
             if (this.itemOwner.token) { 
                this.submitNotification(this.itemOwner, this.activeUserGetter, 'informOwner' , el.status) // from 'notificationMixin'
             }
           })
        })
      } else {
        this.dummyDataMessage()
      }
    },
    updateDialog(ref, type) {
      let el = this.$refs[ref][0]
      this.newInput = ''
      if (type==='open') {
        el.open()
      } else if (type==='close') {
        el.close()
      }
    },
    updateComment(el) {
      if (el['.key'] && !this.activeUserGetter.isAnonymous) {
        
        let newData = {} // check whether we should update reviewer's comment or user's Comment
        if (this.activeUserGetter.alias === el.reviewer) {
          newData = {reviewerComment: this.newInput} 
        } else if (this.activeUserGetter.alias === el.username) {
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
  components : {
    NewInstance
  }
}
</script>

<style scoped>
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
