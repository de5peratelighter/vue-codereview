<template>
    <div class="c-main-section">
        <md-layout>
            
            <reviewers-list></reviewers-list>
            <md-layout md-flex="85">
                <div style="width: 100%">
                    <md-layout md-align="end" md-vertical-align="center">
                        <span class="md-headline">Review schedule</span>
                        <current-month></current-month>
                    </md-layout>
                    <div id="day-bar">
                        <div>MON</div>
                        <div>TUE</div>
                        <div>WED</div>
                        <div>THU</div>
                        <div>FRI</div>
                        <div>SAT</div>
                        <div>SUN</div>
                    </div>
                    <div id="calendar">
                        <div v-for="week in weeks" class="calendar-week">
                            <calendar-day v-for="(day, index) in week" :day="day" :key="index" :scheduler="activeUserGetter.isAnonymous ? '' : schedule[day.format('YYYY-MM-DD')]">
                            </calendar-day>
                        </div>
                    </div>
                </div>
            </md-layout>
        </md-layout>
    </div>
</template>

<script>
import firebase from 'firebase'
import FBApp from '@/data/firebase-config'

var provider = new firebase.auth.GoogleAuthProvider();

import {GET_FBASE, GET_REVIEWERS} from '@/data/mutation-types'
import {mapActions, mapGetters } from 'vuex'
    
import CalendarDay from './CalendarDay.vue'
import CurrentMonth from './CurrentMonth.vue'
import ReviewersList from './ReviewersList.vue'
export default {
    name: 'Reviewers',
    firebase: {},
    methods : {
        lister (el) {
            if (el) {
                return el
            }
        },
        ...mapActions([GET_REVIEWERS])
    },
    data () {
        return {
            daysLimit : 10,
            holidays : ["2017-07-14"]
        }
    },
    computed : {
        ...mapGetters(['activeUserGetter','firebasePathGetter','reviewersGetter','holidaysGetter', 'revPerDayGetter']),
        // holidays () {
        //     if (this.$store.state.holidays) {
        //         return
        //     } else {
        //         return []
        //     }
        // },
        nowDate () {
            return this.$store.state.eventAppDate
        },
        month () {
            return this.$store.state.currentMonth
        },
        year () {
            return this.$store.state.currentYear
        },
        days () {
            // Generate days in the current month
            let days = [];
            let currentDay = this.$moment(`${this.year}-${this.month}-1`, 'YYYY-M-D')
            do {
                days.push(currentDay);
                currentDay = this.$moment(currentDay).add(1,'days')
            } while ((currentDay.month() + 1) === this.month)
            // Add previous days to beginning
            currentDay = this.$moment(days[0])
            
            const MONDAY = 1;
            const SUNDAY = 0;
            
            if (currentDay.day() !== MONDAY) {
                do {
                    currentDay = this.$moment(currentDay).subtract(1,'days')
                    days.unshift(currentDay)
                } while (currentDay.day() !== MONDAY)
            }
            
            currentDay = this.$moment(days[days.length -1])
            
            // Add next days to the end
            if (currentDay.day() !== SUNDAY) {
                do {
                    currentDay = this.$moment(currentDay).add(1,'days')
                    days.push(currentDay)
                } while (currentDay.day() !== SUNDAY)
            }
            
            return days
        },
        weeks () {
            let weeks = []
            let week = []
            
            for (let day of this.days) {
                week.push(day)
                if (week.length === 7) {
                    weeks.push(week)
                    week = []
                }
            }
            
            return weeks
        }
    },
    components : {
        CalendarDay,
        CurrentMonth,
        ReviewersList
    },
    watch : {
        activeUserGetter (newCount, oldCount) {
          if (!newCount.isAnonymous) {
              this.$bindAsObject('schedule', FBApp.ref(this.firebasePathGetter.schedule))
          }
        },
        reviewersGetter (newCount, oldCount)  {
            
          if (newCount) {
              
            // Generating new instances on first person login on Mondays(or on last found DB instance as of Today)
            this.$bindAsArray('lastIndex', FBApp.ref(this.firebasePathGetter.schedule).limitToLast(1), null, () => { 
                
                // if (this.$moment(this.lastIndex[0]['.key']).isSameOrBefore(this.nowDate,'day') || this.$moment(this.nowDate).day() === 1) {
                    
                    let laster = Number(this.lastIndex[0]['.value'].split(',').pop())
                    let reviewers = newCount.split(',')
                    let nicer = {}
                    
                    for (let i=0;i<=this.daysLimit;i++) {
                        
                        let datee = this.$moment(this.nowDate).add(i,'days')
                        let holiday = this.holidays.find(el => el===datee.format('YYYY-MM-DD') )
                        
                        if (datee.day() > 0 && datee.day()<6 && !holiday) { // check for weekend and holidays, holidays will be another FB instance soon
                        
                            var dater = datee.format('YYYY-MM-DD')
                            
                            let newStr = ""
                            for (let j=1; j<=this.revPerDayGetter;j++) {
                                
                                laster = laster >= reviewers.length-1 ? 0 : laster+1
                                
                                newStr += reviewers[laster]+','
                                if (j===this.reviewersLimit) newStr += String(laster)
                            }
                            nicer[dater] = newStr
                        
                        }
                        
                    }
                    // final verification - DONT push instances if new latest instance is the same as last in the database || if reviewer is added or removed - rebuild the schedule
                    if (nicer && !this.$moment(this.lastIndex[0]['.key']).isSameOrAfter(this.$moment(dater)) || (newCount && oldCount && (newCount != oldCount))) {
                        console.log(nicer)
                        FBApp.ref(this.firebasePathGetter.schedule).update(nicer)
                    }
                    
                // }
                
            })

          }
          
        },
    }
}
</script>
