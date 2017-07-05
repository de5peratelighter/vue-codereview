<template>
    <div :class="classObject">

        <div @click="openDialog(day)">
            <span class="day__number">{{day.format('D')}}</span>
            <ul class="day__schedule">
                <li v-for="(item, index) in schedule" :key="index">
                    {{item}}
                </li>
            </ul>
        </div>
        <md-dialog ref="hello">
            <md-dialog-title>STUFF here</md-dialog-title>
            <md-dialog-actions>
              <md-button class="md-primary" @click="closeDialog(day)">Ok</md-button>
            </md-dialog-actions>
        </md-dialog>
    </div>
</template>
<script>
    export default {
        props : ['day','scheduler'],
        data () {
            return {
                lastInd : null
            }
        },
        computed: {
            events () {
                return this.$store.state.events.filter(el => el.date.isSame(this.day,'day'))
            },
            classObject () {
                let eventFormDate = this.$store.state.eventFormDate
                let eventFormActive = this.$store.state.eventFormActive
                let today = this.day.isSame(this.$moment(),'day')
                return {
                    day : true, 
                    today,
                    past: this.day.isSameOrBefore(this.$moment(),'day') && !today,
                    active : eventFormDate.isSame(this.day,'day') && eventFormActive
                }
            },
            schedule () {
                if (this.scheduler) {
                    let el = this.scheduler.split(',')
                    this.lastInd = el.splice(-1,1).join()
                    return el
                } else {return []}
            }
        },
        methods : {
            openDialog(day) {
                this.$refs.hello.open();
                this.$store.commit('eventFormActive', true)
                this.$store.commit('eventFormUpdateDate', this.day)
            },
            closeDialog(day) {
                 this.$refs.hello.close();
            }
        }
    }
</script>
<style>
    .day {
        position: relative;
    }
    .day__number {
        position: absolute;
        top: 5px;
        left: 5px;
        width: 20px;
        text-align: center;
    }
    .day__schedule {
        margin: 0;
        list-style: none;
    }
</style>