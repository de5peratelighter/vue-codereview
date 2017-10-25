<template>
    <div style="width: 100%">
        
        <md-layout>
            <md-layout v-for="(item, index) in inputs" :key="index">
                <md-input-container class="side-margin">
                    <label :for="item.id">{{item.label}}</label>
                    <md-input :id="item.id" v-model="item.val" :required="item.required" :maxlength="item.maxLength"></md-input>
                    <md-tooltip md-delay="300" md-direction="bottom">{{item.tooltip}}</md-tooltip>
                </md-input-container>
            </md-layout>
            <md-layout md-flex="15">
                <md-button class="md-raised md-accent" :disabled="disableSubmit" @click="submitData(activeUserGetter, $event)">Submit</md-button>
                <md-tooltip md-delay="300" md-direction="bottom">Push this data to Firebase</md-tooltip>
                <md-button class="md-raised" @click="clearData">Clear</md-button>
            </md-layout>
        </md-layout>
        
        <md-layout v-if="relcomponent === 'codereview'" md-align="center" md-vertical-align="center">
            <div>Today reviewers:
                <span class="md-subheading" v-for="(item,index) in reviewers" :key="index">
                {{item}}
                <md-tooltip md-delay="300x" md-direction="top"> Review hours: {{workingHoursGetter[index]}}</md-tooltip>
                </span>
            </div>
            <div v-if="levelEngineer(activeUserGetter.role)">
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
    import { levelMixin, optionsMixin } from '@/mixins/restrictions'
    import {mapActions, mapGetters } from 'vuex'
    import { notificationMixin } from '@/mixins/notifications'
    const CodeGuidelines = () => import('@/components/CodeGuidelines.vue')
    
    export default {
        mixins: [levelMixin, optionsMixin, notificationMixin],
        props : ['inputs','requiredword', 'path', 'relcomponent'],
        data () {
            return {
                inputsInvalid : true,
                reviewers : []
            }
        },
        computed : {
            ...mapGetters(['activeUserGetter','firebasePathGetter', 'workingHoursGetter', 'globalPrefixesGetter']),
            disableSubmit () {
                return this.inputsInvalid
            }
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
            openDialog (ref) {
                this.$refs[ref].open()
            },
            submitData (user, el) {
                if (this.inputsInvalid) {
                    el.target.setAttribute('disabled', this.inputsInvalid)
                    
                } else if (!user.isAnonymous && this.levelEngineer(user.role) && this.path) {
                    let inputFirst = this.inputs[0].val
                    let inputSecond = this.inputs[1].val
                    
                    // relcomponent indicates the component that is relevant for our concrete newInstance component
                    if (this.relcomponent === 'codereview') {
                        let inputThird = this.inputs[2].val
                        let prefz = this.globalPrefixesGetter
                        let newData = {
                            username: user.alias,
                            si:  user.photoURL,
                            content : prefz.changes.val ? inputFirst.replace(prefz.changes.val, '') : inputFirst,
                            ticket : prefz.changes.val ? inputSecond.replace(prefz.tickets.val, '') : inputSecond,
                            status: 'New',
                            reviewer: ''
                        }
                        if (inputThird) { newData.comment = inputThird }
                        
                        // add instance to Firebase
                        this.pushCrInstanceToFirebase(newData)
                        
                    } else if (this.relcomponent === 'mainconfig' && this.defaultRoleOption && this.defaultTeamOption) {
                        let token = inputFirst ? inputFirst : 'WrongToken'
                        let alias = inputSecond ? inputSecond : 'WrongAlias'
                        FBApp.ref(this.path +"/" + token).set({
                            alias: alias, role : this.defaultRoleOption, 
                            team : this.defaultTeamOption, tester : this.defaulttestingOption, 
                            notes : this.defaultSpecialNote
                        })
                    }
                    
                } this.clearData() // clear the inputs
            },
            pushCrInstanceToFirebase (data) {
                FBApp.ref(this.path + '/' + this.$moment().valueOf()).set(data).then(() => {
                    // if app session isn't from today
                    if (!(this.$moment(this.todayReviewersArray['.key'], 'YYYY-MM-DD').isSame(this.$moment(),'day'))) {
                        this.getTodayReviewers().then(() => {      // then get Today reviewers 
                            this.findReviewerAndSendNotification() // AND triger notification to current reviewer
                        }) 
                    } else {
                        this.findReviewerAndSendNotification() // else simply trigger notification to current reviewer
                    }
                })
            },
            clearData (el) {
                this.inputs.map(el=> el.val = "")
            },
            findReviewerAndSendNotification () {
                let currentReviewer = this.reviewers[ this.workingHoursGetter.findIndex((el,index) => el.includes(this.$moment().hours()))]
                            
                this.$bindAsObject('currentReviewerToken', FBApp.ref(this.firebasePathGetter.notifications+"/"+currentReviewer), null, () => {
                    if (this.currentReviewerToken.token) {
                        this.submitNotification(this.currentReviewerToken, this.activeUserGetter, "informReviewer") // from 'notificationMixin'
                    }
                })
                console.log('hey there')
            },
            getTodayReviewers () {
                return new Promise((resolve,reject) => { // making it a promise due to THEN statements for lazy users (whenever session is not reloaded nextday)
                  this.$bindAsObject('todayReviewersArray', FBApp.ref(this.firebasePathGetter.schedule).child(this.$moment().format('YYYY-MM-DD')), null, () => {
                        if (this.todayReviewersArray['.value']) {
                            this.reviewers = this.todayReviewersArray['.value'].split(',').slice(0,-1)
                            resolve()
                        }
                        // start listening whether reviewers might have changed for today
                        FBApp.ref(this.firebasePathGetter.schedule).child(this.$moment().format('YYYY-MM-DD')).on('value', (el) => {
                            if (this.todayReviewersArray['.value']) { 
                                this.reviewers = el.val().split(',').slice(0,-1)
                            }
                        })
    
                    })  
                })
            }
        },
        created () {
            if (this.relcomponent === 'codereview') {
                this.getTodayReviewers()
            }
        },
        components : {
            CodeGuidelines
        }
    }
</script>
<style scoped>
    .side-margin {
        margin-left: 3px;
        margin-right: 3px;
    }
</style>
