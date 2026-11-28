const assert = require('node:assert/strict');
const fs = require('node:fs');
const path = require('node:path');
const test = require('node:test');
const vm = require('node:vm');

const script = fs.readFileSync(path.join(__dirname, '../influence-operator.js'), 'utf8');
const { calculateOperatorInfluence } = vm.runInNewContext(script + '\n({ calculateOperatorInfluence })');
const size = 19;
const point = (row, col) => row * size + col;

test('K10 and K11 reproduce the reference field at every point', () => {
  const board = new Uint8Array(size * size);
  board[point(8, 9)] = board[point(9, 9)] = 1;
  const expectedRows = [
    '1111000000000001111',
    '1111100000000011111',
    '1111110000000111111',
    '0111111000001111110',
    '0011111100011111100',
    '0001111110111111000',
    '0000111112111110000',
    '0000011112111100000',
    '0000001220221000000',
    '0000001220221000000',
    '0000011112111100000',
    '0000111112111110000',
    '0001111110111111000',
    '0011111100011111100',
    '0111111000001111110',
    '1111110000000111111',
    '1111100000000011111',
    '1111000000000001111',
    '1110000000000000111',
  ];

  const [, black, white] = calculateOperatorInfluence(board, size);
  const rows = Array.from({ length: size }, (_, row) =>
    black.slice(point(row, 0), point(row + 1, 0)).join(''));
  assert.deepEqual(rows, expectedRows);
  assert.ok(white.every(value => value === 0));
});

test('Different directions add and each color has its own field', () => {
  const board = new Uint8Array(size * size);
  board[point(8, 8)] = board[point(8, 10)] = 1;
  board[point(10, 8)] = 2;
  const target = point(9, 9);

  const [, black, white] = calculateOperatorInfluence(board, size);
  assert.equal(black[target], 2);
  assert.equal(white[target], 1);
});
