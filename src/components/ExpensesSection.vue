<script setup lang="ts">
import { nextTick, ref, watch } from 'vue'
import { useExpensesStore } from '../stores/expenses'

const store = useExpensesStore()
const expenseAmountInput = ref<HTMLInputElement | null>(null)

watch(
	() => store.showExpenseForm,
	async (isVisible) => {
		if (!isVisible) return
		await nextTick()
		expenseAmountInput.value?.focus()
	},
)
</script>

<template>
	<section class="card">
		<div class="card-header">
			<div class="d-flex justify-content-between align-items-center">
				<h2 class="h4 m-0">Gastos</h2>
				<button type="button" class="btn btn-sm btn-primary m-0" @click="store.showAddExpenseForm()" v-show="!store.showExpenseForm" :disabled="store.members.length === 0">
					<i class="bi bi-plus-lg"></i> Gasto
				</button>
			</div>

			<div v-show="store.showExpenseForm" class="mt-3">
				<form class="row g-2" @submit.prevent="store.addExpense" @keydown.esc.prevent="store.cancelAddExpenseForm()">
					<div class="col-12 col-sm-4">
						<label class="form-label w-100 m-0">
							Monto
							<div class="input-group input-group-sm">
								<span class="input-group-text">$</span>
								<input ref="expenseAmountInput" v-model="store.expenseAmount" type="number" class="form-control" min="0" step="1" />
							</div>
						</label>
					</div>
					<div class="col-12 col-sm-4">
						<label class="form-label w-100 m-0">
							Pagado por
							<select v-model="store.expenseFrom" class="form-select form-select-sm">
								<option value="" disabled>Participante</option>
								<option v-for="member in store.members" :key="member" :value="member">{{ member }}</option>
							</select>
						</label>
					</div>
					<div class="col-12 col-sm-4">
						<label class="form-label w-100 m-0">
							Descripción
							<input v-model="store.expenseDescription" type="text" class="form-control form-control-sm" />
						</label>
					</div>
					<div class="col-12 d-flex justify-content-end">
						<div class="d-flex gap-1">
							<button type="submit" class="btn btn-sm btn-success" :disabled="store.members.length === 0"><i class="bi bi-check-lg"></i></button>
							<button type="button" class="btn btn-sm btn-secondary" @click="store.cancelAddExpenseForm()"><i class="bi bi-x-lg"></i></button>
						</div>
					</div>
				</form>
			</div>
		</div>

		<div v-if="store.expenses.length === 0" class="p-3 text-secondary text-center">
			No hay gastos todavía.
		</div>

		<ul v-else class="list-group list-group-flush border-top-0">
			<li v-for="(expense, index) in store.expenses" :key="index" class="list-group-item">
				<div class="d-flex flex-column gap-3">
					<template v-if="store.editingExpenseIndex === index">
						<form class="row g-2" @submit.prevent="store.updateExpense(index)" @keydown.esc.prevent="store.cancelEditExpense()">
							<div class="col-12 col-sm-4">
								<label class="form-label w-100 m-0">
									Monto
									<div class="input-group input-group-sm">
										<span class="input-group-text">$</span>
										<input v-model.number="store.editingExpenseData.amount" type="number" class="form-control" min="0" step="0.01" placeholder="Monto" />
									</div>
								</label>
							</div>
							<div class="col-12 col-sm-4">
								<label class="form-label w-100 m-0">
									Pagado por
									<select v-model="store.editingExpenseData.from" class="form-select form-select-sm">
										<option v-for="member in store.members" :key="member" :value="member">{{ member }}</option>
									</select>
								</label>
							</div>
							<div class="col-12 col-sm-4">
								<label class="form-label w-100 m-0">
									Descripción
									<input v-model="store.editingExpenseData.description" type="text" class="form-control form-control-sm" placeholder="Descripción" />
								</label>
							</div>
							<div class="col-12 d-flex justify-content-end">
								<div class="d-flex gap-1">
									<button type="submit" class="btn btn-sm btn-success"><i class="bi bi-check-lg"></i></button>
									<button type="button" class="btn btn-sm btn-secondary" @click="store.cancelEditExpense()"><i class="bi bi-x-lg"></i></button>
								</div>
							</div>
						</form>
					</template>

					<template v-else>
						<div class="d-flex justify-content-between align-items-start gap-3">
							<div class="flex-grow-1">
								<div>
									$<span style="font-variant-numeric: tabular-nums;">{{ expense.amount.toFixed(2) }}</span>
									· <span>{{ expense.from }}</span>
									· <span class="fw-semibold">{{ expense.description }}</span>
								</div>
							</div>
							<div class="d-flex gap-1">
								<button type="button" class="btn btn-sm btn-outline-secondary" @click="store.startEditExpense(index)"><i class="bi bi-pencil-fill"></i></button>
								<button type="button" class="btn btn-sm btn-outline-danger" @click="store.removeExpense(index)"><i class="bi bi-trash2-fill"></i></button>
							</div>
						</div>

						<div class="d-flex flex-wrap gap-3 p-2 bg-secondary-subtle rounded">
							<span>Compartir entre</span>
							<div v-for="member in store.members" :key="member" class="form-check d-flex align-items-center gap-2">
								<input :id="`member-${index}-${member}`" class="form-check-input" type="checkbox" :checked="expense.participants.includes(member)" @change="store.toggleParticipant(index, member)" />
								<label class="form-check-label mb-0" :for="`member-${index}-${member}`">{{ member }}</label>
							</div>
						</div>
					</template>
				</div>
			</li>
		</ul>
	</section>
</template>