import type { Transfer } from './calculator'
import { useNumberFormat } from './numberFormatter'

export function formatTransfersSummary(transfers: Transfer[]): string {
  if (transfers.length === 0) {
    return ''
  }

  const { format } = useNumberFormat('es-AR')
  const lines = [
    '*Cuentas Claras - Reparto final:*',
    ...transfers.map(
      (t) => `• ${t.from} le debe a ${t.to}: $ ${format(Math.round(t.amount), { maximumFractionDigits: 0 })}`
    ),
  ]

  return lines.join('\n')
}
