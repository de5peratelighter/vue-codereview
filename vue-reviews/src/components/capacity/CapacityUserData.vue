<template>
  <md-layout class="capacity-user">
    <md-layout md-vertical-align="center" class="capacity-cell">
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
  props: ['user', 'assignedTeam', 'testing'],
}
</script>
<style>
.capacity-user {
  flex: 0 0 20%;
  flex-wrap: nowrap;
}
</style>