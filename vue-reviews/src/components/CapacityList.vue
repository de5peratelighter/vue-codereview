<template>
    <div>
        <h1>capacity</h1>
        <ul>

        </ul>
    </div>
</template>

<script>

import firebase from 'firebase'
import {mapActions, mapGetters } from 'vuex'

import FBApp from './../data/firebase-config'
import {GET_CAPACITY} from './../data/mutation-types'

export default {
  name: 'Capacity',
    computed: {
      capacityWeek () {
        return this.$store.state.capacityWeek
      },
      ...mapGetters(['firebasePathGetter'])
    },
    firebase: {},
    methods: {
      capacityToArray () {}
    },
    watch: {
      activeUserGetter (newCount, oldCount) {
              if (!newCount.isAnonymous) {
                  console.log('changed user');
                  this.$bindAsObject('capacity', FBApp.ref(this.firebasePathGetter.capacity + '/29'),null, () => {
                      console.log(this.capacity)
                  })
              }
      }
    }
  }
</script>