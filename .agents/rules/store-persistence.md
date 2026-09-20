---
trigger: always_on
description: Maintain store relational cascading invariants and localStorage persistence.
---

# Store Mutation Invariants & State Persistence

The Pinia store in `src/stores/expenses.ts` manages reactive state and persistence.

## Guidelines
- **State Persistence**: Every action in `src/stores/expenses.ts` that mutates state (`members`, `expenses`, `payments`) MUST invoke `this.saveState()`.
- **Member Addition Cascade**: When a new member is added via `addMember()`, they must automatically be added as a participant to all existing expenses.
- **Member Removal Cascade**: When a member is removed via `removeMember()`, they must be stripped from all expense participant lists, and if the deleted member was the payer (`from`), the payer must be reassigned to a valid remaining member.
- **Member Rename Cascade**: When a member is renamed via `updateMember()`, the change must cascade across `expenses` (`from` and `participants`) and `payments` (`from` and `to`) to avoid dangling references.
- **Storage Key**: App state is serialized into `localStorage` under the key `'expensesAppState'`.

