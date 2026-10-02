# Brief — implement `cartTotal` (CSC13008, IA#1)

This is the brief handed to the AI assistant. It is complete on purpose: a stranger
who has only this file and the repository should be able to produce the required
result without asking a follow-up question.

---

## 1. Context

This repository is the session 2 starter for CSC13008 *LLM-Assisted Programming*.
`src/cart.js` currently throws `Error('not implemented')` and one test in
`test/cart.test.js` is red. The specification lives in `README.md` — this brief
restates it so that nothing has to be inferred.

## 2. Task

Implement the single exported function `cartTotal` in `src/cart.js`, then extend
`test/cart.test.js` so that every rule in the specification is covered.

## 3. Files you may touch

| File | What you may do |
| --- | --- |
| `src/cart.js` | Implement `cartTotal`. This is the deliverable. |
| `test/cart.test.js` | **Add** new tests. Keep the existing test named `the example from the slides` exactly as it is. |

## 4. Files you must not touch

- `README.md` — it is the specification. Never edit the spec to match your code.
- `package.json` — in particular, **do not add dependencies or scripts**.
- `.gitignore` — nothing to add; the assignment must stay dependency-free.
- Anything under `.github/` — out of scope for this brief.

## 5. The contract

```js
cartTotal(items, options) // -> number
```

- `items`: array of `{ name, price, qty }`
- `options`: `{ vatRate, freeShipFrom, shipFee }`
- `subtotal` = sum of `price * qty` over all items
- `vat` = `vatRate` applied to the subtotal
- `shipping` = `0` when `subtotal >= freeShipFrom`, otherwise `shipFee`
- return `subtotal + vat + shipping`, **a number**, rounded to the whole đồng

### Worked example (must hold exactly)

```
items   = [{ name: 'Áo thun', price: 180000, qty: 2 },
           { name: 'Sổ tay',  price: 45000,  qty: 1 }]
options = { vatRate: 0.08, freeShipFrom: 500000, shipFee: 30000 }

subtotal = 2 * 180000 + 1 * 45000 = 405000
vat      = 0.08 * 405000          = 32400
shipping = 30000                  (405000 < 500000)
total    = 405000 + 32400 + 30000 = 467400
```

`cartTotal(items, options)` must `=== 467400` (the number, not `'467400'`).

## 6. Error cases — both must throw `RangeError`

| Case | Condition |
| --- | --- |
| Negative price | `price < 0` for any item |
| Bad quantity | `qty` is not a positive integer — i.e. `!(Number.isInteger(qty) && qty > 0)` |

Throw before returning anything; the message text is not graded, but it must be a
`RangeError` and not a subclass or a generic `Error`. `0`, `-1`, `1.5`, `NaN` and
`'2'` are all invalid quantities.

## 7. Edge cases — must be handled

- **Empty cart** (`items` is `[]`) returns `0`: no VAT and **no shipping**, even
  though `0 < freeShipFrom`. Do not fall through to the normal shipping rule.
- **Threshold is inclusive**: a subtotal of exactly `freeShipFrom` ships free.
- **Rounding happens once, at the end**: compute the full sum, then round it with
  `Math.round`. Do not round the VAT separately.
- **Return a number.** `toFixed()` returns a string and therefore fails
  `assert.equal(x, 467400)`.
- **Do not mutate** the `items` array or the objects inside it.
- Money is never read from strings or parsed — `price` and the options are
  already numbers.

## 8. Constraints

- Plain JavaScript, ES modules (`package.json` has `"type": "module"`).
- **No dependencies.** Neither runtime nor dev. Nothing to `npm install`. Only
  Node's built-ins may be used.
- Tests use `node:test` and `node:assert/strict` — already imported in the file.
- Match the existing style: single quotes, no semicolons, 2-space indent.
- Keep the implementation short and readable. No classes, no extra exported
  helpers unless a test needs one.
- Do not add input validation for cases the specification does not name
  (e.g. missing `options`, `vatRate` ranges). Out of scope.

## 9. Tests you must add to `test/cart.test.js`

One `test(...)` block per rule, so that each test can fail for exactly one reason:

1. `the example from the slides` — already present, leave it untouched.
2. an empty cart returns `0`.
3. shipping is `0` when the subtotal is exactly `freeShipFrom`.
4. shipping is `shipFee` when the subtotal is just below `freeShipFrom`.
5. a negative price throws `RangeError`.
6. a non-positive-integer quantity throws `RangeError`.
7. the result is a `number`, not a string (`typeof result === 'number'`).

Assert on the specification, not on the implementation — never assert on
intermediate variables or on the number of operations.

## 10. Acceptance criteria

- [ ] `npm test` passes, all tests green, no test skipped or `.only`.
- [ ] `cartTotal(items, options) === 467400` for the worked example.
- [ ] Both `RangeError` cases throw.
- [ ] Empty cart returns the number `0`.
- [ ] `git diff` shows changes only in `src/cart.js` and `test/cart.test.js`.
- [ ] `package.json` is unchanged and `node_modules` is not required.

## 11. Out of scope

Formatting or lint tooling, CI configuration, the submission zip, `AI-LOG.md`,
`SELF_ASSESSMENT_REPORT.md`, and any change to the specification itself. Those are
handled outside this brief — do not do them here.
