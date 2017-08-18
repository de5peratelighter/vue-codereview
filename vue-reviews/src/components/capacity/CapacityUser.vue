<template>
  <md-layout md-row md-flex class="capacity-row" :class="{focused: focusedUserGetter === user}">
    <capacity-user-data :user="user"></capacity-user-data>
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
import CapacityUserData from './CapacityUserData';

export default {
  name: 'CapacityUser',
  props: ['user'],
  data() {
    return {
      requestedCapacity: [],
      receivedCapacity: [],
      ticketsCapacity: [],
    }
  },
  computed: {
    ...mapGetters(['capacityByUserGetter', 'focusedUserGetter']),
    usersCapacity() {
      return this.capacityByUserGetter(this.user);
    }
  },
  methods: {
    splitCapacity(capacityString) {
      let capacityArray = capacityString.split('|');
      this.requestedCapacity = capacityArray[0].split(',');
      this.receivedCapacity = capacityArray[1].split(',');
      this.ticketsCapacity = capacityArray[2].split(',');
    }
  },
  watch: {
    usersCapacity (newCapacityString) {
      this.splitCapacity(newCapacityString);;
    }
  },
  mounted() {
    this.splitCapacity(this.usersCapacity);
  },
  components: {
    CapacityItem,
    CapacityUserData
  },
}
</script>

<style scoped>
.focused {
   background-color: red;
}
</style>