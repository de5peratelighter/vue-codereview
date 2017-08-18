<template>
  <md-layout md-vertical-align="start" class="capacity-team">
    <capacity-subteam v-for="lead in leadsByTeamGetter(team)" :lead="lead" :key="lead"></capacity-subteam>
    <div>{{ team }}</div>
  </md-layout>
</template>

<script>
import { mapActions, mapGetters } from 'vuex';

import CapacitySubteam from './CapacitySubteam';

export default {
  name: 'CapacityTableBody',
  props: ['team'],
  computed: {
    ...mapGetters(['leadsByTeamGetter'])
  },
  components: {
    CapacitySubteam
  }
}
</script>

<style scoped>
.capacity-team {
  flex: 0 0 100%;
  border-bottom: 2px solid red;
}
</style>