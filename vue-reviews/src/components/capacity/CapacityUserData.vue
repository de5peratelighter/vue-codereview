<template>
  <md-layout class="capacity-user">
    <md-layout md-vertical-align="center" class="capacity-cell" :class="{'capacity-highlighted': lead}">
      <span>{{ user }}</span>
    </md-layout>
    <md-layout md-vertical-align="center" class="capacity-cell">
      <span v-if="assignedTeam">{{ assignedTeam }}</span>
    </md-layout>
    <md-layout md-vertical-align="center" class="capacity-cell">
      <span v-if="testing">{{ testing }}</span>
    </md-layout>
  </md-layout>
</template>

<script>
export default {
  name: 'CapacityUserData',
  props: ['user', 'assignedTeam', 'testing', 'lead'],
}
</script>
<style scoped>
.capacity-user {
  flex: 0 0 19.999%;
  flex-wrap: nowrap;
  background-color: #edf2f4;
}
  .capacity-cell {
    border-right: 1px solid #8397a3;
    border-bottom: 1px solid #8397a3;
  }
    .capacity-cell span {
      text-align: center;
      flex: 0 0 100%;
    }
    .capacity-highlighted {
      font-weight: 600;
    }
</style>