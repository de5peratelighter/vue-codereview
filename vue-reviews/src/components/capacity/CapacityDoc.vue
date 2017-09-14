<template>
  <div v-if="levelDEVORPM(activeUserGetter.role)" class="capacity-view">
    <div class="capacity-header-container">
        <div class="capacity-date-range"><span>{{getDate(1)}} - {{getDate(5)}}</span></div>
        <md-button class="md-icon-button md-raised md-primary" @click="setWeek(-1)" :disabled="isDisabled('prev')">
          <md-icon>remove</md-icon>
        </md-button>
        <md-button class="md-icon-button md-raised md-accent" @click="setWeek(1)" :disabled="isDisabled('next')">
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
import { GET_CAPACITY, SET_CURRENT_WEEK, SET_COPY_CACHE, GET_USERS } from '@/data/mutation-types';
import { levelMixin } from '@/mixins/restrictions';
import { capacityRecordMixin } from './mixins/capacityRecords';

export default {
  name: 'CapacityDoc',
  data() {
    return {
      noPrevData: false
    };
  },
  mixins: [levelMixin, capacityRecordMixin],
  computed: {
    ...mapGetters(['firebasePathGetter', 'activeUserGetter', 'currentWeekGetter']),
    capacity () {
      return this.$store.state.capacity;
    }
  },
  firebase: {},
  methods: {
    ...mapActions([GET_CAPACITY, SET_CURRENT_WEEK, SET_COPY_CACHE, GET_USERS]),
    setWeek(value) {
      this[SET_CURRENT_WEEK](this.currentWeekGetter + value);
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
          this.createNewWeekRecord();
        }
      })
    },
    getUsersData() {
      this.$bindAsArray('usersData', FBApp.ref(this.firebasePathGetter.users), null, () => {
          this[GET_USERS](this.usersData);
          this.getCapacityData()
      })
    },
    createNewWeekRecord() {
      FBApp.ref(this.firebasePathGetter.users).once('value').then((snapshot) => {
        let user;
        const users = snapshot.val();
        const weekData = {};
        for (user in users) {
          const userString = this.createUserString(users[user]);
          if(this.skipUser(users[user])) {
            continue;
          }
          weekData[users[user]['alias']] = userString;
        }
        FBApp.ref(this.firebasePathGetter.capacity +"/" + this.currentWeekGetter).set(weekData)
          .then(() => {
            this.getCapacityData();
          })
      });
    }
  },
  watch: {
    activeUserGetter (newCount, oldCount) {
      if (!newCount.isAnonymous) {
        this.getUsersData();
      } else {
        this[GET_USERS]([]);
        this[GET_CAPACITY]([]);
      }
    },
    currentWeekGetter (newCount) {
      this.getCapacityData();
    }
  },
  created () {
    if (!this.activeUserGetter.isAnonymous) {
      this.getUsersData();
    } else {
        this[GET_USERS]([]);
        this[GET_CAPACITY]([]);
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