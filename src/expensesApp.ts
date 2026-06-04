import { calculateBalance, type Payment, type Transaction, type Transfer } from './calculator'

type Expense = Transaction & { description: string }
type PaymentDraft = {
	amount: number,
	from: string,
	to: string,
	note: string,
}

export const expensesApp = () => ({
    // members
    memberName: '',
	members: [] as string[],
	editingMemberIndex: -1,
	editingMemberName: '',
	showMemberForm: false,

	// expenses
    expenseDescription: '',
	expenseAmount: '',
	expenseFrom: '',
	expenses: [] as Expense[],
	editingExpenseIndex: -1,
	editingExpenseData: { description: '', amount: 0, from: '' } as Omit<Expense, 'participants'>,
	showExpenseForm: false,

	// payments
	paymentAmount: '',
	paymentFrom: '',
	paymentTo: '',
	paymentNote: '',
	payments: [] as Payment[],
	editingPaymentIndex: -1,
	editingPaymentData: { amount: 0, from: '', to: '', note: '' } as PaymentDraft,
	showPaymentForm: false,

	get transfers(): Transfer[] {
		if (this.members.length === 0 || this.expenses.length === 0) {
			return []
		}

		return calculateBalance(this.expenses, this.payments)
	},

	showAddMemberForm() {
		this.showMemberForm = true
	},

	cancelAddMemberForm() {
		this.showMemberForm = false
		this.memberName = ''
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
		this.showMemberForm = false
		this.saveState()
	},

	removeMember(index: number) {
		const memberToRemove = this.members[index]
		if (!memberToRemove) return

		// Remove from members list
		this.members.splice(index, 1)

		// Remove from expenses participants and reset from if necessary
		this.expenses.forEach((expense) => {
			const participantIndex = expense.participants.indexOf(memberToRemove)
			if (participantIndex > -1) {
				expense.participants.splice(participantIndex, 1)
			}
			if (expense.from === memberToRemove) {
				expense.from = this.members[0] || ''
			}
		})

		// Reset expenseFrom if it was the removed member
		if (this.expenseFrom === memberToRemove) {
			this.expenseFrom = this.members[0] || ''
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
			if (expense.from === oldName) {
				expense.from = newName
			}
			const participantIndex = expense.participants.indexOf(oldName)
			if (participantIndex > -1) {
				expense.participants[participantIndex] = newName
			}
		})

		// Update expenseFrom if it was the old name
		if (this.expenseFrom === oldName) {
			this.expenseFrom = newName
		}

		this.cancelEditMember()
		this.saveState()
	},

	showAddExpenseForm() {
		this.showExpenseForm = true
	},

	cancelAddExpenseForm() {
		this.showExpenseForm = false
		this.expenseDescription = ''
		this.expenseAmount = ''
	},

	addExpense() {
		const description = this.expenseDescription.trim()
		const amount = Number(this.expenseAmount)
		const from = this.expenseFrom

		if (!description || !from || !Number.isFinite(amount) || amount <= 0) {
			return
		}

		this.expenses.unshift({
			description,
			amount,
			from,
			participants: [...this.members],
		})

		this.expenseDescription = ''
		this.expenseAmount = ''
		this.showExpenseForm = false
		this.saveState()
	},

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
		} catch (e) {
			console.error('Failed to load state from localStorage:', e)
		}
	},

	init() {
		this.loadState()
	},
})
