<template>
  <md-layout md-vertical-align="start" class="capacity-subteam">
    <capacity-user v-for="user in usersBySubTeamGetter(subTeam)" :user="user" :key="user"></capacity-user>
  </md-layout>
</template>

<script>
import { mapGetters } from 'vuex';

import CapacityUser from './CapacityUser';

export default {
  name: 'CapacitySubteam',
  props: ['subTeam'],
  computed: {
    ...mapGetters(['usersBySubTeamGetter'])
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