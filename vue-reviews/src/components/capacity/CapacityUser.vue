<template>
  <md-layout v-if="hasData" md-row md-flex class="capacity-row" :class="{focused: focusedUserGetter === user}">
    <capacity-user-data :user="user" :assignedTeam="userInfoGetter(user, 'notes')" :testing="userInfoGetter(user, 'tester')" :lead="isLead"></capacity-user-data>
    <md-layout class="capacity-week">
      <md-layout class="capacity-day" v-for="n in 5" :n="n" :key="n">
        <md-layout md-row class="capacity-data-container">
          <capacity-item ref='user+requested+(n-1)' :user="user" type="requested" :day="n-1" :data="requestedCapacity[n-1]"></capacity-item>
          <capacity-item :user="user" type="received" :day="n-1" :data="receivedCapacity[n-1]"></capacity-item>
          <capacity-item :user="user" type="tickets" :day="n-1" :data="ticketsCapacity[n-1]"></capacity-item>
        </md-layout>
      </md-layout>
    </md-layout>
    <md-layout class="capacity-day total">
      <capacity-stat-data :requested="getTotalByType(requestedCapacity)" :received="getTotalByType(receivedCapacity)" :tickets="getTotalByType(ticketsCapacity)"></capacity-stat-data>
    </md-layout>
  </md-layout>
</template>

<script>

import { mapGetters, mapState } from 'vuex';
import { FBApp } from '@/data/firebase-config';

import CapacityItem from './CapacityItem';
import CapacityStatData from './CapacityStatData';
import CapacityUserData from './CapacityUserData';
import { capacityRecordMixin } from './mixins/capacityRecords';

export default {
  name: 'CapacityUser',
  props: ['user'],
  mixins: [capacityRecordMixin],
  data() {
    return {
      requestedCapacity: [],
      receivedCapacity: [],
      ticketsCapacity: [],
      hasData: true
    }
  },
  computed: {
    ...mapGetters(['capacityByUserGetter', 'focusedUserGetter', 'userInfoGetter', 'firebasePathGetter', 'currentWeekGetter']),
    ...mapState({
      currentYear: (state) => state.currentYear
    }),
    usersCapacity() {
      if(this.$store.state.capacity.length === 0) {
        return null;
      } else {
        return this.capacityByUserGetter(this.user);
      }
    },
    isLead () {
      return this.userInfoGetter(this.user, 'role') === 'TeamLead';
    }
  },
  methods: {
    splitCapacity(capacityString) {
      if(capacityString === null) {
        this.hasData = false;
        return;
      }
      if(capacityString === undefined) {
        if(this.$moment().isoWeek() === this.currentWeekGetter) {
          this.createNewUserRecord();
        }
        this.hasData = false;
        return;
      }
      this.hasData = true;
      const capacityArray = capacityString.split('||');
      const capacityData = capacityArray[0].split('|')
      this.requestedCapacity = capacityData[0].split(',');
      this.receivedCapacity = capacityData[1].split(',');
      this.ticketsCapacity = capacityData[2].split(',');
    },
    getTotalByType(type) {
      if(type === []){
        return 0;
      }
      return type.reduce((prevValue, curValue) => {
          if(!isNaN(curValue)) {
            return Number(prevValue) + Number(curValue);
          }
          return prevValue;
        }, 0);
    },
    createNewUserRecord() {
      const user = this.userInfoGetter(this.user);
      if(this.skipUser(user)) {
        return;
      } else {
        this.createUserString(user)
        const userString = this.createUserString(user);
        const newUserData = {};
        newUserData[this.user] = userString;
        return FBApp.ref(this.firebasePathGetter.capacity + '/' + this.currentYear + '/' + this.currentWeekGetter).update(newUserData);
      }
    }
  },
  watch: {
    usersCapacity (newCapacityString) {
      this.splitCapacity(newCapacityString);
    }
  },
  mounted() {
    this.splitCapacity(this.usersCapacity);
  },
  components: {
    CapacityItem,
    CapacityStatData,
    CapacityUserData
  },
}
</script>

<style scoped>
.capacity-row {
  flex-wrap: nowrap;
  word-break: break-all;
  flex: 0 0 100%;
}
.separate .capacity-row {
  background-color: #fff8dc;
}
.capacity-row.focused {
   background-color: #9dc2e5;
}
  .capacity-week {
    flex: 0 0 66.66%;
    flex-wrap: nowrap;
  }
    .capacity-day {
      flex: 0 0 19.99%;
    }
      .capacity-day.total {
        padding-right: 0;
        background-color: #d6cbe1;
      }
      .capacity-day-name {
        flex: 0 0 100%;
        flex-wrap: nowrap;
      }
      .capacity-cell {
        border-right: 1px solid #8397a3;
        border-bottom: 1px solid #8397a3;
      }
        .capacity-cell span {
          text-align: center;
          flex: 0 0 100%;
        }
</style>