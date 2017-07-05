<template>
    <div class="c-main-section">
        <md-layout>
            <md-layout md-flex="10">
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
    computed : {
        ...mapGetters(['activeUserGetter','firebasePathGetter']),
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
    created () {
        
        this.$bindAsArray('lastIndex', FBApp.ref(this.firebasePathGetter.schedule).limitToLast(1), null, () => { 
            
            
            if (this.$moment(this.lastIndex['.key']).isSameOrBefore(this.nowDate,'day')) {
                
            }
 
            
            // console.log('last index found', this.$moment(Object.keys(this.lastIndex)[0]).isSameOrBefore(this.nowDate,'day'), Object.values(this.lastIndex)[0]  )      
            
             console.log('last index found', this.lastIndex, this.$moment(this.lastIndex['.key']).isSameOrBefore(this.nowDate,'day')  )    
            
            // (this.$moment(this.lastIndex)).isSame(this.nowDate,'day')
            
        })

        
        this.$bindAsObject('schedule', FBApp.ref(this.firebasePathGetter.schedule), null, () => { console.log('Ready fired!', this.schedule) })
    }
}
</script>