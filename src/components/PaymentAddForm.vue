<script setup lang="ts">
import {type Payment, useExpensesStore} from "../stores/expenses.ts";
import {onMounted, ref} from "vue";

const emit = defineEmits<{
  (e: 'close'): void
}>()

const store = useExpensesStore()

const amount = ref(0)
const from = ref('')
const to = ref('')
const description = ref('')

const amountInput = ref<HTMLInputElement | null>(null)
onMounted(() => {
  amountInput.value?.focus()
})

const addPayment = () => {
  const newPayment: Payment = {
    id: Date.now().toString(),
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
  <form class="row g-2" @submit.prevent="addPayment" @keydown.esc.prevent="cancelAddPayment">
    <div class="col-12 col-sm-3">
      <label class="form-label w-100 m-0">
        Monto
        <span class="input-group input-group-sm">
          <span class="input-group-text">$</span>
          <input ref="amountInput" v-model="amount" type="number" class="form-control" min="0" step="1" />
        </span>
      </label>
    </div>
    <div class="col-12 col-sm-3">
      <label class="form-label w-100 m-0">
        Pagó
        <select v-model="from" class="form-select form-select-sm">
          <option value="" disabled>Participante</option>
          <option v-for="member in store.members" :key="member" :value="member">{{ member }}</option>
        </select>
      </label>
    </div>
    <div class="col-12 col-sm-3">
      <label class="form-label w-100 m-0">
        A
        <select v-model="to" class="form-select form-select-sm">
          <option value="" disabled>Participante</option>
          <option v-for="member in store.members" :key="member" :value="member">{{ member }}</option>
        </select>
      </label>
    </div>
    <div class="col-12 col-sm-3">
      <label class="form-label w-100 m-0">
        Nota
        <input v-model="description" type="text" class="form-control form-control-sm" placeholder="Opcional" />
      </label>
    </div>
    <div class="col-12 d-flex justify-content-end">
      <div class="d-flex gap-1">
        <button type="submit" class="btn btn-sm btn-success" :disabled="store.members.length < 2"><i class="bi bi-check-lg"></i></button>
        <button type="button" class="btn btn-sm btn-secondary" @click="cancelAddPayment"><i class="bi bi-x-lg"></i></button>
      </div>
    </div>
  </form>
</template>

<style scoped>

</style>