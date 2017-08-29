export const navigationMixin = {
  methods: {
    skipCells(cells, currentCell, n) {
      const currentCellIndex = cells.indexOf(currentCell);
      const nextCellIndex = currentCellIndex + n;
      if(nextCellIndex < 0 || nextCellIndex > cells.length - 1 ) {
        return;
      } else {
        return cells[nextCellIndex];
      }
    }
  }
};