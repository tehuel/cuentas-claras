---
trigger: always_on
description: Mandatory command verification checklist before finishing any agent task.
---

# Verification Checklist Before Completing Tasks

Always verify code changes before considering any task complete.

## Required Commands
Run the following compound command from the repository root:
```bash
npm run test && npm run lint && npm run build
```

## Checks Performed
1. **`npm run test`**: Executes Vitest unit tests in `src/calculator.test.ts`. All tests must pass.
2. **`npm run lint`**: Runs ESLint flat config with auto-fix. Verifies Vue SFC syntax, TypeScript types, and strict alphabetical import sorting (`sort-imports`).
3. **`npm run build`**: Runs `tsc` (TypeScript compiler with `noEmit: true`, `verbatimModuleSyntax: true`) and `vite build` to verify the production bundle.

Do not submit changes or report a task complete if any of these checks fail.

