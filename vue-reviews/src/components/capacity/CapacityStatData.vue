<template>
  <md-layout md-row class="capacity-data-container">
    <div md-vertical-align="center" class="capacity-data capacity-cell">
      <span>{{ requested }}</span>
    </div>
    <div md-vertical-align="center" class="capacity-data capacity-cell">
      <span>{{ received }}</span>
    </div>
    <div md-vertical-align="center" class="capacity-data capacity-cell">
      <span>{{ tickets }}</span>
    </div>
  </md-layout>
</template>

<script>
export default {
  name: 'CapacityStatData',
  props: ['requested', 'received', 'tickets']
}
</script>

<style scoped>
.capacity-data-container {
  flex-wrap: nowrap;
}
  .capacity-data {
    display: flex;
    flex: 0 0 33.333%;
    align-items: center;
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