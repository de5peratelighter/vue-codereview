<template>
    <div :class="classObject">

        <div @click="openDialog(day)" >
            <span class="day__number">{{day.format('D')}}</span>
            <ul class="day__schedule">
                <li v-for="(item, index) in schedule" :key="index">
                    {{item}}
                </li>
            </ul>
        </div>
        <md-dialog ref="hello">
            <md-dialog-title v-if="!classObject.past">Reviewers schedule</md-dialog-title>
            <md-dialog-title v-else>Date is in the past, you can't update this.</md-dialog-title>

            <md-dialog-content v-if="!classObject.past">
                
                <md-input-container v-if="reviewersGetter" v-for="(item, key) in schedule" :key="key">
                    <label for="reviewers" style="color:inherit">{{ reviewersGetter ? 'Update reviewer' : 'Something went wrong' }}</label>
                    <md-select name="reviewers" v-model="stuff[key]" :disabled="!reviewersGetter">
                        <md-option v-for="(option, index) in selectOptions" :key="index" :value="option" @selected="onSelectChange(stuff[key], key)">{{option}}</md-option>
                    </md-select>
                </md-input-container>
                
            </md-dialog-content>

            
            <md-dialog-actions>
              <md-button class="md-primary" @click="closeDialog(day)">Ok</md-button>
            </md-dialog-actions>
        </md-dialog>
    </div>
</template>
<script>
    import firebase from 'firebase'
    import FBApp from '@/data/firebase-config'
    
    var provider = new firebase.auth.GoogleAuthProvider();
    
    import {mapActions, mapGetters } from 'vuex'
    
    export default {
        props : ['day','scheduler'],
        data () {
            return {
                lastInd : null
            }
        },
        computed: {
            ...mapGetters(['firebasePathGetter','reviewersGetter','revPerDayGetter']),
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
            },
            selectOptions () {
                let ar = this.reviewersGetter ? this.reviewersGetter : ''
                let obj = {}
                if (ar) {  
                    ar.split(',').forEach((el, i)=> {obj[i] = el}) 
                    return obj
                }
            },
            stuff () {
                if (this.scheduler) {
                    let ar = this.scheduler.split(',').slice(0,this.revPerDayGetter)
                    return ar
                } else {
                    return {}
                }
            }
        },
        firebase: {},
        methods : {
            openDialog(day) {
                this.$refs.hello.open();
                this.$store.commit('eventFormActive', true)
                this.$store.commit('eventFormUpdateDate', this.day)
            },
            closeDialog(day) {
                 this.$refs.hello.close();
            },
            onSelectChange (model,index) {
                let newVal =  this.scheduler.split(',')
                if (newVal && model) {
                    newVal[index] = model
                }
                if (this.scheduler !== newVal.join(',')) {
                    console.log(newVal.join(','), index, this.day.format('YYYY-MM-DD') )
                    FBApp.ref(this.firebasePathGetter.schedule +"/" + this.day.format('YYYY-MM-DD')).set(newVal.join(','))
                }
                
                
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