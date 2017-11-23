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
    border-right: 1px solid #8397a3;
    border-bottom: 1px solid #8397a3;
  }
    .capacity-cell:first-child {
      border-left: 1px solid #8397a3;
    }
    .capacity-cell span {
      text-align: center;
      flex: 0 0 100%;
      word-break: break-all;
    }
</style>