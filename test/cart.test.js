import { test } from 'node:test'
import assert from 'node:assert/strict'
import { cartTotal } from '../src/cart.js'

// This test fails until you implement cartTotal. That is the point:
// run `npm test` first and see it red.
test('the example from the slides', () => {
  const items = [
    { name: 'Áo thun', price: 180000, qty: 2 },
    { name: 'Sổ tay', price: 45000, qty: 1 },
  ]
  const options = { vatRate: 0.08, freeShipFrom: 500000, shipFee: 30000 }
  assert.equal(cartTotal(items, options), 467400)
})

test('an empty cart returns 0', () => {
  const options = { vatRate: 0.08, freeShipFrom: 500000, shipFee: 30000 }
  assert.equal(cartTotal([], options), 0)
})

test('shipping is 0 when the subtotal is exactly freeShipFrom', () => {
  const items = [{ name: 'Áo thun', price: 250000, qty: 2 }]
  const options = { vatRate: 0.08, freeShipFrom: 500000, shipFee: 30000 }
  assert.equal(cartTotal(items, options), 540000)
})

test('shipping is shipFee when the subtotal is just below freeShipFrom', () => {
  const items = [{ name: 'Áo thun', price: 499000, qty: 1 }]
  const options = { vatRate: 0.08, freeShipFrom: 500000, shipFee: 30000 }
  assert.equal(cartTotal(items, options), 568920)
})

test('the vat is rounded once, with the whole total', () => {
  const items = [{ name: 'Sổ tay', price: 33333, qty: 3 }]
  const options = { vatRate: 0.08, freeShipFrom: 500000, shipFee: 0 }
  // 99999 subtotal + 7999.92 vat = 107998.92, rounded once at the end
  assert.equal(cartTotal(items, options), 107999)
})

test('a negative price throws RangeError', () => {
  const items = [{ name: 'Hoàn tiền', price: -1, qty: 1 }]
  const options = { vatRate: 0.08, freeShipFrom: 500000, shipFee: 30000 }
  assert.throws(() => cartTotal(items, options), RangeError)
})

test('a qty that is not a positive integer throws RangeError', () => {
  const options = { vatRate: 0.08, freeShipFrom: 500000, shipFee: 30000 }
  for (const qty of [0, -1, 1.5, Number.NaN, '2']) {
    assert.throws(
      () => cartTotal([{ name: 'Sổ tay', price: 45000, qty }], options),
      RangeError,
      `expected qty ${String(qty)} to be rejected`
    )
  }
})

test('the total is a number, not a string', () => {
  const items = [{ name: 'Áo thun', price: 180000, qty: 2 }]
  const options = { vatRate: 0.08, freeShipFrom: 500000, shipFee: 30000 }
  assert.equal(typeof cartTotal(items, options), 'number')
})

test('the subtotal, vat and shipping are rounded together, not separately', () => {
  // Fractional amounts on purpose. With whole dong, rounding the total once and
  // rounding each part first give the same number, so only a fraction of a dong
  // can tell the two rules apart.
  const items = [{ name: 'Sổ tay', price: 10, qty: 3 }]
  const options = { vatRate: 0.08, freeShipFrom: 500000, shipFee: 0.4 }
  // 30 + 2.4 + 0.4 = 32.8, rounded once gives 33; rounding the parts gives 32.
  assert.equal(cartTotal(items, options), 33)
})

test('the items and the options are not mutated', () => {
  const items = [
    { name: 'Áo thun', price: 180000, qty: 2 },
    { name: 'Sổ tay', price: 45000, qty: 1 },
  ]
  const options = { vatRate: 0.08, freeShipFrom: 500000, shipFee: 30000 }
  const before = JSON.stringify({ items, options })

  cartTotal(items, options)

  assert.equal(JSON.stringify({ items, options }), before)
})
