<template>
  <div class="capacity-cell capacity-editable-data" :class="{'capacity-copied': isCopied}">
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
import { SET_FOCUSED_CELL, SET_IS_EDITING, SET_COPY_CACHE } from '@/data/mutation-types';
import { navigationMixin } from './mixins/navigation';

export default {
  name: 'CapacityItem',
  props: ['user', 'type', 'day', 'data'],
  mixins: [navigationMixin],
  data() {
    return {
      focused: false,
      editing: false,
      prevKey: {
        timestamp: '',
        key: ''
      }
    }
  },
  computed: {
    ...mapGetters(['firebasePathGetter', 'capacityByUserGetter', 'activeUserGetter', 'editableItemClassGetter', 'copyCacheGetter']),
    isCopied() {
      if(this.copyCacheGetter.el !== null) {
      return this.copyCacheGetter.el === this.$refs.focusedCell

      }
    }
  },
  methods: {
    ...mapActions([SET_FOCUSED_CELL, SET_IS_EDITING, SET_COPY_CACHE]),
    setFocusedUser(event) {
      this[SET_FOCUSED_CELL](
        {
          cell: this.$refs.focusedCell,
          user: this.user
        }
      );
      
    },
    getUpdatedString(value) {
      const capacityArray = this.capacityByUserGetter(this.user).split('|');
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
      const splitCapacity = capacityArray[index].split(',');
      splitCapacity[this.day] = value;
      capacityArray[index] = splitCapacity.join(',');
      return capacityArray
    },
    submitUpdate(value) {
      const updatedData = {};
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
      if(event.keyCode === 67 && this.checkCtrl(event)){
        this[SET_COPY_CACHE]({
          data: this.data,
          el: this.$refs.focusedCell
        })
      }
      if(event.keyCode === 86 && this.checkCtrl(event)){
          if(this.copyCacheGetter.el !== null) {
            this.submitUpdate(this.copyCacheGetter.data);
          }
      }
      if(event.type === 'dblclick'){
        this[SET_IS_EDITING](true);
      }
      if(event.key === 'Delete'){
        this.submitUpdate('');
      }
      this.prevKey.key = event.key;
      this.prevKey.timestamp = Date.now();
      const allowedKey = /^\d|^o|^s/;
      if(!allowedKey.test(event.key) && event.type !== 'dblclick' || this.activeUserGetter.isAnonymous === true) {
        return;
      }
      this.editing = true;
      this[SET_COPY_CACHE]({});
      this.$nextTick(() => {
        const focusedInput = this.$refs.focusedInput;
        focusedInput.focus();
        focusedInput.value = event.key ? event.key : this.data;
      });
    },
    checkCtrl(event) {
      const wasCtrlPressedBefore = this.prevKey.key === 'Control' && (Date.now() - this.prevKey.timestamp) < 500;
      return wasCtrlPressedBefore || event.ctrlKey
    },
    inputBlurred(event) {
      this.editing = false;
      this[SET_IS_EDITING](false);
      this.submitUpdate(event.target.value);
    },
    editData(event) {
      const focusedCell = this.$refs.focusedCell;
      if(event.key === 'Enter' || event.key === 'NumEnter') {
        const cells = document.querySelectorAll(`.${this.editableItemClassGetter}`);
        const cellsArray = Array.prototype.slice.call(cells, 0);
        const nextCell = this.skipCells(cellsArray, focusedCell, 15);
        if(nextCell) {
          nextCell.focus();
        } else {
          this.editing = false;
          this[SET_IS_EDITING](false);
          this.$nextTick(() => {
            focusedCell.focus();
          });
        }
      } else if(event.key === 'Escape') {
        event.target.value = this.data;
        this.editing = false;
        this.$nextTick(() => {
          focusedCell.focus();
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

.capacity-copied {
  outline: 3px dashed red
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