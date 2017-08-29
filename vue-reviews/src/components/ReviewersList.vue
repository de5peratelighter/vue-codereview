<template>
    <md-layout md-flex="15" class="c-stretch padding40p">
        <div>
            
            <div class="md-headline">
                <md-button @click="showElement('reviewersInput')">
                    <md-icon>supervisor_account</md-icon>
                    Reviewers
                </md-button>
            </div>
            
            <md-list :class="{ hidden: hiddenInputs.reviewersInput }">
                <md-list-item v-for="(reviewer,index) in revs" :key="index">
                    <span>{{index}}. {{reviewer}}</span> 
                    <md-button @click="updateListInDB(index, 'remove', 'all')" class="md-icon-button md-list-action"> 
                       <md-icon>delete</md-icon>
                    </md-button>
                </md-list-item>
                <md-input-container>
                    <label for="reviewers__list__addnew">{{newReviewerMessage}}</label>
                    <md-input id="reviewers__list__addnew" v-model="newReviewerInput"></md-input>
                    <md-button @click="updateListInDB(newReviewerInput, 'add', 'all')" class="md-icon-button"> 
                       Add
                    </md-button>
                </md-input-container>
            </md-list>
            
        </div>
        
        <div>
            
            <div class="md-headline">
                <md-button @click="showElement('holidaysInput')">
                    <md-icon>weekend</md-icon>
                    Holidays
                </md-button>
            </div>
            
            <md-list :class="{ hidden: hiddenInputs.holidaysInput }">
                <md-list-item v-for="(holiday,index) in holies" :key="index">
                    <span>{{index}}. {{holiday}}</span> 
                    <md-button @click="updateListInDB(index, 'remove', 'holidays')" class="md-icon-button md-list-action"> 
                       <md-icon>delete</md-icon>
                    </md-button>
                </md-list-item>
                <md-input-container>
                    <label for="holidays__list__addnew">{{newHolidayMessage}}</label>
                    <md-input id="holidays__list__addnew" v-model="newHolidayInput"></md-input>
                    <md-button @click="updateListInDB(newHolidayInput, 'add', 'holidays')" class="md-icon-button"> 
                       Add
                    </md-button>
                </md-input-container>
            </md-list>
            
        </div>
        
    </md-layout>
</template>

<script>
    import firebase from 'firebase'
    import { FBApp } from '@/data/firebase-config'
    var provider = new firebase.auth.GoogleAuthProvider()
    
    import {GET_REVIEWERS, GET_HOLIDAYS} from '@/data/mutation-types'
    import {mapActions, mapGetters } from 'vuex'
    
    export default {
       name: 'ReviewersList', 
       data () {
           return {
                newReviewerMessage : 'Add reviewer',
                newHolidayMessage :'New Holiday',
                newReviewerInput : '',
                newHolidayInput : '',
                hiddenInputs : {
                    reviewersInput : true,
                    holidaysInput : true
                }
           }
       },
       computed : {
            ...mapGetters(['activeUserGetter','firebasePathGetter', 'holidaysGetter', 'revsGetter', 'revPerDayGetter', 'revScheduleDaysGetter']),
            holidays () {
                if (this.$store.state.holidays) {
                    return this.$store.state.holidays.split(',')
                } else return []
            },
            revs () {
                return this.revsGetter
            },
            holies () {
                return this.holidaysGetter
            },
            year () {
                return this.$store.state.currentYear
            },
            nowDate () {
                return this.$store.state.eventAppDate
            },
       },
       firebase: {},
       methods : {
           ...mapActions([GET_REVIEWERS,GET_HOLIDAYS]),
            updateListInDB (el, action, path) {
                let dater = this.$moment(el, 'MMMM D')
                let lister = path === 'all' ? Object.values(this.revs) : path === 'holidays' ? Object.values(this.holies) : []
                let allowUpdating =  false
                if (action === "remove" && lister) {
                    lister.splice(el,1)
                    allowUpdating = path === 'holidays' || path === 'all'
                    if (allowUpdating) {
                        FBApp.ref(this.firebasePathGetter.reviewers+'/' + path).set(lister.join(',')).then(()=> {
                            if (path === 'holidays') { this[GET_HOLIDAYS](lister.join(',')) } else if (path = 'all') { this[GET_REVIEWERS](lister.join(',')) }
                        })
                    }
                } else if (action === "add" && lister) {
                    lister = lister + "," + el
                    allowUpdating = path === 'holidays' ? (this.validateDate(dater) && this.holidaysGetter && el) : path === 'all' ? el  : false
                    if (allowUpdating) {
                        FBApp.ref(this.firebasePathGetter.reviewers+'/' + path).set(lister).then(()=> {
                            if (path === 'holidays') { this[GET_HOLIDAYS](lister) } else if (path = 'all') { this[GET_REVIEWERS](lister) }
                        })
                    }
                    this.newReviewerInput = ''
                    this.newHolidayInput = ''
                }
                
                if (allowUpdating) {
                    this.rescheduleData(this.revsGetter, this.lastIndex)
                }
                
            },
            rescheduleData (newCount, lastInd) {
                    
                let lastIndVal = lastInd[0]['.value']
                let lastIndKey = lastInd[0]['.key']
                
                let reviewerIndex = Number(lastIndVal.split(',').pop())
                let reviewers = newCount
                let resultData = { [lastIndKey] : lastIndVal } // initiate new resulting object with the last instance
                
                for (let i=1;i<=this.revScheduleDaysGetter;i++) {
                    
                    let nextDay = this.$moment(this.nowDate).add(i,'days')
                    let holiday = this.holidays.find(el => this.$moment(el, 'MMMM D').isSame(nextDay, 'day'))

                    if (nextDay.day() > 0 && nextDay.day()<6 && !holiday) { // check for weekend and holidays, holidays will be another FB instance soon
                    
                        var nextDayF = nextDay.format('YYYY-MM-DD')
                        
                        let newStr = ""
                        for (let j=1; j<=this.revPerDayGetter;j++) {
                            reviewerIndex = reviewerIndex >= Object.keys(reviewers).length-1 ? 0 : reviewerIndex+1
                            newStr += reviewers[reviewerIndex]+','
                            if (j===this.revPerDayGetter) newStr += String(reviewerIndex)
                        }
                        resultData[nextDayF] = newStr
                    
                    }
                    
                }
                if (resultData) {
                    //  && !this.$moment(this.lastIndex[0]['.key']).isSameOrAfter(this.$moment(dater))
                    console.warn('New schedule',resultData )
                    FBApp.ref(this.firebasePathGetter.schedule).update(resultData)
                }
                    
            },
            validateDate (el ) {
                return el.isValid() && (Number(el.format('YYYY')) === this.year)
            },
            showElement (el) {
                this.hiddenInputs[el] = !this.hiddenInputs[el]
            },
            updateUiValues (el) {
                
                if (!el.isAnonymous) {
                    
                    this.$bindAsArray('lastIndex', FBApp.ref(this.firebasePathGetter.schedule).limitToLast(1), null, () => {
                        // Generating new instances on first PM login on Mondays(or on last found DB instance as of Today)
                        if (this.$moment(this.lastIndex[0]['.key']).isSameOrBefore(this.nowDate,'day') || this.$moment(this.nowDate).day() === 1) {
                            this.rescheduleData(this.revsGetter, this.lastIndex)
                        }
                    })
                
                }
                
            }
        },
        watch : {
            activeUserGetter (newCount, oldCount) {
                this.updateUiValues(newCount.isAnonymous)
            }
        },
        mounted () {
            this.updateUiValues(this.activeUserGetter.isAnonymous)
        }
    }
</script>
<style scoped>
    .padding40p {
        padding: 40px 3px;
    }
</style>