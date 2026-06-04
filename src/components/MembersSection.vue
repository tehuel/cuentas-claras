<script setup lang="ts">
import { nextTick, ref, watch } from 'vue'
import { useExpensesStore } from '../stores/expenses'

const store = useExpensesStore()
const memberInput = ref<HTMLInputElement | null>(null)
const editInput = ref<HTMLInputElement | null>(null)

const showMemberForm = ref(false)
const memberName = ref('')

const editingIndex = ref(-1)
const editingName = ref('')

const showAddMemberForm = () => {
	showMemberForm.value = true
}

const cancelAddMemberForm = () => {
	showMemberForm.value = false
	memberName.value = ''
}

const addMember = () => {
	const success = store.addMember(memberName.value)
	if (success) {
		memberName.value = ''
		showMemberForm.value = false
	} else {
		memberName.value = ''
	}
}

const startEditMember = (index: number) => {
	editingIndex.value = index
	editingName.value = store.members[index] || ''
}

const cancelEditMember = () => {
	editingIndex.value = -1
	editingName.value = ''
}

const updateMember = (index: number) => {
	const success = store.updateMember(index, editingName.value)
	if (success) {
		cancelEditMember()
	}
}

const removeMember = (index: number) => {
	if (editingIndex.value === index) {
		cancelEditMember()
	}
	store.removeMember(index)
}

const setEditInput = (el: any) => {
	editInput.value = el
}

watch(
	showMemberForm,
	async (isVisible) => {
		if (!isVisible) return
		await nextTick()
		memberInput.value?.focus()
	},
)

watch(
	editingIndex,
	async (index) => {
		if (index === -1) return
		await nextTick()
		editInput.value?.focus()
	},
)
</script>

<template>
	<section class="card">
		<div class="card-header">
			<div class="d-flex justify-content-between align-items-center">
				<h2 class="h4 m-0">Participantes</h2>
				<button type="button" class="btn btn-sm btn-primary m-0" @click="showAddMemberForm()" v-show="!showMemberForm">
					<i class="bi bi-plus-lg"></i> Participante
				</button>
			</div>

			<div v-show="showMemberForm" class="mt-3">
				<form class="row g-2" @submit.prevent="addMember" @keydown.esc.prevent="cancelAddMemberForm()">
					<div class="col-12">
						<label class="form-label w-100">
							Nombre
							<input ref="memberInput" v-model="memberName" type="text" class="form-control form-control-sm" />
						</label>
					</div>
					<div class="col-12 d-flex justify-content-end">
						<div class="d-flex gap-1">
							<button type="submit" class="btn btn-sm btn-success"><i class="bi bi-check-lg"></i></button>
							<button type="button" class="btn btn-sm btn-secondary" @click="cancelAddMemberForm()"><i class="bi bi-x-lg"></i></button>
						</div>
					</div>
				</form>
			</div>
		</div>

		<div v-if="store.members.length === 0" class="p-3 text-secondary text-center">
			No hay participantes todavía.
		</div>

		<ul v-else class="list-group list-group-flush border-top-0">
			<li v-for="(member, index) in store.members" :key="member" class="list-group-item d-flex align-items-center justify-content-between gap-2">
				<template v-if="editingIndex === index">
					<form class="d-flex gap-2 w-100" @submit.prevent="updateMember(index)" @keydown.esc.prevent="cancelEditMember()">
						<input :ref="setEditInput" v-model="editingName" type="text" class="form-control form-control-sm flex-grow-1" />
						<div class="d-flex gap-1">
							<button type="submit" class="btn btn-sm btn-success"><i class="bi bi-check-lg"></i></button>
							<button type="button" class="btn btn-sm btn-secondary" @click="cancelEditMember()"><i class="bi bi-x-lg"></i></button>
						</div>
					</form>
				</template>
				<template v-else>
					<div class="d-flex gap-2 w-100 align-items-center justify-content-between">
						<span>{{ member }}</span>
						<div class="d-flex gap-1 justify-content-end">
							<button type="button" class="btn btn-sm btn-outline-secondary" @click="startEditMember(index)"><i class="bi bi-pencil-fill"></i></button>
							<button type="button" class="btn btn-sm btn-outline-danger" @click="removeMember(index)"><i class="bi bi-trash2-fill"></i></button>
						</div>
					</div>
				</template>
			</li>
		</ul>
	</section>
</template>