<script setup lang="ts">
import { type Payment, useExpensesStore } from '../stores/expenses'
import { nextTick, ref, watch } from 'vue'

const props = defineProps<{
  payment: Payment,
}>()

const store = useExpensesStore()

const isEditing = ref(false)
const isConfirmingDelete = ref(false)
const amount = ref(0)
const from = ref('')
const to = ref('')
const description = ref('')

const amountInput = ref<HTMLInputElement | null>(null)
watch(isEditing, async (editing) => {
  if (editing) {
    await nextTick()
    amountInput.value?.focus()
  }
})

watch(from, (newFrom) => {
  if (isEditing.value && newFrom && newFrom === to.value) {
    to.value = ''
  }
})

const startEdit = () => {
  amount.value = props.payment.amount
  from.value = props.payment.from
  to.value = props.payment.to
  description.value = props.payment.description
  isConfirmingDelete.value = false
  isEditing.value = true
}

const cancelEdit = () => {
  isEditing.value = false
}

const updatePayment = () => {
  if (amount.value <= 0 || !from.value || !to.value || from.value === to.value) {
    return
  }
  store.updatePayment({
    id: props.payment.id,
    amount: amount.value,
    from: from.value,
    to: to.value,
    description: description.value,
  })
  isEditing.value = false
}

const confirmDelete = () => {
  store.removePayment(props.payment.id)
  isConfirmingDelete.value = false
}

const cancelDelete = () => {
  isConfirmingDelete.value = false
}
</script>

<template>
  <li class="list-group-item d-flex justify-content-between align-items-center gap-3">
    <template v-if="isEditing">
      <form
        class="row g-2 w-100 align-items-end"
        @submit.prevent="updatePayment"
        @keydown.esc.prevent="cancelEdit"
      >
        <div class="col-12 col-sm-3">
          <label class="form-label w-100 m-0">
            Monto
            <span class="input-group input-group-sm">
              <span class="input-group-text">$</span>
              <input
                ref="amountInput"
                v-model.number="amount"
                type="number"
                class="form-control"
                min="0"
                step="1"
                placeholder="Monto"
              >
            </span>
          </label>
        </div>
        <div class="col-12 col-sm-3">
          <label class="form-label w-100 m-0">
            Pagó
            <select
              v-model="from"
              class="form-select form-select-sm"
            >
              <option
                v-for="member in store.members"
                :key="member"
                :value="member"
              >{{ member }}</option>
            </select>
          </label>
        </div>
        <div class="col-12 col-sm-3">
          <label class="form-label w-100 m-0">
            A
            <select
              v-model="to"
              class="form-select form-select-sm"
            >
              <option
                v-for="member in store.members"
                :key="member"
                :value="member"
                :disabled="member === from"
              >{{ member }}</option>
            </select>
          </label>
        </div>
        <div class="col-12 col-sm-3">
          <label class="form-label w-100 m-0">
            Descripción
            <input
              v-model="description"
              type="text"
              class="form-control form-control-sm"
              placeholder="Opcional"
            >
          </label>
        </div>
        <div class="col-12 d-flex justify-content-end">
          <div class="d-flex gap-1">
            <button
              type="submit"
              class="btn btn-sm btn-success"
            >
              <i class="bi bi-check-lg" />
            </button>
            <button
              type="button"
              class="btn btn-sm btn-secondary"
              @click="cancelEdit"
            >
              <i class="bi bi-x-lg" />
            </button>
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
          <span
            v-if="payment.description"
            class="text-secondary"
          >· {{ payment.description }}</span>
        </div>

        <div class="d-flex align-items-center gap-2">
          <span class="badge text-bg-success">$ {{ payment.amount.toFixed(2) }}</span>
          <template v-if="isConfirmingDelete">
            <span class="small text-danger me-1">¿Eliminar?</span>
            <button
              type="button"
              class="btn btn-sm btn-danger"
              aria-label="Confirmar eliminación de pago"
              @click="confirmDelete"
            >
              <i class="bi bi-check-lg" />
            </button>
            <button
              type="button"
              class="btn btn-sm btn-secondary"
              aria-label="Cancelar eliminación"
              @click="cancelDelete"
            >
              <i class="bi bi-x-lg" />
            </button>
          </template>
          <template v-else>
            <button
              type="button"
              class="btn btn-sm btn-outline-secondary"
              aria-label="Editar pago"
              @click="startEdit"
            >
              <i class="bi bi-pencil-fill" />
            </button>
            <button
              type="button"
              class="btn btn-sm btn-outline-danger"
              aria-label="Eliminar pago"
              @click="isConfirmingDelete = true"
            >
              <i class="bi bi-trash2-fill" />
            </button>
          </template>
        </div>
      </div>
    </template>
  </li>
</template>