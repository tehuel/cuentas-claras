---
trigger: always_on
description: Maintain Spanish UI conventions, Bootstrap 5 Flatly styling, and theme mode compatibility.
---

# UI, Styling & Localization Conventions

## Spanish UI Vocabulary
All user-facing UI text, buttons, modals, and placeholders must be in **Spanish** (`es-AR` locale context), consistent with existing domain terms:
- *Participantes* (Members)
- *Gastos* (Expenses)
- *Pagos* (Payments)
- *Reparto* (Settlement / Transfers)
- *Monto* (Amount)
- *Pagado por* / *Pagó* (Paid by)
- *Compartir entre* (Split between)
- *le debe a* (owes to)
- *le paga a* (pays to)

## Styling & Themes
- Use standard Bootstrap 5 utility classes (`d-flex`, `card`, `list-group`, `gap-*`, `btn-outline-*`) rather than writing custom CSS unless strictly necessary.
- The app uses Bootswatch Flatly with dynamic dark/light theme support toggled by `data-bs-theme="light"` / `data-bs-theme="dark"` on `document.body`.
- Use theme-aware Bootstrap classes (`bg-secondary-subtle`, `text-secondary`, `badge text-bg-*`) so elements render correctly in both light and dark themes.

## Number & Currency Formatting
- Format currency amounts using `useNumberFormat()` from `src/numberFormatter.ts` (`es-AR` locale) or tabular numeric alignment (`font-variant-numeric: tabular-nums`).

