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
                <md-list-item v-for="(el,i) in revs" :key="i">
                    <span>{{i}}. {{el}}</span> 
                    <md-button @click="updateListInDB(i, 'remove', 'all')" class="md-icon-button md-list-action"> 
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
                <md-button @click="showElement('ondutyNAInput')">
                    <md-icon>supervisor_account</md-icon>
                    OnDuty NA
                </md-button>
            </div>
            
            <md-list :class="{ hidden: hiddenInputs.ondutyNAInput }">
                <md-list-item v-for="(el,i) in onDutiesNA" :key="i">
                    <span>{{i}}. {{el}}</span> 
                    <md-button @click="updateListInDB(i, 'remove', 'duty/NA')" class="md-icon-button md-list-action"> 
                       <md-icon>delete</md-icon>
                    </md-button>
                </md-list-item>
                <md-input-container>
                    <label for="reviewers__list__addnew">{{newOndutyNAMessage}}</label>
                    <md-input id="reviewers__list__addnew" v-model="newOndutyNAInput"></md-input>
                    <md-button @click="updateListInDB(newOndutyNAInput, 'add', 'duty/NA')" class="md-icon-button"> 
                       Add
                    </md-button>
                </md-input-container>
            </md-list>
            
        </div>

        <div>
            
            <div class="md-headline">
                <md-button @click="showElement('ondutyEMEAInput')">
                    <md-icon>supervisor_account</md-icon>
                    OnDuty EMEA
                </md-button>
            </div>
            
            <md-list :class="{ hidden: hiddenInputs.ondutyEMEAInput }">
                <md-list-item v-for="(el,i) in onDutiesEMEA" :key="i">
                    <span>{{i}}. {{el}}</span> 
                    <md-button @click="updateListInDB(i, 'remove', 'duty/EMEA')" class="md-icon-button md-list-action"> 
                       <md-icon>delete</md-icon>
                    </md-button>
                </md-list-item>
                <md-input-container>
                    <label for="reviewers__list__addnew">{{newOndutyEMEAMessage}}</label>
                    <md-input id="reviewers__list__addnew" v-model="newOndutyEMEAInput"></md-input>
                    <md-button @click="updateListInDB(newOndutyEMEAInput, 'add', 'duty/EMEA')" class="md-icon-button"> 
                       Add
                    </md-button>
                </md-input-container>
            </md-list>
            
        </div>

        <div>
            
            <div class="md-headline">
                <md-button @click="showElement('parsingInput')">
                    <md-icon>supervisor_account</md-icon>
                    Parsing
                </md-button>
            </div>
            
            <md-list :class="{ hidden: hiddenInputs.parsingInput }">
                <md-list-item v-for="(el,i) in parsingGuys" :key="i">
                    <span>{{i}}. {{el}}</span> 
                    <md-button @click="updateListInDB(i, 'remove', 'parsing')" class="md-icon-button md-list-action"> 
                       <md-icon>delete</md-icon>
                    </md-button>
                </md-list-item>
                <md-input-container>
                    <label for="reviewers__list__addnew">{{newParsingMessage}}</label>
                    <md-input id="reviewers__list__addnew" v-model="newParsingInput"></md-input>
                    <md-button @click="updateListInDB(newParsingInput, 'add', 'parsing')" class="md-icon-button"> 
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
                <md-list-item v-for="(el,i) in holies" :key="i">
                    <span>{{i}}. {{el}}</span> 
                    <md-button @click="updateListInDB(i, 'remove', 'holidays')" class="md-icon-button md-list-action"> 
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

        <div>
            <div class="md-headline">
                <md-button class="md-raised md-primary" @click="rescheduleAll" :disabled="!readyToUpdateAll">
                    <md-icon>supervisor_account</md-icon>
                    Update all
                </md-button>
                <div v-if="updateAllStarted">
                    <md-list-item v-for="(item,i) in updateAllList" :key="i">
                        <span v-text="item.status === 1 ? item.updatedText : item.status === 2 ? item.noupdatedText : item.updatingText" />
                    </md-list-item>
                    <md-button class="md-raised md-primary" @click="updateAllStarted = false">
                        OK
                    </md-button>
                </div>
            </div>
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
            weeksToRescheduleNum: 4,
            newReviewerMessage : 'Add reviewer',
            newHolidayMessage :'New Holiday',
            newOndutyNAMessage: 'New on-duty NA',
            newOndutyEMEAMessage: 'New on-duty EMEA',
            newParsingMessage: 'New parsing guy',
            newReviewerInput : '',
            newOndutyNAInput: '',
            newOndutyEMEAInput: '',
            newParsingInput: '',
            newHolidayInput : '',
            hiddenInputs : {
                reviewersInput : true,
                holidaysInput : true,
                ondutyNAInput:  true,
                ondutyEMEAInput:  true,
                parsingInput: true
            },
            updateAllStarted : false,
            updateAllList : {
                onDuty: {
                    updatingText: 'Updating onduty',
                    updatedText: '+ Onduty updated',
                    noupdatedText: '- Onduty NOT updated',
                    status: 0
                },
                parsing: {
                    updatingText: 'Updating parsers',
                    updatedText: '+ Parsers updated',
                    noupdatedText: '- Parsers NOT updated',
                    status: 0
                }
            }
           }
        },
       computed : {
            ...mapGetters(['activeUserGetter','firebasePathGetter', 'holidaysGetter', 'revsGetter', 'onDutyGetterNA', 'onDutyGetterEMEA', 'revPerDayGetter', 'revScheduleDaysGetter', 'parsingTeamGetter','currentOnDutyGetter','currentParserGetter']),
            holidays () {
                if (this.$store.state.holidays) {
                    return this.$store.state.holidays.split(',')
                } else return []
            },
            revs () {
                return this.revsGetter
            },
            onDutiesNA () {
                return this.onDutyGetterNA
            },
            onDutiesEMEA () {
                return this.onDutyGetterEMEA
            },
            parsingGuys () {
                return this.parsingTeamGetter
            },
            holies () {
                return this.holidaysGetter
            },
            year () {
                return this.$store.state.currentYear
            },
            readyToUpdateAll () {
                return !!this.currentOnDutyGetter['NA'] && !!this.currentOnDutyGetter['EMEA']&& !!this.currentParserGetter
            }
        },
        firebase: {},
        methods : {
            ...mapActions([GET_REVIEWERS,GET_HOLIDAYS]),
            rescheduleAll () {
                this.updateAllStarted = true
                this.rescheduleMinor("onDuty",this.onDutiesNA, this.currentOnDutyGetter['NA'],'NA')
                this.rescheduleMinor("onDuty",this.onDutiesEMEA, this.currentOnDutyGetter['EMEA'],'EMEA')
                this.rescheduleMinor("parsing",this.parsingGuys, this.currentParserGetter)
            },
            updateListInDB (el, action, path) {
                let dater = this.$moment(el, 'MMMM D')
                let lister = path === 'all' ? Object.values(this.revs) : path === 'holidays' ? Object.values(this.holies) : path === 'duty/NA' ? Object.values(this.onDutiesNA) : path === 'duty/EMEA' ? Object.values(this.onDutiesEMEA) : path === 'parsing' ? Object.values(this.parsingGuys) : []
                let allowUpdating =  false
                if (action === "remove" && lister) {
                    lister.splice(el,1)
                    allowUpdating = path === 'holidays' || path === 'all' || path === 'duty/NA' || path === 'duty/EMEA' || path === 'parsing'
                    if (allowUpdating) {
                        FBApp.ref(this.firebasePathGetter.reviewers+'/' + path).set(lister.join(',')).then(()=> {
                            if (path === 'holidays') { this[GET_HOLIDAYS](lister.join(',')) } else if (path === 'all') { this[GET_REVIEWERS](lister.join(',')) } else if (path === 'duty/NA') {
                            this.rescheduleMinor('onDuty', this.onDutiesNA, this.currentOnDutyGetter['NA'],'NA')
                            } else if (path === 'duty/EMEA') {
                            this.rescheduleMinor('onDuty', this.onDutiesEMEA, this.currentOnDutyGetter['EMEA'],'EMEA')
                            } else if (path === 'parsing') {
                                this.rescheduleMinor(path,this.parsingGuys, this.currentParserGetter)
                            }
                        })
                    }
                } else if (action === "add" && lister) {
                    lister = lister + "," + el
                    allowUpdating = path === 'holidays' ? (this.validateDate(dater) && this.holidaysGetter && el) : path === 'all' ? el : path === 'duty/NA' ? el : path === 'duty/EMEA' ? el : path === 'parsing' ? el : false
                    if (allowUpdating) {
                        FBApp.ref(this.firebasePathGetter.reviewers+'/' + path).set(lister).then(()=> {
                            if (path === 'holidays') { this[GET_HOLIDAYS](lister) } else if (path === 'all') { this[GET_REVIEWERS](lister) } else if (path === 'duty/NA') {
                            this.rescheduleMinor('onDuty', this.onDutiesNA, this.currentOnDutyGetter['NA'],'NA')
                            } else if (path === 'duty/EMEA') {
                            this.rescheduleMinor('onDuty', this.onDutiesEMEA, this.currentOnDutyGetter['EMEA'],'EMEA')
                            } else if (path === 'parsing') {
                                this.rescheduleMinor(path,this.parsingGuys, this.currentParserGetter)
                            }
                        })
                    }
                    this.newReviewerInput = ''
                    this.newHolidayInput = ''
                    this.newOndutyInput = ''
                    this.newParsingInput = ''
                }
                
                if (allowUpdating && (path === 'holidays' || path === 'all')) {
                    
                    this.$bindAsObject('todayRevs', FBApp.ref(this.firebasePathGetter.schedule).child(this.$moment().format('YYYY-MM-DD')), null, () => {
                        this.rescheduleData(this.revsGetter, this.todayRevs)
                    })
                    
                }
                
            },
            rescheduleMinor (path,ar,current,region) {
                let currentWeek = this.$moment().isoWeek()

                let currentEngineerIndex = 0
                let engineersCount = Object.keys(ar).length
                let finalData = {}

                for (let engineer in ar) {
                    if (ar[engineer] === current) {
                        currentEngineerIndex = engineer
                    }
                }

                for (let i = 0; i < this.weeksToRescheduleNum; i++) {
                    finalData[currentWeek++] = ar[currentEngineerIndex]
                    if (currentEngineerIndex >= engineersCount - 1) {
                        currentEngineerIndex = 0;
                    } else {
                        currentEngineerIndex++;
                    }
                }
                if (Object.keys(finalData).length) {
                    FBApp.ref(`${this.firebasePathGetter[path]}/${this.$moment().get('year')}${region ? ('/' + region) : ''}`).update(finalData).then(() => {this.updateAllList[path].status = 1})
                    .catch((er)=> {console.error(er); this.updateAllList[path].status = 2})
                } else {
                    this.updateAllList[path].status = 2
                }

            },
            rescheduleData (newCount, lastInd) {
                    
                let lastIndVal = lastInd['.value']
                let lastIndKey = lastInd['.key']
                
                let reviewerIndex = Number(lastIndVal.split(',').pop())
                let reviewers = newCount
                let resultData = { [lastIndKey] : lastIndVal } // initiate new resulting object with the last instance
                
                for (let i=1;i<=this.revScheduleDaysGetter;i++) {
                    
                    let nextDay = this.$moment().add(i,'days')
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
                    //  && !this.$moment(this.lastIndex[0]['.key']).isSameOrAfter(this.$moment(resultData[resultData.length - 1]))
                    console.warn('New schedule',resultData, this.lastIndex[0]['.key'])
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
                if (!el) {
                    this.$bindAsArray('lastIndex', FBApp.ref(this.firebasePathGetter.schedule).limitToLast(1), null, () => {})
                }
                
            }
        },
        watch : {
            activeUserGetter : {
                handler(newVal) {
                    this.updateUiValues(newVal.isAnonymous)
                },
                immediate: true // triggers watcher immediately upon render/activation
            }
        }
    }
</script>
<style scoped>
    .padding40p {
        padding: 40px 3px;
    }
</style>