<template>
    <div class="c-main-section">
        <md-layout md-align="center">
            <reviewers-list v-if="levelTeamlead(activeUserGetter.role)"></reviewers-list>
            <md-layout md-flex="85">
                <div style="width: 100%">
                    <md-layout md-align="end" md-flex="40"> 
                        <current-month></current-month> 
                    </md-layout>
                    <div id="day-bar">
                        <div v-for="(d,key) in daysArray" :key="key">
                            {{d}}
                        </div>
                    </div>
                    <div id="calendar">
                        <div v-for="(week,ind) in weeks.weeks" class="calendar-week" :key='ind'>
                            <!-- {{nicer(weeks.nums[ind])}} -->
                             <md-layout md-align="center" v-if="onDutiesReady && currentParserGetter && levelEngineer(activeUserGetter.role)">
                                <md-layout md-flex="30" class="onduty-engineer-by-week engineer-week">OnDuty NA: {{ onDuties['NA'][`${String(weeks.nums[ind])}`] }}</md-layout>
                                <md-layout md-flex="30" class="onduty-engineer-by-week engineer-week">OnDuty EMEA: {{ onDuties['EMEA'][`${String(weeks.nums[ind])}`] }}</md-layout>
                                <md-layout md-flex="30" class="parsing-engineer-by-week engineer-week">Parser: {{ parsingGuys[`${String(weeks.nums[ind])}`] }}</md-layout>
                             </md-layout>
                             <div class="inner-week">
                                <calendar-day v-for="(day, index) in week" :day="day" :key="index" :scheduler="scheduleReady ? schedule[day.format('YYYY-MM-DD')] : ''">
                                </calendar-day>
                            </div>
                        </div>
                    </div>
                </div>
            </md-layout>
        </md-layout>
    </div>
</template>

<script>
import firebase from 'firebase'
import { FBApp } from '@/data/firebase-config'
import { levelMixin } from '@/mixins/restrictions'
import {GET_REVIEWERS, GET_HOLIDAYS,GET_ONDUTY, GET_PARSINGUYS} from '@/data/mutation-types'
import {mapActions, mapGetters } from 'vuex'
    
import CalendarDay from './CalendarDay.vue'
import CurrentMonth from './CurrentMonth.vue'
const ReviewersList = () => import('@/components/ReviewersList.vue')
export default {
    name: 'Reviewers',
    data () {
        return {
            scheduleReady : false,
            onDutiesReady: false,
            welcomeMessage : "Reviewer schedule(by days/month)",
            daysArray : ['MON','TUE','WED','THU','FRI','SAT','SUN']
        }
    },
    firebase: {},
    mixins: [levelMixin],
    methods : {
        ...mapActions([GET_REVIEWERS, GET_HOLIDAYS,GET_ONDUTY, GET_PARSINGUYS]),
        receiveScheduleData (user) {
            if (!user.isAnonymous && user.role) {
                this.$bindAsObject('reviewers', FBApp.ref(this.firebasePathGetter.reviewers),null, () => {
                    this[GET_REVIEWERS](this.reviewers['all'])
                    this[GET_HOLIDAYS](this.reviewers['holidays'])
                    this[GET_ONDUTY](this.reviewers['duty'])
                    this[GET_PARSINGUYS](this.reviewers['parsing'])

                    FBApp.ref(this.firebasePathGetter.reviewers).on('child_changed', (dataSnapshot) => {
                        if (dataSnapshot.key === 'all') {
                            this[GET_REVIEWERS](dataSnapshot.val())
                        } else if (dataSnapshot.key === 'holidays') {
                            this[GET_HOLIDAYS](dataSnapshot.val())
                        } else if (dataSnapshot.key === 'duty') {
                            this[GET_ONDUTY](dataSnapshot.val())
                        } else if (dataSnapshot.key === 'parsing') {
                            this[GET_PARSINGUYS](dataSnapshot.val())
                        }
                    })
                    
                })
                this.$bindAsObject('schedule', FBApp.ref(this.firebasePathGetter.schedule), null, () => {  this.scheduleReady = true })
                this.$bindAsObject('onDuties', FBApp.ref(this.firebasePathGetter.onDuty + '/' + this.$moment().get('year')), null, () => {this.onDutiesReady = true})
                this.$bindAsObject('parsingGuys', FBApp.ref(this.firebasePathGetter.parsing + '/' + this.$moment().get('year')), null, () => {})
            } else {
                this.scheduleReady = false;
                this[GET_HOLIDAYS](String())
                this[GET_REVIEWERS](String())
                this[GET_ONDUTY](String())
                this[GET_PARSINGUYS](String())
                FBApp.ref(this.firebasePathGetter.reviewers).ref.off('child_changed')
                this.$router.push({ path: '/' })
            }
        }
    },
    computed : {
        ...mapGetters(['activeUserGetter','firebasePathGetter','currentOnDutyGetter','currentParserGetter']),
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
            let WEEKS = {}
            let weeks = WEEKS.weeks = []
            let weekNums = WEEKS.nums = []
            let week = []
            
            for (let day of this.days) {
                week.push(day)
                if (week.length === 7) {
                    weekNums.push(this.$moment(day).isoWeek())
                    weeks.push(week)
                    week = []
                }
            }
            return WEEKS
        }
    },
    components : {
        CalendarDay,
        CurrentMonth,
        ReviewersList
    },
    watch : {
        activeUserGetter : {
            handler(newVal) {
                this.receiveScheduleData(this.activeUserGetter)
            },
            immediate: true // triggers watcher immediately upon render/activation
        },

    }
}
</script>
<style scoped>
    .onduty-engineer-by-week {
        position: relative;
    }
    .engineer-week {
        margin: 2px 10px;
    }
</style>
