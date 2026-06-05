import { defineStore } from 'pinia'
import { calculateBalance, type Payment, type Transaction, type Transfer } from '../calculator'

export type Expense = Transaction & { description: string }

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
				description: trimmedDescription,
				amount: expense.amount,
				from: expense.from,
				participants: expense.participants,
			})

			this.saveState()
			return true
		},

		removeExpense(index: number) {
			if (this.editingExpenseIndex === index) {
				this.cancelEditExpense()
			}

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
				from: expense.from,
			}
		},

		cancelEditExpense() {
			this.editingExpenseIndex = -1
			this.editingExpenseData = { description: '', amount: 0, from: '' }
		},

		updateExpense(index: number) {
			const expense = this.expenses[index]
			if (!expense) return

			const description = this.editingExpenseData.description.trim()
			const amount = Number(this.editingExpenseData.amount)
			const from = this.editingExpenseData.from

			if (!description || !from || !Number.isFinite(amount) || amount <= 0) {
				return
			}

			expense.description = description
			expense.amount = amount
			expense.from = from

			this.cancelEditExpense()
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

		// payments
		showAddPaymentForm() {
			this.showPaymentForm = true
		},

		cancelAddPaymentForm() {
			this.showPaymentForm = false
			this.paymentAmount = ''
			this.paymentFrom = ''
			this.paymentTo = ''
			this.paymentNote = ''
		},

		addPayment() {
			const amount = Number(this.paymentAmount)
			const from = this.paymentFrom
			const to = this.paymentTo
			const note = this.paymentNote.trim()

			if (!from || !to || from === to || !Number.isFinite(amount) || amount <= 0) {
				return
			}

			this.payments.unshift({
				amount,
				from,
				to,
				note: note || undefined,
			})

			this.cancelAddPaymentForm()
			this.saveState()
		},

		removePayment(index: number) {
			if (this.editingPaymentIndex === index) {
				this.cancelEditPayment()
			}

			this.payments.splice(index, 1)
			this.saveState()
		},

		startEditPayment(index: number) {
			const payment = this.payments[index]
			if (!payment) return

			this.editingPaymentIndex = index
			this.editingPaymentData = {
				amount: payment.amount,
				from: payment.from,
				to: payment.to,
				note: payment.note || '',
			}
		},

		cancelEditPayment() {
			this.editingPaymentIndex = -1
			this.editingPaymentData = { amount: 0, from: '', to: '', note: '' }
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

		init() {
			this.loadState()
		},
	},
})