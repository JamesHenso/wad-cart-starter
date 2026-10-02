# AGENTS.md — rules for this repository

Read this file completely before changing anything. It is the rules file for the
IA#1 harness: it tells you what this project is, how to run it, what "correct"
means, and what you are forbidden to do. If a rule here conflicts with your own
instincts, the rule wins.

---

## 1. What this project is

- **Course:** CSC13008 *LLM-Assisted Programming*.
- **Assignment:** IA#1 — implement `cartTotal` against the specification in
  `README.md`, with `npm test` as the first gate.
- **Shape:** a tiny, dependency-free JavaScript library with exactly one exported
  function and its test suite. There is no app, no server, no database, no build
  step, and no framework.
- **How it is marked:** the marker runs the code and the tests. Reading the code
  is not enough — behaviour is checked by execution.

## 2. Stack

| Thing | Choice | Notes |
| --- | --- | --- |
| Language | JavaScript (ES2022+) | Plain JavaScript. No TypeScript, no JSX. |
| Module system | ES modules | `"type": "module"` in `package.json`. Use `import` / `export`. |
| Runtime | Node.js 24 LTS | `node --version` must print v24.x on your machine and in CI. |
| Test runner | `node:test` (built-in) | Run through `node --test`. No Jest, no Vitest, no Mocha. |
| Assertions | `node:assert/strict` | Already imported in `test/cart.test.js`. |
| Package manager | npm 11 | There is nothing to install. |
| Version control | Git, one commit on `main` at the start | Commit in small, meaningful steps. |
| CI | GitHub Actions, must run on push | Not wired up yet — see §8. |

**Zero dependencies is a hard requirement.** `node_modules` must not exist in the
submission, and `package.json` must keep its three original fields plus `scripts`.

## 3. Repository layout

```
.
├── .github/workflows/   (required — CI; does not exist yet)
├── src/
│   └── cart.js          the deliverable: exports cartTotal(items, options)
├── test/
│   └── cart.test.js     the test suite; one test per rule
├── .gitignore           node_modules/ and .env — do not add to it
├── AGENTS.md            this file
├── AI-LOG.md            account of how the assistant was used
├── SELF_ASSESSMENT_REPORT.md
├── brief.md             the brief given to the assistant
├── package.json         name, version, type, scripts.test
└── README.md            the specification — authoritative, read-only
```

`README.md` is the single source of truth for behaviour. If this file and the
README ever disagree about behaviour, the README wins and `AGENTS.md` is the bug.

## 4. Commands

Run from the repository root.

| Command | What it does | When to use it |
| --- | --- | --- |
| `npm test` | Runs the whole suite with `node --test` | Before every commit and before you claim anything works |
| `npm run check` | Second gate: `node --check` over `src/cart.js` and `test/cart.test.js`, non-zero exit on a syntax error | Alongside `npm test`, and in CI |
| `npm test -- --test-reporter=spec` | Same run, readable per-test output | When you need to see which test fails |
| `npm test -- --test-name-pattern="empty cart"` | Runs only matching tests | While iterating on one rule |
| `node --test test/cart.test.js` | Runs the single suite file directly | Fast loop; same result as `npm test` |
| `node -e "import('./src/cart.js').then(m => console.log(m.cartTotal([], { vatRate: 0.08, freeShipFrom: 500000, shipFee: 30000 })))"` | One-off sanity check from the shell | Quick check of a single case without writing a test |
| `git status --short` | Shows what you changed | Before committing |
| `git diff` | Shows the exact change | Before committing and when writing `AI-LOG.md` |

There is **no** `lint`, `format`, `build`, `start` or `dev` script. Do not invent
one and do not add one in passing.

## 5. The specification, in full

```js
cartTotal(items, options) // -> number
```

- `items`: `[{ name, price, qty }]`
- `options`: `{ vatRate, freeShipFrom, shipFee }`
- `subtotal` = sum of `price * qty`
- `vat` = `vatRate` applied to the subtotal
- `shipping` = `0` when `subtotal >= freeShipFrom`, otherwise `shipFee`
- return `subtotal + vat + shipping`, **a number**, rounded to the whole đồng
- an empty cart returns `0` — no VAT, no shipping
- a negative `price`, or a `qty` that is not a positive integer, throws `RangeError`

Worked example: `2 × 180000 + 1 × 45000 = 405000` subtotal, VAT `32400`, shipping
`30000` (below the `500000` threshold) → **`467400`**.

Interpretation rules that are not spelled out in the README:

1. **Round once, at the end.** Compute `subtotal + vat + shipping`, then
   `Math.round` the sum. Rounding the VAT separately is wrong.
2. **The threshold is inclusive** — `subtotal === freeShipFrom` ships free.
3. **The empty cart short-circuits** before the shipping rule; otherwise
   `0 < freeShipFrom` would add `shipFee` to a cart that must total `0`.
4. **Validate before you total.** Throw the `RangeError` while scanning items, so
   an invalid cart throws instead of returning a partial number.
5. **The return value is a `number`.** `assert.equal(x, 467400)` fails for
   `'467400'`.

## 6. Coding rules

- Match the existing style exactly: **single quotes, no semicolons, 2-space
  indent**, one blank line between top-level statements. No formatter will fix
  this for you, so get it right by hand.
- Named exports only. `export function cartTotal(...)`.
- Small functions, early returns, no clever one-liners. The marker will read this
  code out loud in class.
- Do not mutate `items`, the objects inside it, or `options`.
- No classes, no closures with hidden state, no module-level mutable variables.
- Comments explain *why*, not *what*. Do not narrate the code line by line.
- Keep `src/cart.js` readable on one screen. If it grows past ~40 lines, the logic
  is probably doing something the spec did not ask for.

## 7. Testing rules

- Use `node:test` and `node:assert/strict`. Import them; never reach for globals.
- **One rule per test.** A test that fails for two reasons is two tests.
- Name tests after the rule, in plain English: `'an empty cart returns 0'`,
  `'a negative price throws RangeError'`.
- Assert on the **specification**, never on the implementation. Assert the return
  value; do not assert on intermediate variables, call counts, or private helpers.
- Keep the starter test `'the example from the slides'` unchanged. It is the
  marker-facing example.
- Never weaken an assertion to make a test pass — no deleting expectations, no
  loosening `467400` to a range, no `try`/`catch` that swallows a throw.
- No `.only`, no `.skip`, no commented-out tests in the final suite.
- Cover the four areas explicitly: worked example, empty cart, free-shipping
  threshold (both sides), and both `RangeError` cases.

## 8. The gate

**Currently working:** `npm test` — this is the gate today, and it must be green.

**Required for full marks, not yet present — add these when you get to them:**

1. A second gate command, one of format or lint. Cheapest option that keeps the
   zero-dependency rule: do not install ESLint or Prettier. Instead add a
   `npm run check` script to `package.json` that runs `node --check` over the
   source and test files and exits non-zero on a syntax error, and document it in
   §4 of this file.
2. `.github/workflows/ci.yml` running on `push` (and `pull_request`), on
   `actions/checkout` + `actions/setup-node` with `node-version: 24`, executing
   the same gate commands as §4. A green local run with a red CI is scored as a
   red CI.

Definition of done for any change you make:

- [ ] `npm test` passes.
- [ ] The second gate command passes.
- [ ] CI is green on the pushed commit.
- [ ] `git diff` touches only files you meant to touch.
- [ ] `AI-LOG.md` mentions this change.

## 9. Never

- **Never add a dependency.** No `npm install`, no `package.json` `dependencies`
  or `devDependencies`, no imports from outside Node's standard library. The
  assignment is explicitly dependency-free.
- **Never return a formatted string.** `toFixed()` returns a string and fails the
  assertion. Round with `Math.round` and return a number.
- **Never edit `README.md`** to match your implementation, and never "fix" a test
  that disagrees with the README. The README is the specification.
- **Never delete, rename, or weaken the starter test** `'the example from the
  slides'`.
- **Never commit failing or skipped tests**, and never commit with a red
  `npm test`. Run it first.
- **Never parse money out of strings** (`parseInt`, `parseFloat`, `Number(...)`
  on user input) — prices are already numbers.
- **Never add validation the specification does not require** (missing options,
  `vatRate` ranges, `name` validation). Extra error paths are out of scope and
  can only lose marks.
- **Never commit secrets, `.env` files, or your student ID into source files.**
- **Never force-push `main`, rewrite history, or amend the starter commit.**
- **Never claim a result you did not run.** "It works on my machine" is what CI
  is for; if you did not run it, say so.
- **Never write `AI-LOG.md` after the fact** to match what happened. It must
  match `git log` and `git diff`.

## 10. Submission

One zip named `<StudentID>_<total>.zip`, where `<total>` is the mark you claim for
yourself in `SELF_ASSESSMENT_REPORT.md`. The zip contains this repository with
`npm test` green, plus `brief.md`, `AGENTS.md`, `AI-LOG.md`, and
`SELF_ASSESSMENT_REPORT.md`. Every rubric claim needs an evidence line pointing at
a file, a section, a commit, or a test name.

## 11. When you are stuck

1. Re-read `README.md` §"What to implement" and §5 of this file.
2. Re-read the failing assertion — the message names the expected and actual value.
3. Write the smallest failing test that reproduces the problem, then fix it.
4. If the specification is genuinely ambiguous, choose the reading a stranger
   would guess, implement it, and record the decision in `AI-LOG.md`. Do not
   change the spec.
