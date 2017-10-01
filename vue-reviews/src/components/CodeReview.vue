<template>
  <div>
    <md-layout md-gutter>
      <ul class="c-main-section">
        
        <md-layout md-align="center">
            <h4>
              <template v-if="activeUserGetter.isAnonymous">
                {{ initialMessage }}
              </template>
              <template v-else-if="!levelEngineer(activeUserGetter.role)">
                {{ noaccessMessage }}
              </template>
            </h4>
        </md-layout>

        <li  v-for="(item, key) in items" :key="key">

          <md-card :class="[item.status, 'instance']">
            <md-layout md-align="left" md-vertical-align="center" md-gutter md-row>
              
              <md-layout>
                <md-card-content>
                  <span>{{ truncContent(item['.key'], 'time') }}</span>
                  <md-tooltip md-delay="300" md-direction="right"> Submission time </md-tooltip> 
                  <br> by {{item.username }} 
                </md-card-content>
              </md-layout>
              
              <md-layout>
                <md-avatar >
                  <template v-if="item.si">
                    <img :src="item.si" :alt="item.username">
                  </template>
                  <template v-else>
                    <md-icon>face</md-icon>
                  </template>
                  <md-tooltip md-delay="300" md-direction="right"> {{helperTexts.avatar}} </md-tooltip>
                </md-avatar>
              </md-layout>
              
              <md-layout>
                <md-button :href="prependPrefix(item.content, 'changeset')" target="_blank">
                  {{ truncContent(item.content, 'changeset') }}
                  <md-tooltip md-delay="300" md-direction="right"> {{helperTexts.cset}} </md-tooltip>
                </md-button>
                <md-button class="md-icon-button md-raised md-dense" v-clipboard:copy="copyCset(item.content)">
                  <md-icon>content_copy</md-icon>
                  <md-tooltip md-direction="bottom">Copy (branchname | chageset number) to clipboard</md-tooltip>
                </md-button>
              </md-layout>
              
              <md-layout>
                <md-button :href="prependPrefix(item.ticket, 'ticket')" target="_blank">
                  {{ truncContent(item.ticket, 'ticket') }}
                  <md-tooltip md-delay="300" md-direction="right"> {{helperTexts.ticket}} </md-tooltip>
                </md-button>
              </md-layout>
              
              <md-layout>
                <md-card-content>
                  
                  <md-button :id="'dialog'+key" @click="updateDialog(key,'open')"> 
                    <md-tooltip md-delay="300" md-direction="right"> {{helperTexts.comments}} </md-tooltip>
                    <md-icon v-if="(item.comment || '').toLowerCase().includes('urgent') && item.status === 'New' " class="shake">alarm</md-icon>
                    <md-icon v-else-if="item.comment||item.rc">chat_bubble</md-icon> 
                    <md-icon v-else>chat_bubble_outline</md-icon> 
                  </md-button>
                  
                  <md-dialog :md-open-from="'#dialog'+key" :md-close-to="'#dialog'+key" :ref="String(key)"> <!-- String(key) removes dialog undefined bug with the zero-index key -->
                  
                    <div v-if="item.comment">
                      <md-dialog-title>From author</md-dialog-title>
                      <md-dialog-content>{{ item.comment }}</md-dialog-content>
                    </div>
                    <div v-if="item.rc">
                      <md-dialog-title>From reviewer</md-dialog-title>
                      <md-dialog-content>{{ item.rc }}</md-dialog-content>
                    </div>
                    <div v-if="!item.rc && !item.comment">
                      <md-dialog-content>No comments yet.</md-dialog-content>
                    </div>
                    <md-dialog-content v-if="canAddComments(item)">
                      <md-input-container>
                          <label :for="'label'+key">New comment</label>
                          <md-textarea :id="'#label'+key" v-model="newInput" @keyup.enter.native="updateComment(item)"></md-textarea>
                          <md-button class="md-primary" @click="updateComment(item)">Add</md-button>
                          <md-tooltip md-direction="bottom">
                            <template v-if="item.username === activeUserGetter.alias">{{ownerCommentMessage}}</template>
                            <template v-else-if="item.reviewer === activeUserGetter.alias">{{reviewerCommentMessage}}</template>
                          </md-tooltip>
                      </md-input-container>

                    </md-dialog-content>
                    <md-dialog-actions>
                      <md-button class="md-primary" @click="updateDialog(key,'close')">Ok</md-button>
                    </md-dialog-actions>
                  </md-dialog>
                
                </md-card-content>
              </md-layout>
              
              <md-layout>
                <md-tooltip md-delay="300" md-direction="left"> {{helperTexts.status}} </md-tooltip>
                <update-status :item="item" @statusUpdate="onSelectChange(item)" @removeInstance="deleteInstanceForever(item)"> </update-status>
              </md-layout>
              
            </md-layout>
          </md-card>
          
        </li>
      </ul>
    </md-layout>
    <md-layout v-if="levelEngineer(activeUserGetter.role)" md-flex-offset="5">
      <new-instance :inputs="codeReviewInputs" :requiredword="newInstanceRequiredWord" :path="firebasePathGetter.main" relcomponent="codereview"> </new-instance>
    </md-layout>
    
    <md-snackbar md-position="bottom center" ref="coreSnackbar" md-duration="5000">
        <strong>{{snackbarMessage}}</strong>
        <md-button class="md-accent" @click="$refs.coreSnackbar.close()">Close</md-button>
    </md-snackbar>
    
  </div>
</template>

<script>

import firebase from 'firebase'
import { FBApp } from '@/data/firebase-config'
import {GET_FBASE} from '@/data/mutation-types'
import {mapActions, mapGetters } from 'vuex'
import { levelMixin } from '@/mixins/restrictions'
import { newInstanceMixin } from '@/mixins/inputs'
import { codereviewLabelMixin } from '@/mixins/labels'
import { notificationMixin } from '@/mixins/notifications'

const NewInstance = () => import('@/components/NewInstance.vue')
const UpdateStatus = () => import('@/components/codereview/UpdateStatus.vue')

export default {
  name: 'CodeReview',
  data () {
    return {
      newInput : '',
      newInstanceRequiredWord: 'bazaarvoice',
      DEFAULT_DATA : this.$store.state.items,
      prefixes : {}
    }
  },
  firebase: {},
  mixins: [levelMixin, newInstanceMixin, notificationMixin, codereviewLabelMixin],
  computed: {
    items () {
      return this.$store.state.items
    },
    ...mapGetters(['activeUserGetter', 'displayNumGetter', 'firebasePathGetter', 'globalPrefixesGetter'])
  },
  methods : {
    ...mapActions([GET_FBASE]),
    getData () {
      this.$bindAsArray('itemsArray', FBApp.ref(this.firebasePathGetter.main).limitToLast(Number(this.displayNumGetter)), null, () => {
        this[GET_FBASE](this.itemsArray)
      })
    },
    prependPrefix (el, typer) {
      // console.warn(el, typer, this.globalPrefixesGetter)
      return (
        typer === "ticket" ? (el.includes(this.globalPrefixesGetter.tickets.val) ? el : this.globalPrefixesGetter.tickets.val + el) :
        typer === "changeset" ? (el.includes(this.globalPrefixesGetter.changes.val) ? el : this.globalPrefixesGetter.changes.val + el) :
        el
      )
    },
    copyCset(el) {
      return el.includes('user') ? el.substr(el.lastIndexOf('user%2F')).split(/%2F|%40/)[1] : el.split('/').slice(-1).pop()
    },
    truncContent (el, typer) {
      return (
        typer === "ticket" ? el.split('/').pop().slice(0,10) :
        typer === "changeset" ? el.slice(-8) :   
        typer === "time" ?  this.$moment(Number(el)).format('DD MMMM, h:mm A') : ""
      )
    },
    onSelectChange (el) {
      if (el['.key'] && this.levelReviewer(this.activeUserGetter.role)) {
        FBApp.ref(this.firebasePathGetter.main +"/" + el['.key']).update({status: el.status, reviewer : this.activeUserGetter.alias}).then(()=> {
          this.$bindAsObject('itemOwner', FBApp.ref(this.firebasePathGetter.notifications + '/' + el.username), null, () => {
            if (this.itemOwner.token) { 
                this.submitNotification(this.itemOwner, this.activeUserGetter, 'informOwner' , el.status) // from 'notificationMixin'
            }
          })
        })
      } else {
        this.snackbarMessage = "Status wont be updated in the database, you either ain't allowed to do this or this is the bug";
        this.$refs.coreSnackbar.open();
      }
    },
    deleteInstanceForever (item) {
      if (this.activeUserGetter.alias === item.username) { // another final verification
        FBApp.ref(this.firebasePathGetter.main +"/" + item['.key']).set({})
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
    canAddComments (item) {
      return item.username === this.activeUserGetter.alias || item.reviewer === this.activeUserGetter.alias
    },
    updateComment(el) {
      if (el['.key'] && !this.activeUserGetter.isAnonymous) {
        
        let newData = {} // check whether we should update reviewer's comment or user's Comment
        if (this.activeUserGetter.alias === el.reviewer) {
          newData = {rc: this.newInput} 
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
    activeUserGetter : {
      handler(newVal){
        if (!newVal.isAnonymous && newVal.role) {
          this.getData()
        } else {
          this[GET_FBASE](this.DEFAULT_DATA)
        }
      },
      deep: true
    },
    displayNumGetter (newVal) {
      if (!this.activeUserGetter.isAnonymous) {this.getData () }
    }
  },
  activated () {
      if (!this.activeUserGetter.isAnonymous && this.activeUserGetter.role) {
        this.getData()
      } else {
        this[GET_FBASE](this.DEFAULT_DATA)
      }
  },
  components : {
    NewInstance,
    UpdateStatus
  }
}
</script>

<style scoped>
  a, a:visited, a:hover, a:active {
    color: inherit;
  }
  .width80 {
    width: 80%;
  }
  .instance {
    height: 74px !important;
    padding: 0 10px;
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
    background: rgba(102,187,106,.9) !important;
  }
  .Looking {
    background: rgba(241,194,50,.9) !important;
  }
  .New {
    background: rgba(3,155,229,.9) !important;
  }      
  .NotOK {
    background: rgba(244,67,54,.9) !important;
  }
  .Questions {
    background: rgba(142,124,195,.9) !important;
  }
</style>
