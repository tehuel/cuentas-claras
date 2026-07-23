import { describe, expect, it } from 'vitest'
import { calculateBalance } from './calculator'

type Transaction = {
    amount: number,
    from: string,
    participants: string[],
}

type Payment = {
    amount: number,
    from: string,
    to: string,
}

describe('calculateBalance', () => {
    it('should calculate an initial empty balance', () => {
        const transactions: Transaction[] = []
        const balance = calculateBalance(transactions)
        expect(balance.length).toBe(0)
    })

    it('should calculate empty balance for a single transaction', () => {
        const transactions: Transaction[] = [
            { amount: 100, from: 'Alice', participants: ['Alice'] }
        ]
        const balance = calculateBalance(transactions)
        expect(balance.length).toBe(0)
    })

    it('should calculate empty balance for multiple transactions with same participant', () => {
        const transactions: Transaction[] = [
            { amount: 100, from: 'Alice', participants: ['Alice'] },
            { amount: 200, from: 'Alice', participants: ['Alice'] },
            { amount: 50, from: 'Alice', participants: ['Alice'] }
        ]
        const balance = calculateBalance(transactions)
        expect(balance.length).toBe(0)
    })

    it('should calculate balance for a single transaction with two participants', () => {
        const transactions: Transaction[] = [
            { amount: 100, from: 'Alice', participants: ['Alice', 'Bob'] }
        ]
        const balance = calculateBalance(transactions)
        expect(balance.length).toBe(1)
        expect(balance).toContainEqual({ amount: 50, from: 'Bob', to: 'Alice' })
    })

    it('should calculate balance for a single transaction with three participants', () => {
        const transactions: Transaction[] = [
            { amount: 90, from: 'Alice', participants: ['Alice', 'Bob', 'Charlie'] }
        ]
        const balance = calculateBalance(transactions)
        expect(balance.length).toBe(2)
        expect(balance).toContainEqual({ amount: 30, from: 'Bob', to: 'Alice' })
        expect(balance).toContainEqual({ amount: 30, from: 'Charlie', to: 'Alice' })
    })

    it('should settle multiple transactions with minimal transfers', () => {
        const transactions: Transaction[] = [
            { amount: 100, from: 'Alice', participants: ['Alice', 'Bob', 'Charlie'] },
            { amount: 150, from: 'Bob', participants: ['Alice', 'Bob', 'Charlie'] }
        ]
        const balance = calculateBalance(transactions)
        // Alice paid 100, owes 50+50=100, so balance +0
        // Bob paid 150, owes 33.33+50=83.33, so balance +66.67
        // Charlie owes 33.33+50=83.33
        // Should have minimal transfers (2 transfers for 3 people)
        expect(balance.length).toBeLessThanOrEqual(2)
    })

    it('should handle circular debts', () => {
        const transactions: Transaction[] = [
            { amount: 100, from: 'Alice', participants: ['Alice', 'Bob'] },
            { amount: 100, from: 'Bob', participants: ['Bob', 'Charlie'] },
            { amount: 100, from: 'Charlie', participants: ['Charlie', 'Alice'] }
        ]
        const balance = calculateBalance(transactions)
        // Each person paid 100 and owes 100, so balanced
        expect(balance.length).toBe(0)
    })

    it('should calculate correct amounts for unequal splits', () => {
        const transactions: Transaction[] = [
            { amount: 200, from: 'Alice', participants: ['Alice', 'Bob', 'Charlie', 'David'] }
        ]
        const balance = calculateBalance(transactions)
        expect(balance.length).toBe(3)
        expect(balance).toContainEqual({ amount: 50, from: 'Bob', to: 'Alice' })
        expect(balance).toContainEqual({ amount: 50, from: 'Charlie', to: 'Alice' })
        expect(balance).toContainEqual({ amount: 50, from: 'David', to: 'Alice' })
    })

    it('should eliminate transfers for people who owe and are owed', () => {
        const transactions: Transaction[] = [
            { amount: 100, from: 'Alice', participants: ['Alice', 'Bob'] },
            { amount: 100, from: 'Bob', participants: ['Bob', 'Alice'] }
        ]
        const balance = calculateBalance(transactions)
        // Alice: paid 100, owes 50, net = +50
        // Bob: paid 100, owes 50, net = +50
        // Both are creditors with equal amounts - should balance to 0
        expect(balance.length).toBe(0)
    })

    it('should balance when second participant pays their share', () => {
        const transactions: Transaction[] = [
            { amount: 100, from: 'Alice', participants: ['Alice', 'Bob', 'Charlie'] },
            { amount: 50, from: 'Bob', participants: ['Alice', 'Bob', 'Charlie'] }
        ]
        const balance = calculateBalance(transactions)
        // Alice: paid 100, owes 150/3 = 50, net = +50
        // Bob: paid 50, owes 150/3 = 50, net = 0 (balanced)
        // Charlie: paid 0, owes 150/3 = 50, net = -50
        // Only Charlie should owe Alice 50
        expect(balance.length).toBe(1)
        expect(balance).toContainEqual({ amount: 50, from: 'Charlie', to: 'Alice' })
    })

    it('should handle floating-point precision with uneven split', () => {
        const transactions: Transaction[] = [
            { amount: 100, from: 'Alice', participants: ['Alice', 'Bob', 'Charlie'] }
        ]
        const balance = calculateBalance(transactions)
        // 100 / 3 = 33.333...
        expect(balance.length).toBe(2)
        expect(balance[0].amount).toBeCloseTo(100 / 3, 5)
        expect(balance[1].amount).toBeCloseTo(100 / 3, 5)
    })

    it('should reduce a debt when a participant makes a partial payment', () => {
        const transactions: Transaction[] = [
            { amount: 100, from: 'Alice', participants: ['Alice', 'Bob'] }
        ]
        const payments: Payment[] = [
            { amount: 25, from: 'Bob', to: 'Alice' }
        ]

        const balance = calculateBalance(transactions, payments)

        expect(balance.length).toBe(1)
        expect(balance).toContainEqual({ amount: 25, from: 'Bob', to: 'Alice' })
    })

    it('should ignore payments from a participant to themselves', () => {
        const transactions: Transaction[] = [
            { amount: 100, from: 'Alice', participants: ['Alice', 'Bob'] }
        ]
        const payments: Payment[] = [
            { amount: 25, from: 'Bob', to: 'Bob' }
        ]

        const balance = calculateBalance(transactions, payments)

        expect(balance.length).toBe(1)
        expect(balance).toContainEqual({ amount: 50, from: 'Bob', to: 'Alice' })
    })
})
