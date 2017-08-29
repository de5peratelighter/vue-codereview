<template>
  <div class="capacity-cell capacity-editable-data">
    <div v-show="!editing" class="capacity-data-wrapper" :class="editableItemClassGetter" ref="focusedCell" tabindex="2" @focus="setFocusedUser" @blur="unsetFocusedUser" @keyup="startEditData" @dblclick="startEditData">
      <span>{{ data }}</span>
    </div>
    <input type="text" class="capacity-data-wrapper" tabindex="2" ref="focusedInput" v-if="editing" @focus="setFocusedUser" @blur="inputBlurred" @keydown="editData"/>
  </div>
</template>

<script>

import firebase from 'firebase';
import { mapActions, mapGetters } from 'vuex';

import { FBApp } from '@/data/firebase-config';
import { SET_FOCUSED_CELL, SET_IS_EDITING } from '@/data/mutation-types';
import { navigationMixin } from './mixins/navigation';

export default {
  name: 'CapacityItem',
  props: ['user', 'type', 'day', 'data'],
  mixins: [navigationMixin],
  data() {
    return {
      focused: false,
      editing: false
    }
  },
  computed: {
    ...mapGetters(['firebasePathGetter', 'capacityByUserGetter', 'activeUserGetter', 'editableItemClassGetter']),
  },
  methods: {
    ...mapActions([SET_FOCUSED_CELL, SET_IS_EDITING]),
    setFocusedUser(event) {
      this[SET_FOCUSED_CELL](
        {
          cell: this.$refs.focusedCell,
          user: this.user
        }
      );
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
      if(event.type === 'dblclick'){
        this[SET_IS_EDITING](true);
      }
      const allowedKey = /^\d/;
      if(!allowedKey.test(event.key) && event.type !== 'dblclick' || this.activeUserGetter.isAnonymous === true) {
        return;
      }
      this.editing = true;
      this.$nextTick(() => {
        this.$refs.focusedInput.focus();
        this.$refs.focusedInput.value = event.key ? event.key : this.data;
      });
    },
    inputBlurred(event) {
      this.editing = false;
      this[SET_IS_EDITING](false);
      this.submitUpdate(event.target.value);
    },
    editData(event) {
      if(event.keyCode === 13) {
        const cells = document.querySelectorAll(`.${this.editableItemClassGetter}`);
        const cellsArray = Array.prototype.slice.call(cells, 0);
        const focusedCell = this.$refs.focusedCell;
        const nextCell = this.skipCells(cellsArray, focusedCell, 15);
        if(nextCell) {
          nextCell.focus();
        }
      } else if(event.keyCode === 27) {
        event.target.value = this.data;
        this.editing = false;
        this.$nextTick(() => {
          this.$refs.focusedCell.focus();
        });
      }
    }
  }
}
</script>

<style scoped>
div:focus {
  outline: 5px solid blue;
}
input:focus {
  outline: 5px solid yellow;
}
.capacity-editable-data {
  display: flex;
  flex: 0 0 33.333%;
  align-items: stretch;
}
.capacity-cell {
  border-right: 2px solid green;
  border-bottom: 2px solid green;
}
  .capacity-cell span {
    font-size: 12px;
    font-family: Roboto, "Noto Sans", Noto, sans-serif;
    text-align: center;
    flex: 0 0 100%;
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