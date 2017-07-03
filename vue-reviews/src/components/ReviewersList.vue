<template>
    <md-layout>
        
        <md-layout v-for="(item, index) in anArray" :key="index">
            <md-input-container>
                <label :for="item['.key']">{{item['.key']}}</label>
                <md-input :id="item['.key']" v-model="item['.value']"></md-input>
            </md-input-container>
        </md-layout>
        
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
           ...mapGetters(['activeUserGetter','firebasePathGetter'])
       },
       firebase: {},
       created () {
           
        this.$bindAsArray('anArray', FBApp.ref(this.firebasePathGetter.reviewers))
        console.log(this.anArray)

       }
    }
</script>