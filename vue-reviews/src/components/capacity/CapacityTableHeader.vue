<template>
  <md-layout md-row md-flex class="capacity-row">
    <md-layout class="capacity-user">
      <md-layout md-vertical-align="center" class="capacity-cell">
        <span>Engineer</span>
      </md-layout>
      <md-layout md-vertical-align="center" class="capacity-cell">
        <span>Assigned to team</span>
      </md-layout>
      <md-layout md-vertical-align="center" class="capacity-cell">
        <span>TSE Testing</span>
      </md-layout>
    </md-layout>
    <md-layout class="capacity-week">
      <md-layout class="capacity-day" v-for="day in week" :day="day" :key="day">
        <md-layout md-align="center" class="capacity-day-name capacity-cell">{{ day }}</md-layout>
        <md-layout md-row class="capacity-data-container">
          <div md-vertical-align="center" class="capacity-data capacity-cell">
            <span>Requested</span>
          </div>
          <div md-vertical-align="center" class="capacity-data capacity-cell">
            <span>Received</span>
          </div>
          <div md-vertical-align="center" class="capacity-data capacity-cell">
            <span>Assigned</span>
          </div>
        </md-layout>
      </md-layout>
    </md-layout>
  </md-layout>
</template>

<script>

export default {
  name: 'CapacityTableHeader',
  computed: {
    
    week() {
      let week = this.$moment.weekdays();
      week.splice(0,1);
      week.splice(5,1);
      return week;
    }
  }
}
</script>

<style>
  * {
    font-size: 12px;
  }
   div :focus {
    outline: 5px solid blue;
  } /**/
    input:focus {
      outline: 5px solid yellow;
    }
  .capacity-row {
    flex-wrap: nowrap;
    word-break: break-all;
    flex: 0 0 100%;
  }
  .capacity-user {
    flex: 0 0 20%;
    flex-wrap: nowrap;
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
    .capacity-data-container {
      flex-wrap: nowrap;
    }
      .capacity-data {
        display: flex;
        flex: 0 0 33.333%;
        align-items: center;
      }
          .capacity-cell span {
            text-align: center;
            flex: 0 0 100%;
          }
.capacity-cell {
  border-right: 2px solid green;
  border-bottom: 2px solid green;
}
</style>