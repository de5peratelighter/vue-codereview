<template>
  <ul>
    <li v-for="team in teams">{{ team }}</li>
  </ul>
</template>

<script>

import firebase from 'firebase';
import { mapActions, mapGetters } from 'vuex';

import CapacityTable from './CapacityTable';
import FBApp from './../data/firebase-config';
import { GET_CAPACITY } from './../data/mutation-types';

export default {
  name: 'CapacityTable',
  computed: {
    ...mapGetters(['teamsGetter']),
    teams () {
      return this.teamsGetter;
    }
  },
  created(){
    console.log('CapacityTable created');
  }
}
</script>