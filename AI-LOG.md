# AI-LOG

### 2026-10-02 — cartTotal implementation

**Tool:**
Opencode (Model: Big Pickle), with the superpowers `test-driven-development` skill loaded.

**Asked for:**
Implement the `cartTotal` function in `src/cart.js` and unit tests in `test/cart.test.js` based on `brief.md` without external dependencies.

**What it produced:**
- `src/cart.js` — a 27-line `cartTotal`: empty-cart short-circuit, a scan loop that validates then accumulates the subtotal, `vat`, a `shipping` ternary with an inclusive `freeShipFrom`, and one `Math.round` at the end. The only errors thrown are `RangeError` for `price < 0` (`src/cart.js:11`) and for a `qty` that is not a positive integer (`src/cart.js:15`).
- `test/cart.test.js` — 10 tests, one rule each, built by watching every one of them fail first. The starter test `the example from the slides` was left byte-identical; the file diff is insertions only.

**What I changed:**
- **Scope, twice.** The agent first added an `npm run check` script to `package.json` and bumped `ci.yml` to Node 24 on `push, pull_request`; I had it reverted, because `brief.md` §4 says not to touch `package.json` or `.github/`. Later, to close the gaps `AGENTS.md` §8 asks for, I had both changes put back deliberately — that was my call, not the agent's.
- **Corrected this log twice.** An earlier version of this entry claimed 14 tests, `options = {}` defaults, a `!Array.isArray(items)` `TypeError`, `typeof item.price` / `Number.isNaN` guards, and `RangeError`s on `vatRate` / `shipFee` / `freeShipFrom`. None of that code exists in this repository, and `AGENTS.md` §9 requires this file to match `git log` and `git diff`. The claims are deleted rather than implemented, because `AGENTS.md` §9 and `brief.md` §8 forbid validation the specification does not name.
- Added the two missing tests after the fact: rounding (which is only observable with a fraction of a dong) and the do-not-mutate rule.
- Committed as `6c1fadc` and pushed to `origin/main`.

**What I rejected:**
- **The agent's first mutation harness.** It applied each injected bug to the already-mutated file, so six bugs piled onto one run and the output proved nothing. I had it rewritten to revert after every mutation; only the second run counts as evidence.
- **The agent's proposal to give `options` a `= {}` default.** The signature in `brief.md` §5 is `(items, options)`, and `AGENTS.md` §9 rules out error paths for missing options.
- **Any claim I could not verify.** I removed "nothing has been pushed" from this log after checking `git ls-remote` and finding the work already on `origin/main` — I had written it from memory and it was wrong.

**What I wrote by hand:**
- The agent harness rules file: `AGENTS.md`.
- The GitHub Actions CI pipeline configuration: `.github/workflows/ci.yml`.
- The reasoning behind both scope reversals above, and the decision to let the two later tests stand even though they were written after the implementation rather than before it.

**Note on the `item.price < 0` check:** an earlier version of this entry said I had rejected that check in favour of stricter type guards. That was wrong — `item.price < 0` is the check that shipped (`src/cart.js:11`), because `AGENTS.md` §9 forbids the extra guards.