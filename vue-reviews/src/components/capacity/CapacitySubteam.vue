<template>
  <md-layout md-vertical-align="start" class="capacity-subteam">
    <capacity-user v-for="user in usersByLeadGetter(lead)" :user="user" :key="user"></capacity-user>
  </md-layout>
</template>

<script>
import { mapGetters } from 'vuex';

import CapacityUser from './CapacityUser';

export default {
  name: 'CapacitySubteam',
  props: ['lead'],
  computed: {
    ...mapGetters(['usersByLeadGetter'])
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