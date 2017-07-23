<template>
  <capacity-table></capacity-table>
</template>

<script>

import firebase from 'firebase';
import { mapActions, mapGetters } from 'vuex';

import CapacityTable from './CapacityTable';
import FBApp from './../data/firebase-config';
import { GET_CAPACITY } from './../data/mutation-types';

export default {
  name: 'CapacityDoc',
  data() {
    return {
      DEFAULT_DATA : this.$store.state.capacity
    };
  },
  computed: {
    ...mapGetters(['firebasePathGetter', 'activeUserGetter']),
    capacity () {
      return this.$store.state.capacity;
    }
  },
  firebase: {},
  methods: {
    ...mapActions([GET_CAPACITY]),
    prettifyCapacity() {
      let capacity = {};
      let uglyCapacity = this.capacityData;
      let users = uglyCapacity.length;
      for (let i = 0; i < users; i++) {
        let user = uglyCapacity[i]['.key'];
        let capacityByDay = uglyCapacity[i]['.value'];
        capacity[user] = capacityByDay;
      }
      return capacity;
    },
    getCapacityData() {
      this.$bindAsArray('capacityData', FBApp.ref(this.firebasePathGetter.capacity + '/' + this.$store.state.currentWeek),null, () => {
        this[GET_CAPACITY](this.prettifyCapacity());
      })
    },
  },
  watch: {
    activeUserGetter (newCount, oldCount) {
      if (!newCount.isAnonymous) {
        this.getCapacityData();
      } else {
        this[GET_CAPACITY](this.DEFAULT_DATA);
      }
    }
  },
  activated () {
    if (!this.activeUserGetter.isAnonymous) {
      this.getCapacityData();
    } else {
      this[GET_CAPACITY](this.DEFAULT_DATA);
    }
  },
  components: {
    CapacityTable
  }
}
</script>