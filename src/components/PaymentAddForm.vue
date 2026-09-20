<script setup lang="ts">
import { type Payment, useExpensesStore } from '../stores/expenses'
import { onMounted, ref, watch } from 'vue'

const emit = defineEmits<{
  (e: 'close'): void
}>()

const store = useExpensesStore()

const amount = ref(0)
const from = ref('')
const to = ref('')
const description = ref('')

const errors = ref<{
  amount?: string
  from?: string
  to?: string
}>({})

const amountInput = ref<HTMLInputElement | null>(null)
onMounted(() => {
  amountInput.value?.focus()
})

watch(from, (newFrom) => {
  if (newFrom && newFrom === to.value) {
    to.value = ''
  }
  if (errors.value.from) {
    errors.value.from = ''
  }
})

watch(to, () => {
  if (errors.value.to) {
    errors.value.to = ''
  }
})

const onAmountInput = () => {
  if (errors.value.amount) {
    errors.value.amount = ''
  }
}

const addPayment = () => {
  errors.value = {}

  if (!amount.value || amount.value <= 0) {
    errors.value.amount = 'El monto debe ser mayor a 0'
  }
  if (!from.value) {
    errors.value.from = 'Seleccioná quién pagó'
  }
  if (!to.value) {
    errors.value.to = 'Seleccioná el destinatario'
  } else if (to.value === from.value) {
    errors.value.to = 'El pagador y el destinatario deben ser diferentes'
  }

  if (Object.keys(errors.value).length > 0) {
    return
  }

  const newPayment: Payment = {
    id: crypto.randomUUID(),
    amount: amount.value,
    from: from.value,
    to: to.value,
    description: description.value,
  }

  const success = store.addPayment(newPayment)
  if (success) {
    emit('close')
  }
}

const cancelAddPayment = () => {
  emit('close')
}
</script>

<template>
  <form
    class="row g-2"
    @submit.prevent="addPayment"
    @keydown.esc.prevent="cancelAddPayment"
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
            :class="{ 'is-invalid': !!errors.amount }"
            min="0"
            step="1"
            @input="onAmountInput"
          >
        </span>
        <div
          v-if="errors.amount"
          class="invalid-feedback d-block m-0 mt-1"
        >
          {{ errors.amount }}
        </div>
      </label>
    </div>
    <div class="col-12 col-sm-3">
      <label class="form-label w-100 m-0">
        Pagó
        <select
          v-model="from"
          class="form-select form-select-sm"
          :class="{ 'is-invalid': !!errors.from }"
        >
          <option
            value=""
            disabled
          >Participante</option>
          <option
            v-for="member in store.members"
            :key="member"
            :value="member"
          >{{ member }}</option>
        </select>
        <div
          v-if="errors.from"
          class="invalid-feedback d-block m-0 mt-1"
        >
          {{ errors.from }}
        </div>
      </label>
    </div>
    <div class="col-12 col-sm-3">
      <label class="form-label w-100 m-0">
        A
        <select
          v-model="to"
          class="form-select form-select-sm"
          :class="{ 'is-invalid': !!errors.to }"
        >
          <option
            value=""
            disabled
          >Participante</option>
          <option
            v-for="member in store.members"
            :key="member"
            :value="member"
            :disabled="member === from"
          >{{ member }}</option>
        </select>
        <div
          v-if="errors.to"
          class="invalid-feedback d-block m-0 mt-1"
        >
          {{ errors.to }}
        </div>
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
          :disabled="store.members.length < 2"
        >
          <i class="bi bi-check-lg" />
        </button>
        <button
          type="button"
          class="btn btn-sm btn-secondary"
          @click="cancelAddPayment"
        >
          <i class="bi bi-x-lg" />
        </button>
      </div>
    </div>
  </form>
</template>