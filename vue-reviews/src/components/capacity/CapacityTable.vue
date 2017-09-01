<template>
  <div class="capacity-table" @keydown="handleNavigation">
    <capacity-table-header></capacity-table-header>
    <capacity-team v-for="team in teamsGetter" :team="team" :key="team"></capacity-team>
  </div>
</template>

<script>
import { mapActions, mapGetters } from 'vuex';

import CapacityTableHeader from './CapacityTableHeader';
import CapacityTeam from './CapacityTeam';
import { navigationMixin } from './mixins/navigation';
import { SET_COPY_CACHE } from '@/data/mutation-types';

export default {
  name: 'CapacityTable',
  mixins: [navigationMixin],
  computed: {
    ...mapGetters(['teamsGetter', 'focusedCellGetter', 'editableItemClassGetter', 'isEditingGetter'])
  },
  methods: {
    ...mapActions([SET_COPY_CACHE]),
    handleNavigation(event) {
      if(this.isArrow(event.key) && !this.isEditingGetter) {
        event.preventDefault();
        const focusedCell = this.focusedCellGetter;
        const cells = document.getElementsByClassName((this.editableItemClassGetter));
        const cellsArray = Array.prototype.slice.call(cells, 0)
        let nextCell;
        let cellsNumber;
        switch (event.code) {
          case 'ArrowUp':
            cellsNumber = -15;
            break;
          case 'ArrowRight':
            cellsNumber = 1;
            break;
          case 'ArrowDown':
            cellsNumber = 15;
            break;
          case 'ArrowLeft':
            cellsNumber = -1;
        }
        nextCell = this.skipCells(cellsArray, focusedCell, cellsNumber);
        if(nextCell) {
          nextCell.focus();
        }
      }
      if(event.key === 'Escape'){
        this[SET_COPY_CACHE]({
          data: null,
          el: null
        });
      }
    },
    isArrow(key) {
      return ['ArrowUp', 'ArrowRight', 'ArrowDown', 'ArrowLeft'].indexOf(key) !== -1;
    }
  },
  components: {
    CapacityTableHeader,
    CapacityTeam
  }
}
</script>

<style scoped>
.capacity-table {
  border-top: 2px solid green;
  border-left: 2px solid green;
}
</style>