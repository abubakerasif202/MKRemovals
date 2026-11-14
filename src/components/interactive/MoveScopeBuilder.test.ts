import test from 'node:test';
import assert from 'node:assert/strict';
import { EMPTY_INVENTORY, INVENTORY_ITEMS, SIZE_PRESETS, buildScopeSummary } from './MoveScopeBuilder';

test('inventory starts neutral: every counter is zero', () => {
  for (const item of INVENTORY_ITEMS) assert.equal(EMPTY_INVENTORY[item.id], 0);
});

test('an untouched inventory produces no summary (nothing silently attached)', () => {
  assert.equal(buildScopeSummary({ ...EMPTY_INVENTORY }, []), '');
});

test('summary lists only what the customer selected', () => {
  const summary = buildScopeSummary({ ...EMPTY_INVENTORY, 'sofa-lounge': 1, 'moving-cartons-10': 2 }, ['Apartment service lift booking']);
  assert.match(summary, /1x 3-Seater Sofa/);
  assert.match(summary, /~20 moving boxes/);
  assert.match(summary, /Apartment service lift booking/);
  assert.doesNotMatch(summary, /Bed/);
});

test('presets only reference real inventory ids', () => {
  const ids = new Set(INVENTORY_ITEMS.map((i) => i.id));
  for (const p of SIZE_PRESETS) for (const id of Object.keys(p.counts)) assert.ok(ids.has(id), id);
});
