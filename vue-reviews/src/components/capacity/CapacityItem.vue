<template>
  <div class="capacity-cell capacity-editable-data">
    <div v-if="!editing" class="capacity-data-wrapper" tabindex="2" @focus="setFocusedUser" @blur="unsetFocusedUser" @keyup="startEditData" @dblclick="startEditData">
      <span>{{ data }}</span>
    </div>
    <input type="text" class="capacity-data-wrapper" tabindex="2" v-if="editing" @focus="setFocusedUser" @blur="inputBlurred" @keydown="editData"/>
  </div>
</template>

<script>

import firebase from 'firebase';
import { mapActions, mapGetters } from 'vuex';

import FBApp from '@/data/firebase-config';
import { SET_FOCUSED_CELL } from '@/data/mutation-types';

export default {
  name: 'CapacityItem',
  props: ['user', 'type', 'day', 'data'],
  data() {
    return {
      focused: false,
      editing: false
    }
  },
  computed: {
    ...mapGetters(['firebasePathGetter', 'capacityByUserGetter', 'activeUserGetter']),
  },
  methods: {
    ...mapActions([SET_FOCUSED_CELL]),
    setFocusedUser(event) {
      this[SET_FOCUSED_CELL]({
        user: this.user,
        type: this.type,
        day: this.day
      });
    },
    getUpdatedString(value) {
      let capacityArray = this.capacityByUserGetter(this.user).split('|');
      let index;
      switch (this.type) {
        case 'requested':
          index = 0;
          break;
        case 'received':
          index = 1;
          break;
        case 'tickets':
          index = 2;
          break;
      }
      let splitCapacity = capacityArray[index].split(',');
      splitCapacity[this.day] = value;
      capacityArray[index] = splitCapacity.join(',');
      return capacityArray
    },
    submitUpdate(value) {
      let updatedData = {};
      if(value === this.data) {
        return;
      }
      updatedData[this.user] = this.getUpdatedString(value).join('|');
      FBApp.ref(this.firebasePathGetter.capacity +'/' +  this.$store.state.currentWeek ).update(updatedData);
    },
    unsetFocusedUser(){
      this.focused = false;
      this[SET_FOCUSED_CELL]({});
    },
    startEditData(event) {
      let allowedKey = /\d/;
      if(!allowedKey.test(event.key) && event.type !== 'dblclick' || this.activeUserGetter.isAnonymous === true) {
        return;
      }
      this.editing = true;
      this.$nextTick(() => {
        this.$el.getElementsByTagName('input')[0].focus();
        this.$el.getElementsByTagName('input')[0].value = event.key ? event.key : this.data;
      });
    },
    inputBlurred(event) {
      this.editing = false;
      this.submitUpdate(event.target.value);
    },
    editData(event) {
      if(event.keyCode === 13) {
        console.log('TODO =====> check whether new data is different from the old one and handle data SUBMISSION, if necessary, and move focus to the cell below');
      } else if(event.keyCode === 27) {
        event.target.value = this.data;
        this.editing = false;
        this.$nextTick(() => {
          this.$el.getElementsByTagName('div')[0].focus();
        });
      }
    }
  }
}
</script>

<style>
.capacity-subteam {
  flex: 0 0 100%;
  border-bottom: 2px solid purple;
}
      .capacity-editable-data {
        display: flex;
        flex: 0 0 33.333%;
        align-items: stretch;
      }

.capacity-data-wrapper {
  flex: 0 0 100%;
  display: flex;
  align-items: center;
}

input.capacity-data-wrapper {
  width: 100%;
  border: none;
  text-align: center;
  background-color: transparent;
}
</style>