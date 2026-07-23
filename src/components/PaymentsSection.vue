<script setup lang="ts">
import PaymentAddForm from "./PaymentAddForm.vue";
import PaymentListItem from "./PaymentListItem.vue";
import { ref } from 'vue'
import { useExpensesStore } from '../stores/expenses'

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
        <h2 class="h4 m-0">
          Pagos
        </h2>
        <button
          v-show="!isAddPaymentFormVisible"
          type="button"
          class="btn btn-sm btn-primary m-0"
          :disabled="store.members.length < 2"
          @click="openAddPaymentForm"
        >
          <i class="bi bi-plus-lg" /> Pago
        </button>
      </div>

      <PaymentAddForm
        v-if="isAddPaymentFormVisible"
        @close="closeAddPaymentForm"
      />
    </div>

    <div
      v-if="store.payments.length === 0"
      class="p-3 text-secondary text-center"
    >
      No hay pagos todavía.
    </div>

    <ul
      v-else
      class="list-group list-group-flush border-top-0"
    >
      <PaymentListItem
        v-for="payment in store.payments"
        :key="payment.id"
        :payment="payment"
      />
    </ul>
  </section>
</template>