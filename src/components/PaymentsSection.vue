<script setup lang="ts">
import { ref } from 'vue'
import { useExpensesStore } from '../stores/expenses'
import PaymentAddForm from "./PaymentAddForm.vue";
import PaymentListItem from "./PaymentListItem.vue";

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
      <PaymentListItem v-for="payment in store.payments" :key="payment.id" :payment="payment" />
		</ul>
	</section>
</template>