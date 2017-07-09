<template>
    <div class="c-main-section">
        <md-layout>
            <md-layout md-flex="10" class="c-stretch">
                <div>
                    <span class="md-headline">Reviewers</span>
                    <reviewers-list></reviewers-list>
                </div>
            </md-layout>
            <md-layout md-flex="90">
                <div style="width: 100%">
                    <md-layout md-align="end" md-vertical-align="center">
                        <span class="md-headline">Vue JS Calendar</span>
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
                            <calendar-day v-for="(day, index) in week" :day="day" :key="index" :scheduler="schedule[day.format('YYYY-MM-DD')]">
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
import FBApp from './../data/firebase-config'

var provider = new firebase.auth.GoogleAuthProvider();

import {GET_FBASE} from './../data/mutation-types'
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
        }
        
    },
    data () {
        return {
            dayLimit : 3
        }
    },
    computed : {
        ...mapGetters(['activeUserGetter','firebasePathGetter']),
        reviews () {
            return this.reviewers ? this.reviewers['.value'] : ''
        },
        nowDate () {
            return  this.$store.state.eventFormDate
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
        reviews (newVal,oldVal) {
            console.log(newVal,oldVal)
        }
    },
    created () {
        
        this.$bindAsObject('reviewers', FBApp.ref(this.firebasePathGetter.reviewers))
        
        this.$bindAsObject('schedule', FBApp.ref(this.firebasePathGetter.schedule))
    

        this.$bindAsArray('lastIndex', FBApp.ref(this.firebasePathGetter.schedule).limitToLast(1), null, () => { 
            
            if (this.$moment(this.lastIndex[0]['.key']).isSameOrBefore(this.nowDate,'day')) {
                
                // console.log('VALUES:', this.lastIndex[0]['.value'].split(',').pop())
                
                let laster = Number(this.lastIndex[0]['.value'].split(',').pop())
                let reviewers = this.reviewers['.value'].split(',')
                let nicer = {}
                
                // this.nowDate is wrapped into Moment once again for proper comperison with itself 
                if (this.$moment(this.nowDate).startOf('week').isSame(this.$moment(this.nowDate),'day'))  { // isoWeek
                
                    for (let i=1;i<=14;i++) {
                        
                        let datee = this.$moment(this.nowDate).add(i,'days')
                        let dater = datee.format('YYYY-MM-DD')
                        
                        let newStr = ""
                        for (let j=1; j<=this.dayLimit;j++) {
                            
                            laster = laster >= reviewers.length-1 ? 0 : laster+1
                            
                            newStr += reviewers[laster]+','
                            if (j===this.dayLimit) newStr += String(laster)
                        }
                        nicer[dater] = newStr
                        
                    }
                    if (nicer) {
                        console.log(nicer, reviewers[laster])
                        FBApp.ref(this.firebasePathGetter.schedule).update(nicer)
                        // this.$bindAsArray('schedule', FBApp.ref(this.firebasePathGetter.schedule).update(nicer) )
                    }
                
                }
                
            }
            
        })

    }
}
</script>
