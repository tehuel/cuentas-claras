<script setup lang="ts">
import {useExpensesStore} from '../stores/expenses'
import ExpenseAddForm from "./ExpenseAddForm.vue";
import ExpenseListItem from "./ExpenseListItem.vue";
import {ref} from "vue";

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
				<h2 class="h4 m-0">Gastos</h2>
				<button type="button" class="btn btn-sm btn-primary m-0" @click="openAddExpenseForm" v-show="!isAddExpenseFormVisible" :disabled="store.members.length === 0">
					<i class="bi bi-plus-lg"></i> Gasto
				</button>
			</div>

      <ExpenseAddForm v-if="isAddExpenseFormVisible" @close="closeAddExpenseForm" />
		</div>

		<div v-if="store.expenses.length === 0" class="p-3 text-secondary text-center">
			No hay gastos todavía.
		</div>

		<ul v-else class="list-group list-group-flush border-top-0">
      <ExpenseListItem
        v-for="expense in store.expenses"
        :key="expense.id"
        :expense="expense"
      />
		</ul>
	</section>
</template>