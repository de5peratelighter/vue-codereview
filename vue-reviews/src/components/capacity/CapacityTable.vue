<template>
  <div class="capacity-table" @keydown="handleNavigation">
    <capacity-table-header></capacity-table-header>
    <capacity-team v-for="team in teamsGetter" :team="team" :key="team"></capacity-team>
  </div>
</template>

<script>
import { mapGetters } from 'vuex';

import CapacityTableHeader from './CapacityTableHeader';
import CapacityTeam from './CapacityTeam';
import { navigationMixin } from './mixins/navigation';

export default {
  name: 'CapacityTable',
  mixins: [navigationMixin],
  computed: {
    ...mapGetters(['teamsGetter', 'focusedCellGetter', 'editableItemClassGetter', 'isEditingGetter'])
  },
  methods: {
    handleNavigation(event) {
      if(!this.isArrow(event.code) || this.isEditingGetter) {
        return;
      }
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
    },
    isArrow(code) {
      return ['ArrowUp', 'ArrowRight', 'ArrowDown', 'ArrowLeft'].indexOf(code) !== -1;
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