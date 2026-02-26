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
	editingMemberIndex: -1,
	editingMemberName: '',

	// expenses
    expenseDescription: '',
	expenseAmount: '',
	expensePaidBy: '',
	expenses: [] as Expense[],
	editingExpenseIndex: -1,
	editingExpenseData: { description: '', amount: 0, paidBy: '' },

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

		// add member to existing expenses participants
		this.expenses.forEach((expense) => {
			if (!expense.participants.includes(name)) {
				expense.participants.push(name)
			}
		})

		this.memberName = ''
		this.saveState()
	},

	removeMember(index: number) {
		const memberToRemove = this.members[index]
		if (!memberToRemove) return

		// Remove from members list
		this.members.splice(index, 1)

		// Remove from expenses participants and reset paidBy if necessary
		this.expenses.forEach((expense) => {
			const participantIndex = expense.participants.indexOf(memberToRemove)
			if (participantIndex > -1) {
				expense.participants.splice(participantIndex, 1)
			}
			if (expense.paidBy === memberToRemove) {
				expense.paidBy = this.members[0] || ''
			}
		})

		// Reset expensePaidBy if it was the removed member
		if (this.expensePaidBy === memberToRemove) {
			this.expensePaidBy = this.members[0] || ''
		}

		this.saveState()
	},

	startEditMember(index: number) {
		this.editingMemberIndex = index
		this.editingMemberName = this.members[index] || ''
	},

	cancelEditMember() {
		this.editingMemberIndex = -1
		this.editingMemberName = ''
	},

	updateMember(index: number) {
		const oldName = this.members[index]
		const newName = this.editingMemberName.trim()

		if (!newName || newName === oldName) {
			this.cancelEditMember()
			return
		}

		// Check if name already exists
		if (this.members.includes(newName)) {
			this.cancelEditMember()
			return
		}

		// Update member name
		this.members[index] = newName

		// Update in expenses
		this.expenses.forEach((expense) => {
			if (expense.paidBy === oldName) {
				expense.paidBy = newName
			}
			const participantIndex = expense.participants.indexOf(oldName)
			if (participantIndex > -1) {
				expense.participants[participantIndex] = newName
			}
		})

		// Update expensePaidBy if it was the old name
		if (this.expensePaidBy === oldName) {
			this.expensePaidBy = newName
		}

		this.cancelEditMember()
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

	removeExpense(index: number) {
		this.expenses.splice(index, 1)
		this.saveState()
	},

	startEditExpense(index: number) {
		const expense = this.expenses[index]
		if (!expense) return

		this.editingExpenseIndex = index
		this.editingExpenseData = {
			description: expense.description,
			amount: expense.amount,
			paidBy: expense.paidBy,
		}
	},

	cancelEditExpense() {
		this.editingExpenseIndex = -1
		this.editingExpenseData = { description: '', amount: 0, paidBy: '' }
	},

	updateExpense(index: number) {
		const expense = this.expenses[index]
		if (!expense) return

		const description = this.editingExpenseData.description.trim()
		const amount = Number(this.editingExpenseData.amount)
		const paidBy = this.editingExpenseData.paidBy

		if (!description || !paidBy || !Number.isFinite(amount) || amount <= 0) {
			return
		}

		expense.description = description
		expense.amount = amount
		expense.paidBy = paidBy

		this.cancelEditExpense()
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
