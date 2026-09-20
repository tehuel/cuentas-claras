---
trigger: always_on
description: Enforce explicit type-only imports required by TypeScript verbatimModuleSyntax.
---

# TypeScript Verbatim Module Syntax

`tsconfig.json` enables `"verbatimModuleSyntax": true`.

## Guidelines
- When importing types or interfaces, use explicit type-only imports (`import type { ... }` or `import { type ... }`).
- Never import a type using value-import syntax; the TypeScript compiler (`tsc`) will error or omit imports inappropriately during build.
- `allowImportingTsExtensions: true` is enabled in `tsconfig.json`. When importing TypeScript files with `.ts` extension (or without), type-only imports must still be explicit.

### Example
```typescript
// Correct:
import { type Transfer, calculateBalance } from '../calculator'
// OR:
import type { Expense, Payment } from '../stores/expenses'

// Incorrect:
import { Transfer, calculateBalance } from '../calculator'
```

