<template>
    <md-layout md-flex="15" class="c-stretch" v-if="!activeUserGetter.isAnonymous">
        <div class="md-title">
            
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
    import FBApp from '@/data/firebase-config'
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
            ...mapGetters(['activeUserGetter','firebasePathGetter', 'holidaysGetter', 'revsGetter']),
            revs () {
                return this.revsGetter
            },
            holies () {
                return this.holidaysGetter
            },
            year () {
                return this.$store.state.currentYear
            },
       },
       firebase: {},
       methods : {
           ...mapActions([GET_REVIEWERS,GET_HOLIDAYS]),
            updateListInDB (el, action, path) {
                let dater = this.$moment(el, 'MMMM D')
                let lister = this.reviewers[path]
                let allowUpdating =  false
                if (action === "remove") {
                    lister = lister.split(',')
                    lister.splice(el,1)
                    allowUpdating = path === 'holidays' || path === 'all'
                    if (allowUpdating) {
                        FBApp.ref(this.firebasePathGetter.reviewers+'/' + path).set(lister.join(',')).then(()=> {
                            if (path === 'holidays') { this[GET_HOLIDAYS](lister.join(',')) } else if (path = 'all') { this[GET_REVIEWERS](lister.join(',')) }
                        })
                    }
                } else if (action === "add") {
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
            },
            validateDate (el ) {
                return el.isValid() && (Number(el.format('YYYY')) === this.year)
            },
            showElement (el) {
                this.hiddenInputs[el] = !this.hiddenInputs[el]
            }
        },
        watch : {
            activeUserGetter (newCount, oldCount) {
              if (!newCount.isAnonymous) {
                  this.$bindAsObject('reviewers', FBApp.ref(this.firebasePathGetter.reviewers),null, () => {
                      this[GET_REVIEWERS](this.reviewers['all'])
                      this[GET_HOLIDAYS](this.reviewers['holidays'])
                  })
              } else {
                  this[GET_HOLIDAYS](String())
                  this[GET_REVIEWERS](String())
              }
            }
        },
        mounted () {
            if (!this.activeUserGetter.isAnonymous) {
                this.$bindAsObject('reviewers', FBApp.ref(this.firebasePathGetter.reviewers),null, () => {
                    this[GET_REVIEWERS](this.reviewers['all'])
                    this[GET_HOLIDAYS](this.reviewers['holidays'])
                })
            }
        }
    }
</script>