<script setup lang="ts">
import {type Expense, useExpensesStore} from "../stores/expenses.ts";
import {nextTick, ref, watch} from "vue";

const props = defineProps<{
  expense: Expense,
}>()

const store = useExpensesStore()

const isEditing = ref(false)
const amountInput = ref<HTMLInputElement | null>(null)
const editingAmount = ref(0)
const editingFrom = ref('')
const editingDescription = ref('')

const startEdit = () => {
  editingAmount.value = props.expense.amount
  editingFrom.value = props.expense.from
  editingDescription.value = props.expense.description
  isEditing.value = true
}

const cancelEdit = () => {
  isEditing.value = false
}

const updateExpense = () => {
  store.updateExpense({
    id: props.expense.id,
    amount: editingAmount.value,
    from: editingFrom.value,
    description: editingDescription.value,
    participants: props.expense.participants,
  })
  isEditing.value = false
}

const toggleParticipant = (member: string) => {
  store.toggleParticipant(props.expense.id, member)
}

const deleteExpense = () => {
  store.removeExpense(props.expense.id)
}

watch(isEditing, async (editing) => {
  if (editing) {
    await nextTick()
    amountInput.value?.focus()
  }
})
</script>

<template>
  <li class="list-group-item">
    <div class="d-flex flex-column gap-3">
      <template v-if="isEditing">
        <form class="row g-2" @submit.prevent="updateExpense" @keydown.esc.prevent="cancelEdit">
          <div class="col-12 col-sm-4">
            <label class="form-label w-100 m-0">
              Monto
              <span class="input-group input-group-sm">
                <span class="input-group-text">$</span>
                <input ref="amountInput" v-model.number="editingAmount" type="number" class="form-control" min="0" step="1" placeholder="Monto" />
              </span>
            </label>
          </div>
          <div class="col-12 col-sm-4">
            <label class="form-label w-100 m-0">
              Pagado por
              <select v-model="editingFrom" class="form-select form-select-sm">
                <option v-for="member in store.members" :key="member" :value="member">{{ member }}</option>
              </select>
            </label>
          </div>
          <div class="col-12 col-sm-4">
            <label class="form-label w-100 m-0">
              Descripción
              <input v-model="editingDescription" type="text" class="form-control form-control-sm" placeholder="Descripción" />
            </label>
          </div>
          <div class="col-12 d-flex justify-content-end">
            <div class="d-flex gap-1">
              <button type="submit" class="btn btn-sm btn-success"><i class="bi bi-check-lg"></i></button>
              <button type="button" class="btn btn-sm btn-secondary" @click="cancelEdit"><i class="bi bi-x-lg"></i></button>
            </div>
          </div>
        </form>
      </template>

      <template v-else>
        <div class="d-flex justify-content-between align-items-start gap-3">
          <div class="flex-grow-1">
            <div>
              $<span style="font-variant-numeric: tabular-nums;">{{ expense.amount.toFixed(2) }}</span>
              · <span>{{ expense.from }}</span>
              · <span class="fw-semibold">{{ expense.description }}</span>
            </div>
          </div>
          <div class="d-flex gap-1">
            <button type="button" class="btn btn-sm btn-outline-secondary" @click="startEdit"><i class="bi bi-pencil-fill"></i></button>
            <button type="button" class="btn btn-sm btn-outline-danger" @click="deleteExpense"><i class="bi bi-trash2-fill"></i></button>
          </div>
        </div>

        <div class="d-flex flex-wrap gap-3 p-2 bg-secondary-subtle rounded">
          <span>Compartir entre</span>
          <div v-for="member in store.members" :key="member" class="form-check d-flex align-items-center gap-2">
            <input :id="`member-${expense.id}-${member}`" class="form-check-input" type="checkbox" :checked="expense.participants.includes(member)" @change="() => {toggleParticipant(member)}" />
            <label class="form-check-label mb-0" :for="`member-${expense.id}-${member}`">{{ member }}</label>
          </div>
        </div>
      </template>
    </div>
  </li>
</template>
