const assert = require('node:assert/strict');
const fs = require('node:fs');
const path = require('node:path');
const test = require('node:test');
const vm = require('node:vm');

const html = fs.readFileSync(path.join(__dirname, '../index.html'), 'utf8');
const script = html.split('<script>')[1].split('</script>')[0];

test('White L10 screens the northeast corridor from Black K10 and L9', () => {
  const context = new Proxy({}, {
    get: (_, key) => key === 'createRadialGradient'
      ? () => ({ addColorStop() {} })
      : () => {}
  });
  const elements = new Map();
  const document = {
    getElementById(id) {
      if (!elements.has(id)) {
        elements.set(id, {
          value: id === 'model' ? 'geometry' : 'alternate',
          checked: true,
          getContext: () => context,
          addEventListener() {}
        });
      }
      return elements.get(id);
    }
  };

  vm.runInNewContext(script + `
    const point = name => (size - Number(name.slice(1))) * size + letters.indexOf(name[0]);
    const white = point('L10');
    const northeast = 1 << 3;
    const screened = ['P15', 'Q15', 'R15'];
    const outside = ['O15', 'S15'];

    place(point('K10'));
    get('tool').value = '1';
    place(point('L9'));
    for (const name of [...screened, ...outside]) {
      assert.equal(geometryMasks[1][point(name)] & (northeast * 0x1111), northeast * 0x1111);
    }

    get('tool').value = '2';
    place(white);
    assert.equal(inspectChain(position().board, white).liberties.size, 2);

    for (const mirror of [true, false]) {
      get('mirror').checked = mirror;
      render();
      assert.ok(totals[2].every(value => value === 0));
      for (const name of screened) {
        assert.equal(geometryMasks[1][point(name)] & (northeast * 0x1111), 0, name);
      }
      for (const name of outside) {
        assert.equal(geometryMasks[1][point(name)] & (northeast * 0x1111), northeast * 0x1111, name);
      }
    }

    get('back').onclick();
    assert.equal(geometryMasks[1][point('Q15')] & (northeast * 0x1111), northeast * 0x1111);
    get('forward').onclick();
    assert.equal(geometryMasks[1][point('Q15')] & (northeast * 0x1111), 0);
  `, { assert, document });
});
