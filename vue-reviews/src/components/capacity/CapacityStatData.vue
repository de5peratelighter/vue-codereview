<template>
  <md-layout md-row class="capacity-data-container">
    <div md-vertical-align="center" class="capacity-data capacity-cell">
      <span v-if="requested">{{ requested }}</span>
    </div>
    <div md-vertical-align="center" class="capacity-data capacity-cell">
      <span v-if="received">{{ received }}</span>
    </div>
    <div md-vertical-align="center" class="capacity-data capacity-cell">
      <span v-if="tickets">{{ tickets }}</span>
    </div>
  </md-layout>
</template>

<script>
export default {
  name: 'CapacityStatData',
  props: ['requested', 'received', 'tickets'],
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
</style>