<template>
  <md-layout md-row md-flex class="capacity-row" :class="{focused: focusedUserGetter === user}">
    <md-layout class="capacity-user">
      <md-layout md-vertical-align="center" class="capacity-cell">
        <span>{{ user }}</span>
      </md-layout>
      <md-layout md-vertical-align="center" class="capacity-cell">
        <span>Empty</span>
      </md-layout>
      <md-layout md-vertical-align="center" class="capacity-cell">
        <span>Empty</span>
      </md-layout>
    </md-layout>
    <md-layout class="capacity-week">
      <md-layout class="capacity-day" v-for="n in 5" :n="n" :key="n">
        <md-layout md-row class="capacity-data-container">
          <capacity-item ref='user+requested+(n-1)' :user="user" type="requested" :day="n-1" :data="requestedCapacity[n-1]"></capacity-item>
          <capacity-item :user="user" type="received" :day="n-1" :data="receivedCapacity[n-1]"></capacity-item>
          <capacity-item :user="user" type="tickets" :day="n-1" :data="ticketsCapacity[n-1]"></capacity-item>
        </md-layout>
      </md-layout>
    </md-layout>
  </md-layout>
</template>

<script>

import { mapGetters } from 'vuex';

import CapacityItem from './CapacityItem';

export default {
  name: 'CapacityUser',
  props: ['user'],
  computed: {
    ...mapGetters(['capacityByUserGetter', 'focusedUserGetter']),
    requestedCapacity() {
      return this.capacityByUserGetter(this.user, 'requested');
    },
    receivedCapacity() {
      return this.capacityByUserGetter(this.user, 'received');
    },
    ticketsCapacity() {
      return this.capacityByUserGetter(this.user, 'tickets');
    }
  },
  components: {
    CapacityItem
  },
}
</script>

<style>
.focused {
   background-color: red;
}
</style>