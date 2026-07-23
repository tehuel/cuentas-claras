<script setup lang="ts">
import {type Expense, useExpensesStore} from "../stores/expenses.ts";
import ExpenseEditForm from "./ExpenseEditForm.vue";
import {ref} from "vue";
import {useNumberFormat} from "../numberFormatter.ts";

const props = defineProps<{
  expense: Expense,
}>()

const store = useExpensesStore()
const isEditing = ref(false)

const toggleParticipant = (member: string) => {
  store.toggleParticipant(props.expense.id, member)
}

const deleteExpense = () => {
  store.removeExpense(props.expense.id)
}

const { format } = useNumberFormat()
</script>

<template>
  <li class="list-group-item">
    <div class="d-flex flex-column gap-3">
      <ExpenseEditForm
        v-if="isEditing"
        :expense="expense"
        @close="isEditing = false"
      />
      <template v-else>
        <div class="d-flex justify-content-between align-items-start gap-3">
          <div class="flex-grow-1">
            <div>
              $<span style="font-variant-numeric: tabular-nums;">{{ format(expense.amount) }}</span>
              · <span>{{ expense.from }}</span>
              · <span class="fw-semibold">{{ expense.description }}</span>
            </div>
          </div>
          <div class="d-flex gap-1">
            <button
              type="button"
              class="btn btn-sm btn-outline-secondary"
              aria-label="Editar gasto"
              @click="isEditing = true"
              <i class="bi bi-pencil-fill" />
            </button>
            <button
              type="button"
              class="btn btn-sm btn-outline-danger"
              aria-label="Eliminar gasto"
              @click="deleteExpense"
              <i class="bi bi-trash2-fill" />
            </button>
          </div>
        </div>

        <div class="d-flex flex-wrap gap-3 p-2 bg-secondary-subtle rounded">
          <span>Compartir entre</span>
          <div
            v-for="member in store.members"
            :key="member"
            class="form-check d-flex align-items-center gap-2"
          >
            <input
              :id="`member-${expense.id}-${member}`"
              class="form-check-input"
              type="checkbox"
              :checked="expense.participants.includes(member)"
              @change="toggleParticipant(member)"
            <label
              class="form-check-label mb-0"
              :for="`member-${expense.id}-${member}`"
            >{{ member }}</label>
          </div>
        </div>
      </template>
    </div>
  </li>
</template>
