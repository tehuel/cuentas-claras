import { beforeEach, describe, expect, it } from 'vitest'
import { createPinia, setActivePinia } from 'pinia'
import { useExpensesStore } from './expenses'

class LocalStorageMock {
	private store: Record<string, string> = {}

	clear() {
		this.store = {}
	}

	getItem(key: string): string | null {
		return this.store[key] ?? null
	}

	setItem(key: string, value: string) {
		this.store[key] = String(value)
	}

	removeItem(key: string) {
		delete this.store[key]
	}
}

const mockLocalStorage = new LocalStorageMock()
Object.defineProperty(globalThis, 'localStorage', {
	value: mockLocalStorage,
	writable: true,
})

describe('useExpensesStore - member cascades', () => {
	beforeEach(() => {
		setActivePinia(createPinia())
		mockLocalStorage.clear()
	})

	describe('removeMember', () => {
		it('should cascade and remove payments where the removed member was payer (from)', () => {
			const store = useExpensesStore()
			store.addMember('Alice')
			store.addMember('Bob')
			store.addMember('Charlie')

			store.addPayment({
				id: 'pay-1',
				amount: 50,
				from: 'Bob',
				to: 'Alice',
				description: 'Bob pays Alice',
			})
			store.addPayment({
				id: 'pay-2',
				amount: 30,
				from: 'Charlie',
				to: 'Alice',
				description: 'Charlie pays Alice',
			})

			expect(store.payments.length).toBe(2)

			// Bob is at index 1
			store.removeMember(1)

			expect(store.members).toEqual(['Alice', 'Charlie'])
			expect(store.payments).toEqual([
				{
					id: 'pay-2',
					amount: 30,
					from: 'Charlie',
					to: 'Alice',
					description: 'Charlie pays Alice',
				},
			])
		})

		it('should cascade and remove payments where the removed member was recipient (to)', () => {
			const store = useExpensesStore()
			store.addMember('Alice')
			store.addMember('Bob')
			store.addMember('Charlie')

			store.addPayment({
				id: 'pay-1',
				amount: 50,
				from: 'Bob',
				to: 'Alice',
				description: 'Bob pays Alice',
			})
			store.addPayment({
				id: 'pay-2',
				amount: 30,
				from: 'Bob',
				to: 'Charlie',
				description: 'Bob pays Charlie',
			})

			expect(store.payments.length).toBe(2)

			// Alice is at index 0
			store.removeMember(0)

			expect(store.members).toEqual(['Bob', 'Charlie'])
			expect(store.payments).toEqual([
				{
					id: 'pay-2',
					amount: 30,
					from: 'Bob',
					to: 'Charlie',
					description: 'Bob pays Charlie',
				},
			])
		})

		it('should preserve payments between unaffected members', () => {
			const store = useExpensesStore()
			store.addMember('Alice')
			store.addMember('Bob')
			store.addMember('Charlie')

			store.addPayment({
				id: 'pay-1',
				amount: 100,
				from: 'Alice',
				to: 'Bob',
				description: 'Alice pays Bob',
			})

			// Charlie is at index 2
			store.removeMember(2)

			expect(store.members).toEqual(['Alice', 'Bob'])
			expect(store.payments.length).toBe(1)
			expect(store.payments[0].from).toBe('Alice')
			expect(store.payments[0].to).toBe('Bob')
		})

		it('should persist state after member removal and payment cleanup', () => {
			const store = useExpensesStore()
			store.addMember('Alice')
			store.addMember('Bob')
			store.addPayment({
				id: 'pay-1',
				amount: 25,
				from: 'Alice',
				to: 'Bob',
				description: 'Test payment',
			})

			store.removeMember(0)

			const saved = JSON.parse(mockLocalStorage.getItem('expensesAppState') || '{}')
			expect(saved.members).toEqual(['Bob'])
			expect(saved.payments).toEqual([])
		})
	})

	describe('updateMember', () => {
		it('should cascade new name to payment.from when member is renamed', () => {
			const store = useExpensesStore()
			store.addMember('Alice')
			store.addMember('Bob')

			store.addPayment({
				id: 'pay-1',
				amount: 40,
				from: 'Alice',
				to: 'Bob',
				description: 'Alice to Bob',
			})

			// Rename Alice (index 0) to Alicia
			const updated = store.updateMember(0, 'Alicia')
			expect(updated).toBe(true)

			expect(store.members).toEqual(['Alicia', 'Bob'])
			expect(store.payments[0].from).toBe('Alicia')
			expect(store.payments[0].to).toBe('Bob')
		})

		it('should cascade new name to payment.to when member is renamed', () => {
			const store = useExpensesStore()
			store.addMember('Alice')
			store.addMember('Bob')

			store.addPayment({
				id: 'pay-1',
				amount: 40,
				from: 'Alice',
				to: 'Bob',
				description: 'Alice to Bob',
			})

			// Rename Bob (index 1) to Roberto
			const updated = store.updateMember(1, 'Roberto')
			expect(updated).toBe(true)

			expect(store.members).toEqual(['Alice', 'Roberto'])
			expect(store.payments[0].from).toBe('Alice')
			expect(store.payments[0].to).toBe('Roberto')
		})

		it('should not modify payments for other members when a member is renamed', () => {
			const store = useExpensesStore()
			store.addMember('Alice')
			store.addMember('Bob')
			store.addMember('Charlie')

			store.addPayment({
				id: 'pay-1',
				amount: 15,
				from: 'Alice',
				to: 'Bob',
				description: 'Unaffected payment',
			})

			// Rename Charlie (index 2) to Carlos
			store.updateMember(2, 'Carlos')

			expect(store.payments[0].from).toBe('Alice')
			expect(store.payments[0].to).toBe('Bob')
		})

		it('should persist updated payments to localStorage', () => {
			const store = useExpensesStore()
			store.addMember('Alice')
			store.addMember('Bob')

			store.addPayment({
				id: 'pay-1',
				amount: 40,
				from: 'Alice',
				to: 'Bob',
				description: 'Alice to Bob',
			})

			store.updateMember(0, 'Alicia')

			const saved = JSON.parse(mockLocalStorage.getItem('expensesAppState') || '{}')
			expect(saved.members).toEqual(['Alicia', 'Bob'])
			expect(saved.payments[0].from).toBe('Alicia')
			expect(saved.payments[0].to).toBe('Bob')
		})
	})
})
