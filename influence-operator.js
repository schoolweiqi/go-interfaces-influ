'use strict';

function calculateOperatorInfluence(board, size) {
  const totals = [null, new Uint16Array(board.length), new Uint16Array(board.length)];

  board.forEach((color, source) => {
    if (!color) return;
    const field = totals[color];
    const sourceRow = Math.floor(source / size);
    const sourceCol = source % size;

    board.forEach((occupant, target) => {
      if (occupant) return;
      const rowDistance = Math.abs(Math.floor(target / size) - sourceRow);
      const colDistance = Math.abs(target % size - sourceCol);
      if (Math.abs(rowDistance - colDistance) > 2) return;

      // A point on either axis inside a diagonal band has weight two.
      field[target] += rowDistance === 0 || colDistance === 0 ? 2 : 1;
    });
  });

  return totals;
}
