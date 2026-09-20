---
trigger: always_on
description: Enforce strict alphabetical import sorting in all TypeScript, JavaScript, and Vue files.
---

# Strict Import Sorting (`sort-imports`)

ESLint enforces `"sort-imports": "error"` in `eslint.config.ts`.

## Guidelines
- All `import` statements within any file (`.ts`, `.vue`, `.js`) must be sorted alphabetically by import specifier.
- Destructured members in named imports must also be sorted alphabetically (e.g. `{ type Expense, useExpensesStore }`).
- Always run `npm run lint` before finishing any task to ensure imports pass linting.

### Example
```typescript
// Correct:
import { type Expense, useExpensesStore } from '../stores/expenses'
import { ref } from 'vue'
import ExpenseEditForm from './ExpenseEditForm.vue'

// Incorrect (unsorted):
import { useExpensesStore, type Expense } from '../stores/expenses'
import ExpenseEditForm from './ExpenseEditForm.vue'
import { ref } from 'vue'
```

