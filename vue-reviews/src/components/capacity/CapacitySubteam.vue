<template>
  <md-layout md-vertical-align="start" class="capacity-subteam" :class="{separate: shouldSeparate}">
    <capacity-user v-for="user in usersBySubTeamGetter(subTeam)" :user="user" :key="user"></capacity-user>
  </md-layout>
</template>

<script>
import { mapGetters } from 'vuex';

import CapacityUser from './CapacityUser';

export default {
  name: 'CapacitySubteam',
  props: ['subTeam', 'index', 'subTeamsNumber'],
  computed: {
    ...mapGetters(['usersBySubTeamGetter']),
    shouldSeparate() {
      return this.subTeamsNumber > 1 && (this.index + 1) % 2 === 0
    }
  },
  components: {
    CapacityUser
  }
}
</script>

<style scoped>
.capacity-subteam {
  flex: 0 0 100%;
}
</style>