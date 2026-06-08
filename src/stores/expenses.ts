import { defineStore } from 'pinia'
import { calculateBalance, type Payment, type Transfer } from '../calculator'

export type Expense = {
	id: string,
	amount: number,
	from: string,
	participants: string[],
	description: string,
}

type PaymentDraft = {
	amount: number,
	from: string,
	to: string,
	note: string,
}

export const useExpensesStore = defineStore('expenses', {
	state: () => ({
		members: [] as string[],

		expenses: [] as Expense[],

		paymentAmount: '',
		paymentFrom: '',
		paymentTo: '',
		paymentNote: '',
		payments: [] as Payment[],
		editingPaymentIndex: -1,
		editingPaymentData: { amount: 0, from: '', to: '', note: '' } as PaymentDraft,
		showPaymentForm: false,
	}),

	getters: {
		transfers(): Transfer[] {
			if (this.members.length === 0 || this.expenses.length === 0) {
				return []
			}

			return calculateBalance(this.expenses, this.payments)
		},
	},

	actions: {
		// members
		addMember(name: string): boolean {
			const trimmedName = name.trim()
			if (!trimmedName || this.members.includes(trimmedName)) {
				return false
			}

			this.members.push(trimmedName)

			// New members are now participants in all existing expenses
			this.expenses.forEach((expense) => {
				if (!expense.participants.includes(trimmedName)) {
					expense.participants.push(trimmedName)
				}
			})

			this.saveState()
			return true
		},

		removeMember(index: number) {
			const memberToRemove = this.members[index]
			if (!memberToRemove) return

			this.members.splice(index, 1)

			this.expenses.forEach((expense) => {
				const participantIndex = expense.participants.indexOf(memberToRemove)
				if (participantIndex > -1) {
					expense.participants.splice(participantIndex, 1)
				}
				if (expense.from === memberToRemove) {
					expense.from = this.members[0] || ''
				}
			})

			if (this.paymentFrom === memberToRemove) {
				this.paymentFrom = ''
			}

			if (this.paymentTo === memberToRemove) {
				this.paymentTo = ''
			}

			this.saveState()
		},

		updateMember(index: number, newName: string): boolean {
			const oldName = this.members[index]
			const trimmedNewName = newName.trim()

			if (!trimmedNewName || trimmedNewName === oldName) {
				return false
			}

			if (this.members.includes(trimmedNewName)) {
				return false
			}

			this.members[index] = trimmedNewName

			this.expenses.forEach((expense) => {
				if (expense.from === oldName) {
					expense.from = trimmedNewName
				}

				const participantIndex = expense.participants.indexOf(oldName)
				if (participantIndex > -1) {
					expense.participants[participantIndex] = trimmedNewName
				}
			})

			if (this.paymentFrom === oldName) {
				this.paymentFrom = trimmedNewName
			}

			if (this.paymentTo === oldName) {
				this.paymentTo = trimmedNewName
			}

			this.saveState()
			return true
		},

		// expenses
		addExpense(expense: Expense) {
			const trimmedDescription = expense.description?.trim() || ''
			if(!trimmedDescription || !expense.from || expense.amount <= 0) {
				return false
			}

			this.expenses.unshift({
				...expense,
				description: trimmedDescription,
			})

			this.saveState()
			return true
		},

		removeExpense(id: string) {
			const expenseIndex = this.expenses.findIndex(expense => expense.id === id)
			this.expenses.splice(expenseIndex, 1)
			this.saveState()
		},

		updateExpense(expense: Expense) {
			const oldExpenseIndex = this.expenses.findIndex(oldExpense => oldExpense.id === expense.id)
			if (oldExpenseIndex === -1) return

			this.expenses.splice(oldExpenseIndex, 1, expense)
			this.saveState()
		},

		toggleParticipant(expenseId: string, participantName: string) {
			const expense = this.expenses.find((expense) => expense.id === expenseId)
			if (!expense) return

			const participantIndex = expense.participants.indexOf(participantName)
			if (participantIndex > -1) {
				expense.participants.splice(participantIndex, 1)
			} else {
				expense.participants.push(participantName)
			}

			this.saveState()
		},

		// payments
		addPayment(payment: Payment) {
			const { from, to, amount, note } = payment

			if (!from || !to || from === to || !Number.isFinite(amount) || amount <= 0) {
				return false
			}

			const trimmedNote = note?.trim() || ''

			this.payments.unshift({
				amount,
				from,
				to,
				note: trimmedNote,
			})

			this.saveState()
			return true
		},

		removePayment(index: number) {
			if (this.editingPaymentIndex === index) {
				this.cancelEditPayment()
			}

			this.payments.splice(index, 1)
			this.saveState()
		},

		updatePayment(index: number) {
			const payment = this.payments[index]
			if (!payment) return

			const amount = Number(this.editingPaymentData.amount)
			const from = this.editingPaymentData.from
			const to = this.editingPaymentData.to
			const note = this.editingPaymentData.note.trim()

			if (!from || !to || from === to || !Number.isFinite(amount) || amount <= 0) {
				return
			}

			payment.amount = amount
			payment.from = from
			payment.to = to
			payment.note = note || undefined

			this.cancelEditPayment()
			this.saveState()
		},

		// app state
		saveState() {
			const state = {
				members: this.members,
				expenses: this.expenses,
				payments: this.payments,
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
				if (Array.isArray(state.payments)) {
					this.payments = state.payments
				}
			} catch (error) {
				console.error('Failed to load state from localStorage:', error)
			}
		},
	},
})