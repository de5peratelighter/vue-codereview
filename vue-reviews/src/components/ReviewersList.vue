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
                    <md-button @click="updateHolidayList(index, 'remove')" class="md-icon-button md-list-action"> 
                       <md-icon>delete</md-icon>
                    </md-button>
                </md-list-item>
                <md-input-container>
                    <label for="holidays__list__addnew">{{newHolidayMessage}}</label>
                    <md-input id="holidays__list__addnew" v-model="newHolidayInput"></md-input>
                    <md-button @click="updateHolidayList(newHolidayInput, 'add')" class="md-icon-button"> 
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
    
    var provider = new firebase.auth.GoogleAuthProvider();
    
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
            ...mapGetters(['activeUserGetter','firebasePathGetter']),
            revs () {
                let ar = this.reviewers ? this.reviewers['all'] : ''
                let obj = {}
                if (ar) {  
                    ar.split(',').forEach((el, i)=> {obj[i] = el}) 
                    return obj
                }
            },
            holies () {
                let ar = this.reviewers ? this.reviewers['holidays'] : ''
                let obj = {}
                if (ar) {  
                    ar.split(',').forEach((el, i)=> {
                        console.log(this.$moment(el, 'MMMM D'))
                        obj[i] = el
                        
                    }) 
                    return obj
                }
            },
            year () {
                return this.$store.state.currentYear
            },
       },
       firebase: {},
       methods : {
           ...mapActions([GET_REVIEWERS,GET_HOLIDAYS]),
            updateReviewerList (el,action) {
                let lister = this.reviewers['all']
                if (action === "remove") {
                    lister = lister.split(',')  
                    lister.splice(el,1)
                    FBApp.ref(this.firebasePathGetter.reviewers+'/all').set(lister.join(',')).then(()=> {this[GET_REVIEWERS](lister.join(',')) })
                } else if (action === "add") {
                    lister = lister + "," + el
                    FBApp.ref(this.firebasePathGetter.reviewers+'/all').set(lister).then(()=> {this[GET_REVIEWERS](lister)})
                    this.newReviewerInput = ''
                }
            },
            updateHolidayList (el, action) {
                let dater = this.$moment(el, 'MMMM D')
                let lister = this.reviewers['holidays']
                if (action === "remove") {
                    lister = lister.split(',')
                    lister.splice(el,1)
                    FBApp.ref(this.firebasePathGetter.reviewers+'/holidays').set(lister.join(',')).then(()=> {this[GET_HOLIDAYS](lister.join(',')) })
                } else if (action === "add" && this.validateDate(dater) ) {
                    lister = lister + "," + el
                    FBApp.ref(this.firebasePathGetter.reviewers+'/holidays').set(lister).then(()=> {this[GET_HOLIDAYS](lister)})
                }
                this.newHolidayInput = ''
            },
            validateDate (el ) {
                return el.isValid() && (Number(el.format('YYYY')) === this.year)
            },
            showElement (el) {
                this.hiddenInputs[el] = !this.hiddenInputs[el]
            },
       },
        watch : {
            activeUserGetter (newCount, oldCount) {
              if (!newCount.isAnonymous) {
                  this.$bindAsObject('reviewers', FBApp.ref(this.firebasePathGetter.reviewers),null, () => {
                    //   console.log(this.reviewers['all'], this.reviewers['holidays'])
                      this[GET_REVIEWERS](this.reviewers['all'])
                      this[GET_HOLIDAYS](this.reviewers['holidays'])
                  })
                  
                //   this.$bindAsObject('holidays', FBApp.ref(this.firebasePathGetter.holidays),null, () => {
                //       console.log(this.holidays['.value'])
                //     //   this[GET_HOLIDAYS](this.holidays['.value'])
                //   })
              }
            }
        }
    }
</script>