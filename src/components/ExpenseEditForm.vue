<script setup lang="ts">
import {type Expense, useExpensesStore} from "../stores/expenses.ts";
import {onMounted, ref} from "vue";

const props = defineProps<{
  expense: Expense,
}>()

const emit = defineEmits<{
  (e: 'close'): void
}>()

const store = useExpensesStore()

const updatedExpense = ref<Expense>({...props.expense})

const editExpense = () => {
  store.updateExpense(updatedExpense.value)
  emit('close')
}

const cancelEditExpense = () => {
  emit('close')
}

const amountInput = ref<HTMLInputElement | null>(null)
onMounted(() => {
  amountInput.value?.focus()
})
</script>

<template>
  <form
    class="row g-2"
    @submit.prevent="editExpense"
    @keydown.esc.prevent="cancelEditExpense"
  >
    <div class="col-12 col-sm-4">
      <label class="form-label w-100 m-0">
        Monto
        <span class="input-group input-group-sm">
          <span class="input-group-text">$</span>
          <input
            ref="amountInput"
            v-model.number="updatedExpense.amount"
            type="number"
            class="form-control"
            min="0"
            step="1"
            placeholder="Monto"
          >
        </span>
      </label>
    </div>
    <div class="col-12 col-sm-4">
      <label class="form-label w-100 m-0">
        Pagado por
        <select
          v-model="updatedExpense.from"
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
    <div class="col-12 col-sm-4">
      <label class="form-label w-100 m-0">
        Descripción
        <input
          v-model="updatedExpense.description"
          type="text"
          class="form-control form-control-sm"
          placeholder="Descripción"
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
          @click="cancelEditExpense"
        >
          <i class="bi bi-x-lg" />
        </button>
      </div>
    </div>
  </form>
</template>