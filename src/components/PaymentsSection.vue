<script setup lang="ts">
import { ref } from 'vue'
import { useExpensesStore } from '../stores/expenses'
import PaymentAddForm from "./PaymentAddForm.vue";

const store = useExpensesStore()
const isAddPaymentFormVisible = ref(false)

const openAddPaymentForm = () => {
  isAddPaymentFormVisible.value = true
}

const closeAddPaymentForm = () => {
  isAddPaymentFormVisible.value = false
}
</script>

<template>
	<section class="card">
		<div class="card-header">
			<div class="d-flex justify-content-between align-items-center">
				<h2 class="h4 m-0">Pagos</h2>
				<button type="button" class="btn btn-sm btn-primary m-0" @click="openAddPaymentForm" v-show="!isAddPaymentFormVisible" :disabled="store.members.length < 2">
					<i class="bi bi-plus-lg"></i> Pago
				</button>
			</div>

      <PaymentAddForm v-if="isAddPaymentFormVisible" @close="closeAddPaymentForm" />
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
</template>