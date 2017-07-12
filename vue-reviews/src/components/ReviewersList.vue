<template>
    <md-layout md-flex="10" class="c-stretch" v-if="!activeUserGetter.isAnonymous">
        <div>
            <span class="md-headline">Reviewers</span>
            <md-list>
                <md-list-item v-for="(reviewer,index) in revs" :key="index">
                    <span>{{index}}. {{reviewer}}</span> 
                    <md-button @click="updateReviewerList(index, 'remove')" class="md-icon-button md-list-action"> 
                       <md-icon>delete</md-icon>
                    </md-button>
                </md-list-item>
                <md-input-container>
                    <label for="reviewers__list__addnew">{{newReviewerMessage}}</label>
                    <md-input id="reviewers__list__addnew" v-model="newReviewerInput"></md-input>
                    <md-button @click="updateReviewerList(newReviewerInput, 'add')" class="md-icon-button"> 
                       Add
                    </md-button>
                </md-input-container>
            </md-list>
        </div>
    </md-layout>
</template>

<script>
    import firebase from 'firebase'
    import FBApp from './../data/firebase-config'
    
    var provider = new firebase.auth.GoogleAuthProvider();
    
    import {GET_REVIEWERS} from './../data/mutation-types'
    import {mapActions, mapGetters } from 'vuex'
    
    export default {
       name: 'ReviewersList', 
       data () {
           return {
               newReviewerMessage : 'Add reviewer',
               newReviewerInput : ''
           }
       },
       computed : {
            ...mapGetters(['activeUserGetter','firebasePathGetter']),
            revs () {
                let ar = this.reviewers ? this.reviewers['.value'] : ''
                let obj = {}
                if (ar) {  
                    ar.split(',').forEach((el, i)=> {obj[i] = el}) 
                    return obj
                }
            }
       },
       firebase: {},
       methods : {
           ...mapActions([GET_REVIEWERS]),
            updateReviewerList (el,action) {
                let lister = this.reviewers['.value']
                if (action === "remove") {
                    lister = lister.split(',')  
                    lister.splice(el,1)
                    FBApp.ref(this.firebasePathGetter.reviewers).set(lister.join(',')).then(()=> {this[GET_REVIEWERS](lister.join(',')) })
                } else if (action === "add") {
                    lister = lister + "," + el
                    FBApp.ref(this.firebasePathGetter.reviewers).set(lister).then(()=> {this[GET_REVIEWERS](lister)})
                    this.newReviewerInput = ''
                }
            }
       },
        watch : {
            activeUserGetter (newCount, oldCount) {
              if (!newCount.isAnonymous) {
                  this.$bindAsObject('reviewers', FBApp.ref(this.firebasePathGetter.reviewers),null, () => {
                      this[GET_REVIEWERS](this.reviewers['.value'])
                  })
              }
            }
        }
    }
</script>