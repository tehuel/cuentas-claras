// Record a single expense transaction
export type Transaction = {
    amount: number,
    from: string,
    participants: string[],
}

// Record a manual payment from one participant to another
export type Payment = {
    amount: number,
    from: string,
    to: string,
    note?: string,
}

// Record a transfer to settle debts
export type Transfer = {
    amount: number,
    from: string,
    to: string,
}

const applyBalanceDelta = (balanceMap: Record<string, number>, person: string, delta: number) => {
    if (!person || !Number.isFinite(delta) || delta === 0) {
        return
    }

    balanceMap[person] = (balanceMap[person] || 0) + delta
}

export function calculateBalance(transactions: Transaction[], payments: Payment[] = []): Transfer[] {
    // Step 1: Calculate net balance for each person
    const balanceMap: Record<string, number> = {}

    transactions.forEach(({ amount, from, participants }) => {
        if (!Number.isFinite(amount) || amount <= 0 || participants.length === 0) {
            return
        }

        const share = amount / participants.length
        participants.forEach((participant) => {
            if (participant !== from) {
                applyBalanceDelta(balanceMap, participant, -share)
                applyBalanceDelta(balanceMap, from, share)
            }
        })
    })

    payments.forEach(({ amount, from, to }) => {
        if (!Number.isFinite(amount) || amount <= 0 || from === to) {
            return
        }

        applyBalanceDelta(balanceMap, from, amount)
        applyBalanceDelta(balanceMap, to, -amount)
    })

    // Step 2: Separate debtors (negative) and creditors (positive)
    const debtors: Array<[string, number]> = []
    const creditors: Array<[string, number]> = []

    Object.entries(balanceMap).forEach(([person, amount]) => {
        if (amount < -1e-9) {
            debtors.push([person, -amount]) // store as positive
        } else if (amount > 1e-9) {
            creditors.push([person, amount])
        }
    })

    // Step 3: Settle debts with greedy algorithm (minimal transfers)
    const transfers: Transfer[] = []

    while (debtors.length > 0 && creditors.length > 0) {
        const [debtor, debtAmount] = debtors[0]
        const [creditor, creditAmount] = creditors[0]

        const settleAmount = Math.min(debtAmount, creditAmount)
        transfers.push({ from: debtor, to: creditor, amount: settleAmount })

        debtors[0][1] -= settleAmount
        creditors[0][1] -= settleAmount

        if (debtors[0][1] < 1e-9) debtors.shift()
        if (creditors[0][1] < 1e-9) creditors.shift()
    }

    return transfers
}