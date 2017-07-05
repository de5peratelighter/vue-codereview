<template>
    <md-layout>
        <md-list>
            <md-list-item v-for="(reviewer,index) in lister" :key="index">
                <span>{{index}}. {{reviewer}}</span> 
                <md-button @click="removeReviewer(index)" class="md-icon-button md-list-action"> 
                   <md-icon>delete</md-icon>
                </md-button>
            </md-list-item>
        </md-list>

        <!--<md-layout v-for="(reviewer, index) in reviewers" :key="index">-->
        <!--    <md-input-container>-->
        <!--        <label :for="reviewer['.key']">{{reviewer}}</label>-->
        <!--        <md-input :id="reviewer['.key']" v-model="reviewer['.value']"></md-input>-->
        <!--    </md-input-container>-->
        <!--</md-layout>-->
        
    </md-layout>
</template>

<script>
    import firebase from 'firebase'
    import FBApp from './../data/firebase-config'
    
    var provider = new firebase.auth.GoogleAuthProvider();
    
    import {GET_FBASE} from './../data/mutation-types'
    import {mapActions, mapGetters } from 'vuex'
    
    export default {
       name: 'ReviewersList', 
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
            removeReviewer (el) {
                let lister = this.reviewers['.value'].split(',')
                lister.splice(el,1)
                FBApp.ref(this.firebasePathGetter.reviewers).set(lister.join(','))
            }
       },
       firebase: {},
       created () {
            this.$bindAsObject('reviewers', FBApp.ref(this.firebasePathGetter.reviewers) )
       }
    }
</script>