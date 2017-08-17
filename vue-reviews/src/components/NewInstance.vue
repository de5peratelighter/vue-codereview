<template>
    <div class="c-main-section">
    
        <md-layout>
            <md-layout v-for="(item, index) in inputs" :key="index">
                <md-input-container>
                    <label :for="item.id">{{item.label}}</label>
                    <md-input :id="item.id" v-model="item.val" :required="item.required" :maxlength="item.maxLength"></md-input>
                </md-input-container>
            </md-layout>
            <md-layout md-flex="15">
                <md-button class="md-raised md-accent" :disabled="disableSubmit" @click="submitData(activeUserGetter, $event)">Submit</md-button>
                <md-button class="md-raised" @click="clearData">Clear</md-button>
            </md-layout>
        </md-layout>
        
        <md-layout v-if="relcomponent === 'codereview'" md-align="center" md-vertical-align="center">
            <div>Today reviewers:
                <span class="md-subheading" v-for="(item,index) in reviewers" :key="index">
                {{item}}
                </span>
            </div>
            <div>
                <md-button id="guidelinesDialog" @click="openDialog('guidelinesDialog')"> Code review guidelines </md-button>
                <md-dialog md-open-from="guidelinesDialog" md-close-to="guidelinesDialog" ref="guidelinesDialog"> <!-- String(key) removes dialog undefined bug with the zero-index key -->
                    <code-guidelines></code-guidelines>
                </md-dialog>
            </div>
        </md-layout>
    
    </div>
</template>

<script>
    import firebase from 'firebase'
    import { FBApp } from '@/data/firebase-config'
    var provider = new firebase.auth.GoogleAuthProvider();
    import { levelMixin } from '@/mixins/restrictions'
    import {GET_TODAYREVIEWERS} from '@/data/mutation-types'
    import {mapActions, mapGetters } from 'vuex'
    import { notificationMixin } from '@/mixins/notifications'
    const CodeGuidelines = () => import('@/components/CodeGuidelines.vue')
    
    export default {
        mixins: [levelMixin, notificationMixin],
        props : ['inputs','requiredword', 'path', 'relcomponent'],
        data () {
            return {
                inputsInvalid : true,
                reviewers : [],
                workingHours : ['10,11,12' , '13,14,15' , '16,17']
            }
        },
        computed : {
            ...mapGetters(['activeUserGetter','firebasePathGetter']),
            disableSubmit () {
                return this.inputsInvalid
            },
            today () {
              return this.$store.state.eventAppDate
            },
        },
        watch: {
            inputs : {
                handler(after, before) {
                    let stater = after.every((el) => (el.required && !el.val.includes(this.requiredword)) ? false : true)
                    this.inputsInvalid = stater ? false : true
                },
                deep: true
            }
          },
        methods : {
            ...mapActions([GET_TODAYREVIEWERS]),
            openDialog (ref) {
                this.$refs[ref].open()
            },
            submitData (user, el) {
                if (this.inputsInvalid) {
                    el.target.setAttribute('disabled', this.inputsInvalid)
                    
                } else if (!user.isAnonymous && this.levelEngineer(user.role) && this.path) {
                    
                    // relcomponent indicates the component that is relevant for our concrete newInstance component
                    if (this.relcomponent === 'codereview') {
                        
                        let newData = {
                            username: user.alias,
                            si:  user.photoURL,
                            content: this.inputs[0].val,
                            ticket: this.inputs[1].val,
                            status: 'New',
                            reviewer: '',
                            st : this.$moment().format('DD-MM-YYYY, hh:mm:ss')
                        } 
                        if (this.inputs[2].val) { newData.comment = this.inputs[2].val }
                        
                        FBApp.ref(this.path).push(newData).then(() => {
                            let currentReviewer = this.reviewers[ this.workingHours.findIndex((el,index) => el.includes(this.$moment().hours()))]
                            
                            this.$bindAsObject('currentReviewerToken', FBApp.ref(this.firebasePathGetter.notifications+"/"+currentReviewer), null, () => {
                                if (this.currentReviewerToken) {
                                    this.submitNotification(this.currentReviewerToken, this.activeUserGetter, "informReviewer") // from 'notificationMixin'
                                }
                            })
                        })
                        
                    } else if (this.relcomponent === 'mainconfig' && this.defaultRoleOption && this.defaultTeamOption) {
                        
                        let token = this.inputs[0].val ? this.inputs[0].val : 'WrongToken'
                        let alias = this.inputs[1].val ? this.inputs[1].val : 'WrongAlias'
                        FBApp.ref(this.path +"/" + token).set({alias: alias, role : this.defaultRoleOption, team : this.defaultTeamOption})
                        
                    }
                    
                }
                
                this.clearData()
            },
            clearData (el) {
                this.inputs.map(el=> el.val = "")
            }
        },
        created () {
            if (this.relcomponent === 'codereview') {
                this.$bindAsObject('todayReviewersArray', FBApp.ref(this.firebasePathGetter.schedule).child(this.today.format('YYYY-MM-DD')), null, () => {
                    if (this.todayReviewersArray['.value']) {
                        this.reviewers = this.todayReviewersArray['.value'].split(',').slice(0,-1)
                    }
                    // start listening whether reviewers might have changed for today
                    FBApp.ref(this.firebasePathGetter.schedule).child(this.today.format('YYYY-MM-DD')).on('value', (el) => {
                        if (this.todayReviewersArray['.value']) { 
                            this.reviewers = el.val().split(',').slice(0,-1)
                        }
                    })

                })
            }
        },
        components : {
            CodeGuidelines
        }
    }
</script>
