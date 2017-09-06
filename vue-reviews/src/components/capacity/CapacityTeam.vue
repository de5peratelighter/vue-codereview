<template>
  <md-layout md-vertical-align="start" class="capacity-team">
    <capacity-subteam v-for="lead in leadsByTeamGetter(team)" :lead="lead" :key="lead"></capacity-subteam>
    <capacity-team-daily :team="team"></capacity-team-daily>
  </md-layout>
</template>

<script>
import { mapGetters } from 'vuex';

import CapacityTeamDaily from './CapacityTeamDaily';
import CapacitySubteam from './CapacitySubteam';

export default {
  name: 'CapacityTableTeam',
  props: ['team'],
  computed: {
    ...mapGetters(['leadsByTeamGetter'])
  },
  components: {
    CapacitySubteam,
    CapacityTeamDaily
  }
}
</script>

<style scoped>
.capacity-team {
  flex: 0 0 100%;
  border-bottom: 1px solid #000;
}
</style>