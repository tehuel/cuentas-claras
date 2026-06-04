<script setup lang="ts">
import { nextTick, onMounted, ref, watch } from 'vue'
import { useExpensesStore } from './stores/expenses'

const store = useExpensesStore()
const memberInput = ref<HTMLInputElement | null>(null)
const expenseAmountInput = ref<HTMLInputElement | null>(null)
const paymentAmountInput = ref<HTMLInputElement | null>(null)

watch(
	() => store.showMemberForm,
	async (isVisible) => {
		if (!isVisible) return
		await nextTick()
		memberInput.value?.focus()
	},
)

watch(
	() => store.showExpenseForm,
	async (isVisible) => {
		if (!isVisible) return
		await nextTick()
		expenseAmountInput.value?.focus()
	},
)

watch(
	() => store.showPaymentForm,
	async (isVisible) => {
		if (!isVisible) return
		await nextTick()
		paymentAmountInput.value?.focus()
	},
)

onMounted(() => {
	store.init()
})
</script>

<template>
	<div class="d-flex flex-column min-vh-100">
		<div class="py-5 border-bottom">
			<div class="container">
				<header class="row align-items-center">
					<div class="col-md">
						<h1 class="display-5 m-0">Cuentas Claras</h1>
						<p class="text-secondary m-0">Conservan Amistad</p>
					</div>
					<div class="col-md text-md-end">
						<p class="m-0">Una app para manejar gastos compartidos con amigos.</p>
					</div>
				</header>
			</div>
		</div>

		<main class="container d-flex flex-column gap-4 my-4">
			<section class="card">
				<div class="card-header">
					<div class="d-flex justify-content-between align-items-center">
						<h2 class="h4 m-0">Participantes</h2>
						<button type="button" class="btn btn-sm btn-primary m-0" @click="store.showAddMemberForm()" v-show="!store.showMemberForm">
							<i class="bi bi-plus-lg"></i> Participante
						</button>
					</div>

					<div v-show="store.showMemberForm" class="mt-3">
						<form class="row g-2" @submit.prevent="store.addMember" @keydown.esc.prevent="store.cancelAddMemberForm()">
							<div class="col-12">
								<label class="form-label w-100">
									Nombre
									<input ref="memberInput" v-model="store.memberName" type="text" class="form-control form-control-sm" />
								</label>
							</div>
							<div class="col-12 d-flex justify-content-end">
								<div class="d-flex gap-1">
									<button type="submit" class="btn btn-sm btn-success"><i class="bi bi-check-lg"></i></button>
									<button type="button" class="btn btn-sm btn-secondary" @click="store.cancelAddMemberForm()"><i class="bi bi-x-lg"></i></button>
								</div>
							</div>
						</form>
					</div>
				</div>

				<div v-if="store.members.length === 0" class="p-3 text-secondary text-center">
					No hay participantes todavía.
				</div>

				<ul v-else class="list-group list-group-flush border-top-0">
					<li v-for="(member, index) in store.members" :key="member" class="list-group-item d-flex align-items-center justify-content-between gap-2">
						<template v-if="store.editingMemberIndex === index">
							<form class="d-flex gap-2 w-100" @submit.prevent="store.updateMember(index)" @keydown.esc.prevent="store.cancelEditMember()">
								<input v-model="store.editingMemberName" type="text" class="form-control form-control-sm flex-grow-1" />
								<div class="d-flex gap-1">
									<button type="submit" class="btn btn-sm btn-success"><i class="bi bi-check-lg"></i></button>
									<button type="button" class="btn btn-sm btn-secondary" @click="store.cancelEditMember()"><i class="bi bi-x-lg"></i></button>
								</div>
							</form>
						</template>
						<template v-else>
							<div class="d-flex gap-2 w-100 align-items-center justify-content-between">
								<span>{{ member }}</span>
								<div class="d-flex gap-1 justify-content-end">
									<button type="button" class="btn btn-sm btn-outline-secondary" @click="store.startEditMember(index)"><i class="bi bi-pencil-fill"></i></button>
									<button type="button" class="btn btn-sm btn-outline-danger" @click="store.removeMember(index)"><i class="bi bi-trash2-fill"></i></button>
								</div>
							</div>
						</template>
					</li>
				</ul>
			</section>

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

			<section class="card">
				<div class="card-header">
					<div class="d-flex justify-content-between align-items-center">
						<h2 class="h4 m-0">Pagos</h2>
						<button type="button" class="btn btn-sm btn-primary m-0" @click="store.showAddPaymentForm()" v-show="!store.showPaymentForm" :disabled="store.members.length < 2">
							<i class="bi bi-plus-lg"></i> Pago
						</button>
					</div>

					<div v-show="store.showPaymentForm" class="mt-3">
						<form class="row g-2" @submit.prevent="store.addPayment" @keydown.esc.prevent="store.cancelAddPaymentForm()">
							<div class="col-12 col-sm-3">
								<label class="form-label w-100 m-0">
									Monto
									<div class="input-group input-group-sm">
										<span class="input-group-text">$</span>
										<input ref="paymentAmountInput" v-model="store.paymentAmount" type="number" class="form-control" min="0" step="0.01" />
									</div>
								</label>
							</div>
							<div class="col-12 col-sm-3">
								<label class="form-label w-100 m-0">
									Pagó
									<select v-model="store.paymentFrom" class="form-select form-select-sm">
										<option value="" disabled>Participante</option>
										<option v-for="member in store.members" :key="member" :value="member">{{ member }}</option>
									</select>
								</label>
							</div>
							<div class="col-12 col-sm-3">
								<label class="form-label w-100 m-0">
									A
									<select v-model="store.paymentTo" class="form-select form-select-sm">
										<option value="" disabled>Participante</option>
										<option v-for="member in store.members" :key="member" :value="member">{{ member }}</option>
									</select>
								</label>
							</div>
							<div class="col-12 col-sm-3">
								<label class="form-label w-100 m-0">
									Nota
									<input v-model="store.paymentNote" type="text" class="form-control form-control-sm" placeholder="Opcional" />
								</label>
							</div>
							<div class="col-12 d-flex justify-content-end">
								<div class="d-flex gap-1">
									<button type="submit" class="btn btn-sm btn-success" :disabled="store.members.length < 2"><i class="bi bi-check-lg"></i></button>
									<button type="button" class="btn btn-sm btn-secondary" @click="store.cancelAddPaymentForm()"><i class="bi bi-x-lg"></i></button>
								</div>
							</div>
						</form>
					</div>
				</div>

				<div v-if="store.payments.length === 0" class="p-3 text-secondary text-center">
					No hay pagos todavía.
				</div>

				<ul v-else class="list-group list-group-flush border-top-0">
					<li v-for="(payment, index) in store.payments" :key="index" class="list-group-item d-flex justify-content-between align-items-center gap-3">
						<template v-if="store.editingPaymentIndex === index">
							<form class="row g-2 w-100 align-items-end" @submit.prevent="store.updatePayment(index)" @keydown.esc.prevent="store.cancelEditPayment()">
								<div class="col-12 col-sm-3">
									<label class="form-label w-100 m-0">
										Monto
										<div class="input-group input-group-sm">
											<span class="input-group-text">$</span>
											<input v-model.number="store.editingPaymentData.amount" type="number" class="form-control" min="0" step="0.01" placeholder="Monto" />
										</div>
									</label>
								</div>
								<div class="col-12 col-sm-3">
									<label class="form-label w-100 m-0">
										Pagó
										<select v-model="store.editingPaymentData.from" class="form-select form-select-sm">
											<option v-for="member in store.members" :key="member" :value="member">{{ member }}</option>
										</select>
									</label>
								</div>
								<div class="col-12 col-sm-3">
									<label class="form-label w-100 m-0">
										A
										<select v-model="store.editingPaymentData.to" class="form-select form-select-sm">
											<option v-for="member in store.members" :key="member" :value="member">{{ member }}</option>
										</select>
									</label>
								</div>
								<div class="col-12 col-sm-3">
									<label class="form-label w-100 m-0">
										Nota
										<input v-model="store.editingPaymentData.note" type="text" class="form-control form-control-sm" placeholder="Opcional" />
									</label>
								</div>
								<div class="col-12 d-flex justify-content-end">
									<div class="d-flex gap-1">
										<button type="submit" class="btn btn-sm btn-success"><i class="bi bi-check-lg"></i></button>
										<button type="button" class="btn btn-sm btn-secondary" @click="store.cancelEditPayment()"><i class="bi bi-x-lg"></i></button>
									</div>
								</div>
							</form>
						</template>

						<template v-else>
							<div class="d-flex justify-content-between align-items-center w-100 gap-3">
								<div>
									<span class="fw-semibold">{{ payment.from }}</span>
									le paga a
									<span class="fw-semibold">{{ payment.to }}</span>
									<span v-if="payment.note" class="text-secondary">· {{ payment.note }}</span>
								</div>

								<div class="d-flex align-items-center gap-2">
									<span class="badge text-bg-success">$ {{ payment.amount.toFixed(2) }}</span>
									<button type="button" class="btn btn-sm btn-outline-secondary" @click="store.startEditPayment(index)"><i class="bi bi-pencil-fill"></i></button>
									<button type="button" class="btn btn-sm btn-outline-danger" @click="store.removePayment(index)"><i class="bi bi-trash2-fill"></i></button>
								</div>
							</div>
						</template>
					</li>
				</ul>
			</section>

			<section class="card">
				<div class="card-header"><h2 class="h4 m-0">Reparto</h2></div>

				<div v-if="store.transfers.length === 0" class="p-3 text-secondary text-center">
					No hay transferencias necesarias.
				</div>

				<ul v-else class="list-group list-group-flush border-top-0">
					<li v-for="(transfer, index) in store.transfers" :key="index" class="list-group-item d-flex justify-content-between align-items-center">
						<span>
							<strong>{{ transfer.from }}</strong>
							le debe a
							<strong>{{ transfer.to }}</strong>
						</span>
						<span class="badge text-bg-primary">$ {{ transfer.amount.toFixed(2) }}</span>
					</li>
				</ul>
			</section>
		</main>

		<footer class="small text-center text-secondary py-5 mt-auto border-top">
			<p class="m-0 mb-2">
				<button type="button" data-theme-toggle class="btn btn-outline-secondary border-0" aria-label="Cambiar modo claro/oscuro" title="Cambiar modo claro/oscuro">
					<i class="bi bi-circle-half"></i>
				</button>
			</p>
			<p class="m-0">
				<a href="https://cc.tehuel.com.ar" class="text-secondary">Cuentas Claras</a>
				por
				<a href="https://tehuel.com.ar" class="text-secondary">Tehuel Torres Baldi</a>
			</p>
			<p class="m-0">
				Te invito a <a href="https://github.com/tehuel/cuentas-claras" class="text-secondary">ver el código</a>,
				<a href="https://github.com/tehuel/cuentas-claras/issues" class="text-secondary">reportar errores</a>
				o <a href="https://github.com/tehuel/cuentas-claras/pulls" class="text-secondary">enviar colaboraciones</a>
			</p>
		</footer>
	</div>
</template>