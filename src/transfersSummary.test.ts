import { describe, expect, it } from 'vitest'
import { formatTransfersSummary } from './transfersSummary'

describe('formatTransfersSummary', () => {
  it('returns an empty string when transfers array is empty', () => {
    expect(formatTransfersSummary([])).toBe('')
  })

  it('formats a single transfer without decimals', () => {
    const transfers = [
      { from: 'Juan', to: 'Carlos', amount: 1500 },
    ]

    const expected = [
      '*Cuentas Claras - Reparto final:*',
      '• Juan le debe a Carlos: $ 1.500',
    ].join('\n')

    expect(formatTransfersSummary(transfers)).toBe(expected)
  })

  it('formats multiple transfers with line breaks and preserves order', () => {
    const transfers = [
      { from: 'Juan', to: 'Carlos', amount: 1500 },
      { from: 'María', to: 'Carlos', amount: 750 },
    ]

    const expected = [
      '*Cuentas Claras - Reparto final:*',
      '• Juan le debe a Carlos: $ 1.500',
      '• María le debe a Carlos: $ 750',
    ].join('\n')

    expect(formatTransfersSummary(transfers)).toBe(expected)
  })

  it('rounds fractional amounts to nearest whole number without decimals', () => {
    const transfers = [
      { from: 'Ana', to: 'Pedro', amount: 1234.4 },
      { from: 'Pedro', to: 'Carlos', amount: 1234.6 },
    ]

    const expected = [
      '*Cuentas Claras - Reparto final:*',
      '• Ana le debe a Pedro: $ 1.234',
      '• Pedro le debe a Carlos: $ 1.235',
    ].join('\n')

    expect(formatTransfersSummary(transfers)).toBe(expected)
  })
})
