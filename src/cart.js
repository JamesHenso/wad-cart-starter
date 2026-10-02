export function cartTotal(items, options) {
  // An empty cart must total 0, so it never reaches the shipping rule below.
  if (items.length === 0) {
    return 0
  }

  let subtotal = 0

  // Validate while scanning, so an invalid cart throws instead of totalling.
  for (const item of items) {
    if (item.price < 0) {
      throw new RangeError('price must not be negative')
    }

    if (!Number.isInteger(item.qty) || item.qty <= 0) {
      throw new RangeError('qty must be a positive integer')
    }

    subtotal += item.price * item.qty
  }

  const vat = subtotal * options.vatRate
  const shipping = subtotal >= options.freeShipFrom ? 0 : options.shipFee

  // Round once, at the end: rounding the vat on its own loses đồng.
  return Math.round(subtotal + vat + shipping)
}
