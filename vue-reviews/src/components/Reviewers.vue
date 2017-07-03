<template>
    <div class="c-main-section">
        <reviewers-list></reviewers-list>
        <div id="header">
            <div>
                <h1>Vue JS Calendar</h1>
            </div>
            <div>
                <current-month></current-month>
            </div>
        </div>
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
                <calendar-day v-for="(day, index) in week" :day="day" :key="index"></calendar-day>
            </div>
        </div>
        <event-form>
            
        </event-form>
    </div>
</template>

<script>
import CalendarDay from './CalendarDay.vue'
import CurrentMonth from './CurrentMonth.vue'
import EventForm from './EventForm.vue'
import ReviewersList from './ReviewersList.vue'
export default {
    name: 'Reviewers',
    computed : {
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
        EventForm,
        ReviewersList
    }
}
</script>