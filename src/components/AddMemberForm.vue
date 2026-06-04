<script setup lang="ts">
import { ref, onMounted } from 'vue'
import { useExpensesStore } from '../stores/expenses'

const emit = defineEmits<{
	(e: 'close'): void
}>()

const store = useExpensesStore()
const memberName = ref('')
const memberInput = ref<HTMLInputElement | null>(null)

onMounted(() => {
	memberInput.value?.focus()
})

const addMember = () => {
	const success = store.addMember(memberName.value)
	if (success) {
		memberName.value = ''
		emit('close')
	} else {
		memberName.value = ''
	}
}

const cancelAddMemberForm = () => {
	memberName.value = ''
	emit('close')
}
</script>

<template>
	<div class="mt-3">
		<form class="row g-2" @submit.prevent="addMember" @keydown.esc.prevent="cancelAddMemberForm">
			<div class="col-12">
				<label class="form-label w-100">
					Nombre
					<input ref="memberInput" v-model="memberName" type="text" class="form-control form-control-sm" />
				</label>
			</div>
			<div class="col-12 d-flex justify-content-end">
				<div class="d-flex gap-1">
					<button type="submit" class="btn btn-sm btn-success"><i class="bi bi-check-lg"></i></button>
					<button type="button" class="btn btn-sm btn-secondary" @click="cancelAddMemberForm"><i class="bi bi-x-lg"></i></button>
				</div>
			</div>
		</form>
	</div>
</template>
