<script setup lang="ts">
import { nextTick, ref, watch } from 'vue'
import { useExpensesStore } from '../stores/expenses'

const props = defineProps<{
	member: string
	index: number
}>()

const store = useExpensesStore()

const isEditing = ref(false)
const name = ref('')
const editErrorMessage = ref('')

const editInput = ref<HTMLInputElement | null>(null)
watch(isEditing, async (editing) => {
  if (editing) {
    await nextTick()
    editInput.value?.focus()
  }
})

const startEdit = () => {
	name.value = props.member
	editErrorMessage.value = ''
	isEditing.value = true
}

const cancelEdit = () => {
	isEditing.value = false
	name.value = ''
	editErrorMessage.value = ''
}

const updateMember = () => {
	const trimmedName = name.value.trim()
	if (!trimmedName) {
		editErrorMessage.value = 'El nombre no puede estar vacío'
		return
	}
	if (trimmedName !== props.member && store.members.includes(trimmedName)) {
		editErrorMessage.value = 'Ya existe un participante con este nombre'
		return
	}

	const success = store.updateMember(props.index, trimmedName)
	if (success) {
		isEditing.value = false
		editErrorMessage.value = ''
	}
}

const removeMember = () => {
	store.removeMember(props.index)
}
</script>

<template>
  <li class="list-group-item d-flex align-items-center justify-content-between gap-2">
    <template v-if="isEditing">
      <form
        class="d-flex flex-column gap-1 w-100"
        @submit.prevent="updateMember"
        @keydown.esc.prevent="cancelEdit"
      >
        <div class="d-flex gap-2 w-100">
          <input
            ref="editInput"
            v-model="name"
            type="text"
            class="form-control form-control-sm flex-grow-1"
            :class="{ 'is-invalid': !!editErrorMessage }"
            @input="editErrorMessage = ''"
          >
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
        <div
          v-if="editErrorMessage"
          class="invalid-feedback d-block m-0"
        >
          {{ editErrorMessage }}
        </div>
      </form>
    </template>
    <template v-else>
      <div class="d-flex gap-2 w-100 align-items-center justify-content-between">
        <span>{{ member }}</span>
        <div class="d-flex gap-1 justify-content-end">
          <button
            type="button"
            class="btn btn-sm btn-outline-secondary"
            aria-label="Editar participante"
            @click="startEdit"
          >
            <i class="bi bi-pencil-fill" />
          </button>
          <button
            type="button"
            class="btn btn-sm btn-outline-danger"
            aria-label="Eliminar participante"
            @click="removeMember"
          >
            <i class="bi bi-trash2-fill" />
          </button>
        </div>
      </div>
    </template>
  </li>
</template>
