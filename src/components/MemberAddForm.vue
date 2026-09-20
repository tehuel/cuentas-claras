<script setup lang="ts">
import { onMounted, ref } from 'vue'
import { useExpensesStore } from '../stores/expenses'

const emit = defineEmits<{
	(e: 'close'): void
}>()

const store = useExpensesStore()
const memberName = ref('')
const errorMessage = ref('')

const memberInput = ref<HTMLInputElement | null>(null)
onMounted(() => {
	memberInput.value?.focus()
})

const addMember = () => {
	const trimmedName = memberName.value.trim()
	if (!trimmedName) {
		errorMessage.value = 'El nombre no puede estar vacío'
		return
	}
	if (store.members.includes(trimmedName)) {
		errorMessage.value = 'Ya existe un participante con este nombre'
		return
	}

	const success = store.addMember(trimmedName)
	if (success) {
		emit('close')
	}
}

const cancelAddMemberForm = () => {
	emit('close')
}
</script>

<template>
  <div class="mt-3">
    <form
      class="row g-2"
      @submit.prevent="addMember"
      @keydown.esc.prevent="cancelAddMemberForm"
    >
      <div class="col-12">
        <label class="form-label w-100">
          Nombre
          <input
            ref="memberInput"
            v-model="memberName"
            type="text"
            class="form-control form-control-sm"
            :class="{ 'is-invalid': !!errorMessage }"
            @input="errorMessage = ''"
          >
          <div
            v-if="errorMessage"
            class="invalid-feedback d-block"
          >
            {{ errorMessage }}
          </div>
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
            @click="cancelAddMemberForm"
          >
            <i class="bi bi-x-lg" />
          </button>
        </div>
      </div>
    </form>
  </div>
</template>
