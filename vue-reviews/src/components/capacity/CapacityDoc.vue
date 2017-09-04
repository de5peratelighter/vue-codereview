<template>
  <div class="capacity-view" v-if="levelDEVORPM(activeUserGetter.role)">
    <div class="capacity-header-container">
        <div class="capacity-date-range"><span>{{getDate(1)}} - {{getDate(5)}}</span></div>
        <md-button class="md-icon-button md-raised md-primary" @click="setWeek('prev')" :disabled="isDisabled('prev')">
          <md-icon>remove</md-icon>
        </md-button>
        <md-button class="md-icon-button md-raised md-accent" @click="setWeek('next')" :disabled="isDisabled('next')">
          <md-icon>add</md-icon>
        </md-button>
    </div>
    <capacity-table></capacity-table>
  </div>
</template>

<script>

import firebase from 'firebase';
import { mapActions, mapGetters } from 'vuex';

import CapacityTable from './CapacityTable';
import { FBApp } from '@/data/firebase-config';
import { GET_CAPACITY, SET_CURRENT_WEEK, SET_COPY_CACHE } from '@/data/mutation-types';
import { levelMixin } from '@/mixins/restrictions';

export default {
  name: 'CapacityDoc',
  data() {
    return {
      DEFAULT_DATA : this.$store.state.capacity,
      noPrevData: false
    };
  },
  mixins: [levelMixin],
  computed: {
    ...mapGetters(['firebasePathGetter', 'activeUserGetter', 'currentWeekGetter']),
    capacity () {
      return this.$store.state.capacity;
    }
  },
  firebase: {},
  methods: {
    ...mapActions([GET_CAPACITY, SET_CURRENT_WEEK, SET_COPY_CACHE]),
    setWeek(type) {
      switch (type) {
        case 'next':
          this[SET_CURRENT_WEEK](this.currentWeekGetter + 1)
          break;
        case 'prev':
          this[SET_CURRENT_WEEK](this.currentWeekGetter - 1)
      }
    },
    isDisabled(type) {
      switch (type) {
        case 'prev':
          return this.noPrevData
        case 'next':
          return this.currentWeekGetter === this.$moment().isoWeek()
      }
    },
    getDate(day) {
      const year = this.$moment().year();
      let week = this.currentWeekGetter;
      if(week < 10) {
        week = '0' + week
      }
      return this.$moment(`${year}-W${week}-${day}`).format('Do, MMMM');
    },
    getCapacityData() {
      this[SET_COPY_CACHE]({
        el: null,
        data: ''
      });
      this.$bindAsArray('capacityData', FBApp.ref(this.firebasePathGetter.capacity + '/' + this.currentWeekGetter), null, () => {
        if(this.capacityData.length > 0) {
          this[GET_CAPACITY](this.capacityData);
          this.noPrevData = false;
        } else if(this.currentWeekGetter < this.$moment().isoWeek()){
          this.noPrevData = true;
          this[GET_CAPACITY]([]);
        } else {
          this[GET_CAPACITY](this.capacityData);
          console.log('Todo ===> create a new record')
        }
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
    },
    currentWeekGetter (newCount) {
      this.getCapacityData();
    }
  },
  created () {
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

<style>
  .capacity-header-container {
    display: flex;
    flex: 0 0 100%;
    justify-content: flex-end;
    padding: 10px;
  }
    .capacity-date-range {
      display: flex;
      align-items: center;
      margin-right: 30px;
      font-size: 24px;
    }
</style>