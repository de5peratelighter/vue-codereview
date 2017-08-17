<template>
  <md-layout md-row md-flex class="capacity-row">
    <capacity-user-data user="Engineer" assignedTeam="Assigned to team" testing="TSE Testing"></capacity-user-data>
    <md-layout class="capacity-week">
      <md-layout class="capacity-day" v-for="day in week" :day="day" :key="day">
        <md-layout md-align="center" class="capacity-day-name capacity-cell">{{ day }}</md-layout>
        <capacity-stat-data requested="Requested" received="Received" tickets="Assigned"></capacity-stat-data>
      </md-layout>
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

<style>
  * {
    font-size: 12px;
  }
   div :focus {
    outline: 5px solid blue;
  }
    input:focus {
      outline: 5px solid yellow;
    }
  .capacity-row {
    flex-wrap: nowrap;
    word-break: break-all;
    flex: 0 0 100%;
  }
  .capacity-week {
    flex-wrap: nowrap;
  }
  .capacity-day {
    flex: 0 0 20%;
  }
    .capacity-day-name {
      flex: 0 0 100%;
      flex-wrap: nowrap;
    }
.capacity-cell {
  border-right: 2px solid green;
  border-bottom: 2px solid green;
}
  .capacity-cell span {
    text-align: center;
    flex: 0 0 100%;
  }
</style>