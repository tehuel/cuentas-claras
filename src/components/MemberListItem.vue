<script setup lang="ts">
import { ref, nextTick, watch } from 'vue'
import { useExpensesStore } from '../stores/expenses'

const props = defineProps<{
	member: string
	index: number
}>()

const store = useExpensesStore()

const isEditing = ref(false)
const name = ref('')

const editInput = ref<HTMLInputElement | null>(null)
watch(isEditing, async (editing) => {
  if (editing) {
    await nextTick()
    editInput.value?.focus()
  }
})

const startEdit = () => {
	name.value = props.member
	isEditing.value = true
}

const cancelEdit = () => {
	isEditing.value = false
	name.value = ''
}

const updateMember = () => {
	store.updateMember(props.index, name.value)
  isEditing.value = false
}

const removeMember = () => {
	store.removeMember(props.index)
}
</script>

<template>
  <li class="list-group-item d-flex align-items-center justify-content-between gap-2">
    <template v-if="isEditing">
      <form
        class="d-flex gap-2 w-100"
        @submit.prevent="updateMember"
        @keydown.esc.prevent="cancelEdit"
      >
        <input
          ref="editInput"
          v-model="name"
          type="text"
          class="form-control form-control-sm flex-grow-1"
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
      </form>
    </template>
    <template v-else>
      <div class="d-flex gap-2 w-100 align-items-center justify-content-between">
        <span>{{ member }}</span>
        <div class="d-flex gap-1 justify-content-end">
          <button
            type="button"
            class="btn btn-sm btn-outline-secondary"
            @click="startEdit"
          >
            <i class="bi bi-pencil-fill" />
          </button>
          <button
            type="button"
            class="btn btn-sm btn-outline-danger"
            @click="removeMember"
          >
            <i class="bi bi-trash2-fill" />
          </button>
        </div>
      </div>
    </template>
  </li>
</template>
