<template>
    <div>
        <md-tabs md-fixed md-centered>
           <md-tab v-for="(topic,label,index) in guides" :id="label" :md-label="label" :key="index">

                <template>
                    <p v-for="(rule,k,i) in topic">
                        {{rule.val}}
                        <md-tooltip md-direction="top">Added {{showAddedDate(Object.keys(topic)[0])}}</md-tooltip>
                    </p>
                </template>
                
            </md-tab>
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
        mixins: [levelMixin],
        methods : {
            showAddedDate (el) {
                return this.$moment(Number(el)).format("DD-MMM-YY")
            },
        },
        created () {
            this.$bindAsObject('guidelines', FBApp.ref(this.firebasePathGetter.guidelines), null, () => {
                this.guides = this.guidelines
                FBApp.ref(this.firebasePathGetter.guidelines).on('value', (el) => {
                    this.guides = el.val()
                })
                
            })
        }
    }
</script>
<style scoped>
    p { margin: 3px 0}
    p:hover {
        transition: all 0.3s ease-in;
        background: rgba(242,130,10,.15)
    }
</style>