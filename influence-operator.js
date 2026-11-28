'use strict';

function calculateOperatorInfluence(board, size) {
  const directions = [[1, 1], [1, -1], [-1, -1], [-1, 1]];
  const counts = [0, 1, 1, 2, 1, 2, 2, 3, 1, 2, 2, 3, 2, 3, 3, 4];
  const masks = [null, new Uint8Array(board.length), new Uint8Array(board.length)];

  board.forEach((color, source) => {
    if (!color) return;
    const field = masks[color];
    const sourceRow = Math.floor(source / size);
    const sourceCol = source % size;

    board.forEach((occupant, target) => {
      if (occupant) return;
      const rowOffset = Math.floor(target / size) - sourceRow;
      const colOffset = target % size - sourceCol;
      if (Math.abs(Math.abs(rowOffset) - Math.abs(colOffset)) > 2) return;

      // Count a direction only once per color, even when several stones cover it.
      directions.forEach(([rowSign, colSign], direction) => {
        if (rowOffset * rowSign >= 0 && colOffset * colSign >= 0) {
          field[target] |= 1 << direction;
        }
      });
    });
  });

  return masks.map(field => field && field.map(mask => counts[mask]));
}
