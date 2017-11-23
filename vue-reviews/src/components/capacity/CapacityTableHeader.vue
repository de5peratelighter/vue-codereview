<template>
  <md-layout md-row md-flex class="capacity-row">
    <capacity-user-data user="Engineer" assignedTeam="Assigned to team" testing="TSE Testing"></capacity-user-data>
    <md-layout class="capacity-week">
      <md-layout class="capacity-day" v-for="day in week" :day="day" :key="day">
        <md-layout md-align="center" class="capacity-day-name capacity-cell">{{ day }}</md-layout>
        <capacity-stat-data requested="Requested" received="Received" tickets="Assigned"></capacity-stat-data>
      </md-layout>
    </md-layout>
    <md-layout class="capacity-day total">
      <md-layout md-align="center" class="capacity-day-name capacity-cell">Total</md-layout>
      <capacity-stat-data requested="Requested" received="Received" tickets="Assigned"></capacity-stat-data>
    </md-layout>
  </md-layout>
</template>

<script>
import CapacityStatData from './CapacityStatData';
import CapacityUserData from './CapacityUserData';

export default {
  name: 'CapacityTableHeader',
  computed: {
    
    week() {
      let week = this.$moment.weekdays();
      week.splice(0,1);
      week.splice(5,1);
      return week;
    }
  },
  components: {
    CapacityStatData,
    CapacityUserData
  }
}
</script>

<style scoped>
.capacity-row {
  flex-wrap: nowrap;
  word-break: break-all;
  flex: 0 0 100%;
  background-color: #edf2f4;
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
        font-weight: 600;
        padding-right: 0;
      }
    .capacity-day-name {
      flex: 0 0 100%;
      flex-wrap: nowrap;
    }
    .capacity-cell {
      border-right: 1px solid #8397a3;
      border-bottom: 1px solid #8397a3;
    }
      .capacity-cell:first-child {
        border-left: 1px solid #8397a3;
      }
      .capacity-cell span {
        text-align: center;
        flex: 0 0 100%;
      }
</style>