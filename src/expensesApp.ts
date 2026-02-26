import { calculateBalance, type Transaction, type Transfer } from './calculator'

type Expense = {
	description: string
	amount: number
	paidBy: string
	participants: string[]
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
			participants: expense.participants,
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
		this.saveState()
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
			participants: [...this.members],
		})

		this.expenseDescription = ''
		this.expenseAmount = ''
		this.saveState()
	},

	toggleParticipant(expenseIndex: number, member: string) {
		const expense = this.expenses[expenseIndex]
		if (!expense) return

		const index = expense.participants.indexOf(member)
		if (index > -1) {
			expense.participants.splice(index, 1)
		} else {
			expense.participants.push(member)
		}

		this.saveState()
	},

	saveState() {
		const state = {
			members: this.members,
			expenses: this.expenses,
		}
		localStorage.setItem('expensesAppState', JSON.stringify(state))
	},

	loadState() {
		const saved = localStorage.getItem('expensesAppState')
		if (!saved) return

		try {
			const state = JSON.parse(saved)
			if (Array.isArray(state.members)) {
				this.members = state.members
			}
			if (Array.isArray(state.expenses)) {
				this.expenses = state.expenses
			}
		} catch (e) {
			console.error('Failed to load state from localStorage:', e)
		}
	},

	init() {
		this.loadState()
	},
})
