<template>
  <md-layout md-row md-flex class="capacity-row">
    <capacity-user-data user="Total" :lead="true"></capacity-user-data>
    <md-layout class="capacity-week">
      <md-layout class="capacity-day" v-for="n in 5" :n="n" :key="n">
        <capacity-stat-data :requested="summarizeStat('requested', n-1)" :received="summarizeStat('received', n-1)" :tickets="summarizeStat('tickets', n-1)"></capacity-stat-data>
      </md-layout>
    </md-layout>
    <md-layout class="capacity-day total">
      <capacity-stat-data :requested="getTotalStat('requested')" :received="getTotalStat('received')" :tickets="getTotalStat('tickets')"></capacity-stat-data>
    </md-layout>
  </md-layout>
</template>

<script>
import { mapGetters } from 'vuex';

import CapacityStatData from './CapacityStatData';
import CapacityUserData from './CapacityUserData';

export default {
  name: 'CapacityTeamDaily',
  props: ['team'],
  computed: {
    ...mapGetters(['capacityByTeamGetter']),
    teamsCapacity() {
      return this.capacityByTeamGetter(this.team);
    }

  },
  methods: {
    splitCapacity(capacity) {
      let splitCapacity = capacity.split("|");
      return {
        requested: splitCapacity[0].split(','),
        received: splitCapacity[1].split(','),
        tickets: splitCapacity[2].split(',')
      }
    },
    getTotalStat(type) {
      let stat = 0;
      this.teamsCapacity.forEach((value, index) => {
        let capacity = this.splitCapacity(value);
        let data = capacity[type];
        const userTotal = data.reduce((prevValue, curValue) => {
          if(!isNaN(curValue)){
            return Number(prevValue) + Number(curValue);
          }
          return prevValue;
        }, 0);
        stat+=Number(userTotal);
      });
      return stat;
    },
    summarizeStat(type, day) {
      let stat = 0;
      this.teamsCapacity.forEach((value, index) => {
        let capacity = this.splitCapacity(value);
        let data = Number(capacity[type][day]);
        if(!isNaN(data)){
          stat = stat + data
        }
      });
      return stat;
    },
  },
  components: {
    CapacityStatData,
    CapacityUserData
  }
}
</script>

<style>
  .capacity-team > .capacity-row .capacity-cell, .capacity-team > .capacity-row {
    border-bottom: 0;
    background-color: #d6cbe1;
  }
  .capacity-row {
    flex-wrap: nowrap;
  }
    .capacity-week {
      flex: 0 0 66.66%;
      flex-wrap: nowrap;
    }
  .capacity-day {
    flex: 0 0 19.99%;
    padding: 0 2px;
  }
    .capacity-day:first-child {
      padding-left: 4px;
    }
    .capacity-day.total {
      flex: 0 0 13.34%;
      padding-right: 0;
    }
</style>