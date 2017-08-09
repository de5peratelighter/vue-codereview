<template>
    <div>
        <md-tabs md-fixed md-centered>
            <template v-for="(element,index) in guides">
                <template v-if="index != '.key'">
                  <md-tab  :id="index" :md-label="index" :key="index">
                        <p v-for="(el,ind) in element">{{el}}</p>
                   </md-tab>
                </template>
           </template>
        </md-tabs>
    </div>
</template>

<script>
    import firebase from 'firebase'
    import { levelMixin } from '@/mixins/restrictions'
    import { FBApp } from '@/data/firebase-config'
    import {mapActions, mapGetters } from 'vuex'
    export default {
        name: 'CodeGuidelines',
        data () {
          return {
              guides : {}
          }
        },
        computed : {
            ...mapGetters(['activeUserGetter', 'firebasePathGetter'])
        },
        firebase: {},
        created () {
            this.$bindAsObject('guidelines', FBApp.ref(this.firebasePathGetter.guidelines), null, () => {
                this.guides = this.guidelines
                // this.$bindAsObject('todayReviewersArray', FBApp.ref(this.firebasePathGetter.schedule).child(this.today.format('YYYY-MM-DD')), null, () => {
                //   this.reviewers = this.todayReviewersArray['.value'].split(',').slice(0,-1)
                // })
            })
        }
    }
</script>