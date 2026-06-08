<script setup lang="ts">
import { useExpensesStore } from '../stores/expenses'
import { ref, onMounted } from 'vue'

const emit = defineEmits<{
  (e: 'close'): void
}>()

const store = useExpensesStore()

const amount = ref(0)
const from = ref('')
const description = ref('')

const amountInput = ref<HTMLInputElement | null>(null)
onMounted(() => {
  amountInput.value?.focus()
})

const addExpense = () => {
  const newExpense = {
    id: Date.now().toString(),
    description: description.value,
    amount: amount.value,
    from: from.value,
    participants: [...store.members],
  }
  const success = store.addExpense(newExpense)
  if (success) {
    emit('close')
  }
}

const cancelAddExpense = () => {
  emit('close')
}
</script>

<template>
  <form
    class="row g-2"
    @submit.prevent="addExpense"
    @keydown.esc.prevent="cancelAddExpense"
  >
    <div class="col-12 col-sm-4">
      <label class="form-label w-100 m-0">
        Monto
        <span class="input-group input-group-sm">
          <span class="input-group-text">$</span>
          <input
            ref="amountInput"
            v-model="amount"
            type="number"
            class="form-control"
            min="0"
            step="1"
          >
        </span>
      </label>
    </div>
    <div class="col-12 col-sm-4">
      <label class="form-label w-100 m-0">
        Pagado por
        <select
          v-model="from"
          class="form-select form-select-sm"
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
      </label>
    </div>
    <div class="col-12 col-sm-4">
      <label class="form-label w-100 m-0">
        Descripción
        <input
          v-model="description"
          type="text"
          class="form-control form-control-sm"
        >
      </label>
    </div>
    <div class="col-12 d-flex justify-content-end">
      <div class="d-flex gap-1">
        <button
          type="submit"
          class="btn btn-sm btn-success"
          :disabled="store.members.length === 0"
        >
          <i class="bi bi-check-lg" />
        </button>
        <button
          type="button"
          class="btn btn-sm btn-secondary"
          @click="cancelAddExpense"
        >
          <i class="bi bi-x-lg" />
        </button>
      </div>
    </div>
  </form>
</template>