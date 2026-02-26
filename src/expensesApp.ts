import { calculateBalance, type Transaction, type Transfer } from './calculator'

type Expense = {
	description: string
	amount: number
	paidBy: string
}

export const expensesApp = () => ({
    // members
    memberName: '',
	members: [] as string[],

    // expenses
    expenseDescription: '',
	expenseAmount: '',
	expensePaidBy: '',
	expenses: [] as Expense[],

	get transfers(): Transfer[] {
		if (this.members.length === 0 || this.expenses.length === 0) {
			return []
		}

		const transactions: Transaction[] = this.expenses.map((expense) => ({
			amount: expense.amount,
			from: expense.paidBy,
			participants: [...this.members],
		}))

		return calculateBalance(transactions)
	},

	addMember() {
		const name = this.memberName.trim()
		if (!name || this.members.includes(name)) {
			this.memberName = ''
			return
		}

		this.members.push(name)
		if (!this.expensePaidBy) {
			this.expensePaidBy = name
		}
		this.memberName = ''
	},

	addExpense() {
		const description = this.expenseDescription.trim()
		const amount = Number(this.expenseAmount)
		const paidBy = this.expensePaidBy

		if (!description || !paidBy || !Number.isFinite(amount) || amount <= 0) {
			return
		}

		this.expenses.unshift({
			description,
			amount,
			paidBy,
		})

		this.expenseDescription = ''
		this.expenseAmount = ''
	},
})
