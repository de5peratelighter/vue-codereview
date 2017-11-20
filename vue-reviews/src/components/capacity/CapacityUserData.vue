<template>
  <md-layout class="capacity-user" :class="{'focused': focusedUserGetter === user}">
    <md-layout md-vertical-align="center" class="capacity-cell" :class="{'capacity-highlighted': lead}">
      <span>{{ user }}</span>
    </md-layout>
    <md-layout md-vertical-align="center" class="capacity-cell">
      <span v-if="assignedTeam">{{ assignedTeam }}</span>
    </md-layout>
    <md-layout md-vertical-align="center" class="capacity-cell">
      <span v-if="testing">{{ testing | testingFilter }}</span>
    </md-layout>
  </md-layout>
</template>

<script>
import { mapGetters } from 'vuex';

export default {
  name: 'CapacityUserData',
  props: ['user', 'assignedTeam', 'testing', 'lead'],
  filters: {
    testingFilter(val) {
      switch (val) {
        case 'Yes':
          return 'Yes';
        case 'No':
          return '';
        default:
          return 'TSE Testing'
      }
    }
  },
  
  computed: {
    ...mapGetters(['focusedUserGetter']),
  }
}
</script>
<style scoped>
.separate .capacity-user {
  background-color: #ffefdb;
}
.capacity-user {
  flex: 0 0 19.999%;
  flex-wrap: nowrap;
  background-color: #edf2f4;
}
  .capacity-user.focused {
    background-color: transparent;
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