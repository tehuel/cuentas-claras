---
trigger: always_on
description: Preserve floating-point precision tolerance and test coverage in calculator.ts.
---

# Balance Calculation Precision & Test Coverage

The core business logic resides in `src/calculator.ts`.

## Guidelines
- Floating-point tolerance is `1e-9` (`Math.abs(amount) < 1e-9`). Do NOT replace this with strict equality (`=== 0`) to prevent floating-point representation bugs and micro-dust balances.
- If modifying calculation logic or payment logic, always run `npm run test` and ensure all test cases in `src/calculator.test.ts` pass.
- Add new test cases to `src/calculator.test.ts` whenever introducing new financial split or settlement scenarios.
- The balance calculation output `Transfer[]` must always represent minimal greedy debt settlements where `from` owes `to` the specified positive `amount`.

