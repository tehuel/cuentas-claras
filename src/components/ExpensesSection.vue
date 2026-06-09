<script setup lang="ts">
import ExpenseAddForm from "./ExpenseAddForm.vue";
import ExpenseListItem from "./ExpenseListItem.vue";
import {ref} from "vue";
import {useExpensesStore} from '../stores/expenses'

const store = useExpensesStore()
const isAddExpenseFormVisible = ref(false)

const openAddExpenseForm = () => {
  isAddExpenseFormVisible.value = true
}

const closeAddExpenseForm = () => {
  isAddExpenseFormVisible.value = false
}
</script>

<template>
  <section class="card">
    <div class="card-header">
      <div class="d-flex justify-content-between align-items-center">
        <h2 class="h4 m-0">
          Gastos
        </h2>
        <button
          v-show="!isAddExpenseFormVisible"
          type="button"
          class="btn btn-sm btn-primary m-0"
          :disabled="store.members.length === 0"
          @click="openAddExpenseForm"
        >
          <i class="bi bi-plus-lg" /> Gasto
        </button>
      </div>

      <ExpenseAddForm
        v-if="isAddExpenseFormVisible"
        @close="closeAddExpenseForm"
      />
    </div>

    <div
      v-if="store.expenses.length === 0"
      class="p-3 text-secondary text-center"
    >
      No hay gastos todavía.
    </div>

    <ul
      v-else
      class="list-group list-group-flush border-top-0"
    >
      <ExpenseListItem
        v-for="expense in store.expenses"
        :key="expense.id"
        :expense="expense"
      />
    </ul>
  </section>
</template>