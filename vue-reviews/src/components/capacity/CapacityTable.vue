<template>
  <div class="capacity-table">
    <capacity-table-header></capacity-table-header>
    <capacity-team v-for="team in teamsGetter" :team="team" :key="team"></capacity-team>
  </div>
</template>

<script>
import { mapGetters } from 'vuex';

import CapacityTableHeader from './CapacityTableHeader';
import CapacityTeam from './CapacityTeam';

export default {
  name: 'CapacityTable',
  computed: {
    ...mapGetters(['teamsGetter'])
  },
  components: {
    CapacityTableHeader,
    CapacityTeam
  }
}
</script>

<style>
.capacity-table {
  border-top: 2px solid green;
  border-left: 2px solid green;
}
</style>