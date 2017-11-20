<template>
  <md-layout md-row md-flex class="capacity-row">
    <capacity-user-data user="Total" :lead="true"></capacity-user-data>
    <md-layout>
      <md-layout class="capacity-day" v-for="n in 5" :n="n" :key="n">
        <capacity-stat-data :requested="summarizeStat('requested', n-1)" :received="summarizeStat('received', n-1)" :tickets="summarizeStat('tickets', n-1)"></capacity-stat-data>
      </md-layout>
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
  .capacity-team > .capacity-row .capacity-cell {
    border-bottom: 0;
    background-color: #d6cbe1;
  }
  .capacity-day {
    flex: 0 0 20%;
    padding: 0 2px;
  }
    .capacity-day:first-child {
      padding-left: 4px;
    }
    .capacity-day:last-child {
      padding-right: 0;
    }
</style>