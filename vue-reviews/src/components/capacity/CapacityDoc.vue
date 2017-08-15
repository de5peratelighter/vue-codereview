<template>
  <div class="capacity-view">
    <capacity-table></capacity-table>
  </div>
</template>

<script>

import firebase from 'firebase';
import { mapActions, mapGetters } from 'vuex';

import CapacityTable from './CapacityTable';
import FBApp from '@/data/firebase-config';
import { GET_CAPACITY } from '@/data/mutation-types';

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
    getCapacityData() {
      this.$bindAsArray('capacityData', FBApp.ref(this.firebasePathGetter.capacity + '/' + this.$store.state.currentWeek), null, () => {
         this[GET_CAPACITY](this.capacityData); 
      })
    }
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