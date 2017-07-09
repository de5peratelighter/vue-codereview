<template>
        <md-list>
            <md-list-item v-for="(reviewer,index) in lister" :key="index">
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

        <!--<md-layout v-for="(reviewer, index) in reviewers" :key="index">-->
            <!--<md-input-container>-->
            <!--    <label :for="reviewer['.key']">{{reviewer}}</label>-->
            <!--    <md-input :id="reviewer['.key']" v-model="reviewer['.value']"></md-input>-->
            <!--</md-input-container>-->
        <!--</md-layout>-->
        
</template>

<script>
    import firebase from 'firebase'
    import FBApp from './../data/firebase-config'
    
    var provider = new firebase.auth.GoogleAuthProvider();
    
    import {GET_FBASE} from './../data/mutation-types'
    import {mapActions, mapGetters } from 'vuex'
    
    export default {
       name: 'ReviewersList', 
       data () {
           return {
               newReviewerMessage : "Add reviewer",
               newReviewerInput : ''
           }
       },
       computed : {
            ...mapGetters(['activeUserGetter','firebasePathGetter']),
            lister () {
                return this.reviewers ? this.splitReviewers(this.reviewers) : []
            }
       },
       methods : {
            splitReviewers (ar) {
                let obj = {}
                // console.log('what',ar,this.reviewers['.value'] )
                if (ar['.value']) {                
                    ar['.value'].split(',').forEach((el, i)=> {
                        obj[i] = el
                    }) 
                    return obj
                }
            },
            updateReviewerList (el,action) {
                let lister = this.reviewers['.value'];
                
                if (action === "remove") {
                    lister = lister.split(',')  
                    lister.splice(el,1)
                    FBApp.ref(this.firebasePathGetter.reviewers).set(lister.join(','))
                } else if (action === "add") {
                     FBApp.ref(this.firebasePathGetter.reviewers).set(lister + ',' + el)
                    this.newReviewerInput = ''
                }
            }
       },
       firebase: {},
       created () {
            this.$bindAsObject('reviewers', FBApp.ref(this.firebasePathGetter.reviewers) )
       }
    }
</script>