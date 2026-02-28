export type Transaction = {
    amount: number,
    from: string,
    participants: string[],
}

export type Transfer = {
    amount: number,
    from: string,
    to: string,
}

export function calculateBalance(transactions: Transaction[]): Transfer[] {
    // Step 1: Calculate net balance for each person
    const balanceMap: Record<string, number> = {}

    transactions.forEach(({ amount, from, participants }) => {
        const share = amount / participants.length
        participants.forEach(participant => {
            if (participant !== from) {
                balanceMap[participant] = (balanceMap[participant] || 0) - share
                balanceMap[from] = (balanceMap[from] || 0) + share
            }
        })
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