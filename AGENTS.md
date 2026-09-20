# AGENTS.md

> Operational index, architecture guide, and development rules for AI coding agents and contributors working in `cuentas-claras`.

---

## 1. Project Overview

**Cuentas Claras** ("*Cuentas claras conservan la amistad*") is a lightweight, responsive web application for managing and settling shared group expenses among friends, roommates, or travel companions.

- **Production URL**: [https://cc.tehuel.com.ar](https://cc.tehuel.com.ar)
- **Author**: Tehuel Torres Baldi
- **Language & Locale**: Spanish UI (`es-AR` locale for currency & number formatting)
- **Deployment**: Automatic deployment to VPS via GitHub Actions (`.github/workflows/deploy.yml`) on push to `main`.

---

## 2. Tech Stack & Dependencies

| Layer | Technology | Details |
| :--- | :--- | :--- |
| **Framework** | Vue 3 (`^3.5.35`) | Composition API with `<script setup lang="ts">` |
| **State Management** | Pinia (`^4.0.3`) | Global reactive store with `localStorage` persistence |
| **Language** | TypeScript (`~5.9.3`) | `verbatimModuleSyntax: true`, `allowImportingTsExtensions: true` |
| **Build Tool** | Vite (`^8.0.0-beta.13`) | Fast dev server and client production bundler |
| **Testing** | Vitest (`^4.0.18`) | Unit tests for balance and debt simplification algorithms |
| **Linting & Quality** | ESLint (`^10.4.1`) | Flat config with `eslint-plugin-vue`, `typescript-eslint`, and strict `sort-imports` |
| **Styling & UI** | Bootstrap 5.3.8 + Bootswatch Flatly | Loaded via CDN in `index.html`; Bootstrap Icons 1.11.3 |

---

## 3. Repository Architecture & Agent Index

```text
cuentas-claras/
├── .agents/
│   └── rules/                  # Workspace agent rules (loaded hierarchically)
│       ├── calculator-precision.md
│       ├── import-sorting.md
│       ├── store-persistence.md
│       ├── typescript.md
│       ├── ui-localization.md
│       └── verification-checklist.md
├── .github/
│   └── workflows/
│       └── deploy.yml          # GitHub Actions deployment to VPS via SSH/rsync
├── public/                     # Static assets
├── src/
│   ├── components/             # Vue Single File Components (UI & forms)
│   │   ├── AppFooter.vue       # Footer with theme toggle and project links
│   │   ├── AppHeader.vue       # Application header and branding
│   │   ├── ExpenseAddForm.vue  # Form to register a new expense
│   │   ├── ExpenseEditForm.vue # Modal/inline form to edit an existing expense
│   │   ├── ExpenseListItem.vue # Expense row displaying amount, payer, and participant checklist
│   │   ├── ExpensesSection.vue # Expenses management section container
│   │   ├── MemberAddForm.vue   # Form to add a new group member
│   │   ├── MemberListItem.vue  # Member row with inline rename and delete controls
│   │   ├── MembersSection.vue  # Participants section container
│   │   ├── PaymentAddForm.vue  # Form to record direct reimbursement payments
│   │   ├── PaymentListItem.vue # Payment row with inline edit and delete controls
│   │   ├── PaymentsSection.vue # Direct payments section container
│   │   └── TransfersSection.vue# Final debt settlement transfers section ("Reparto")
│   ├── stores/
│   │   ├── expenses.test.ts    # Vitest unit tests for Pinia expenses store cascades
│   │   └── expenses.ts         # Pinia store managing members, expenses, payments, and storage
│   ├── App.vue                 # Root application component coordinating sections and loading state
│   ├── calculator.ts           # Pure algorithm: calculates net balances & minimal settlement transfers
│   ├── calculator.test.ts      # Vitest test suite for calculator algorithm (13 test scenarios)
│   ├── env.d.ts                # TypeScript environment definitions
│   ├── main.ts                 # Vue application bootstrap, Pinia initialization, theme setup
│   ├── numberFormatter.ts      # Argentinian Spanish number formatting utility (Intl.NumberFormat)
│   └── theme.ts                # Light/dark mode toggle logic and localStorage persistence
├── BACKLOG.md              # Planned improvements and bug fixes backlog (PR roadmap)
├── eslint.config.ts            # ESLint flat config with rules (includes sort-imports)
├── index.html                  # Main HTML entry with CDN links (Bootstrap, Bootswatch, Icons)
├── package.json                # Project dependencies and npm scripts
├── tsconfig.json               # TypeScript compiler options
└── vite.config.ts              # Vite bundler configuration with Vue plugin
```

### Key Modules & Responsibilities

#### `src/calculator.ts`
The core business logic of the app. It implements `calculateBalance(transactions, payments): Transfer[]`:
1. **Net Balance Calculation**:
   - For each expense, split equally across `participants`. The payer receives `+share * (N-1)` net, while other participants receive `-share`.
   - For each direct payment, the payer receives `+amount` and the receiver receives `-amount`.
2. **Debtor/Creditor Separation**:
   - Members with net balance `< -1e-9` are debtors.
   - Members with net balance `> 1e-9` are creditors.
3. **Greedy Debt Minimization**:
   - Greedily settles the minimum of the highest remaining debt and credit until all balances clear.
   - Outputs a list of `Transfer` items: `{ from: string, to: string, amount: number }`.

#### `src/stores/expenses.ts`
The reactive central store (`useExpensesStore`):
- **State**:
  - `members: string[]`: List of participant names.
  - `expenses: Expense[]`: Array of expense objects (`{ id, amount, from, participants, description }`).
  - `payments: Payment[]`: Array of direct reimbursement payments (`{ id, amount, from, to, description }`).
- **Getters**:
  - `transfers`: Calls `calculateBalance(this.expenses, this.payments)` when members and expenses exist.
- **Relational Invariants & Cascades**:
  - `addMember`: Automatically adds the new member as a participant to all existing expenses.
  - `removeMember`: Removes the member from all expense participant lists; reassigns payer if the deleted member was the payer; removes associated direct payments.
  - `updateMember`: Cascades name changes across all existing expenses (`from` and `participants`) and direct payments (`from` and `to`).
  - `saveState` / `loadState`: Serializes store state into `localStorage` under the key `'expensesAppState'`.

#### `src/theme.ts`
Manages theme toggling:
- Inspects system preference (`prefers-color-scheme: dark`) and `localStorage.getItem('theme')`.
- Applies the theme to `document.body.setAttribute('data-bs-theme', theme)`.
- Binds click listeners to buttons matching `[data-theme-toggle]`.

#### `src/numberFormatter.ts`
- Provides `useNumberFormat(locale = 'es-AR')` wrapper over `Intl.NumberFormat` for currency and number display.

---

## 4. Development Commands & Workflows

Run all commands from the repository root:

| Command | Description |
| :--- | :--- |
| `npm run dev` | Starts Vite local development server |
| `npm run build` | Compiles TypeScript (`tsc`) and builds production bundle (`vite build`) into `dist/` |
| `npm run preview` | Previews the local production build in `dist/` |
| `npm run test` | Runs the Vitest test suite (`vitest run`) |
| `npm run test:coverage`| Runs Vitest with coverage report |
| `npm run lint` | Runs ESLint with auto-fix (`eslint --fix`) |

---

## 5. Agent Rules Directory (`.agents/rules/`)

Operational rules are modularized into dedicated files under `.agents/rules/`. AI agents automatically discover and load these rules hierarchically:

| Rule File | Description | Core Requirement |
| :--- | :--- | :--- |
| [`.agents/rules/import-sorting.md`](.agents/rules/import-sorting.md) | Strict import ordering | Alphabetical import sorting enforced by ESLint (`sort-imports: "error"`). |
| [`.agents/rules/typescript.md`](.agents/rules/typescript.md) | Type-only imports | Explicit `import type` or `import { type ... }` for `verbatimModuleSyntax`. |
| [`.agents/rules/calculator-precision.md`](.agents/rules/calculator-precision.md) | Financial calculations | `1e-9` floating-point tolerance and maintaining 100% Vitest test passing. |
| [`.agents/rules/store-persistence.md`](.agents/rules/store-persistence.md) | Pinia store invariants | Member cascading on add/remove/rename and invoking `this.saveState()`. |
| [`.agents/rules/ui-localization.md`](.agents/rules/ui-localization.md) | UI & Spanish language | Bootstrap 5 utility styling, theme modes, and Spanish UI vocabulary. |
| [`.agents/rules/verification-checklist.md`](.agents/rules/verification-checklist.md) | Task verification | Mandatory execution of `npm run test && npm run lint && npm run build`. |

