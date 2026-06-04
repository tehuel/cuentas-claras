<script setup lang="ts">
import { ref } from 'vue'
import { useExpensesStore } from '../stores/expenses'
import MemberAddForm from './MemberAddForm.vue'
import MemberListItem from './MemberListItem.vue'

const store = useExpensesStore()
const isAddMemberFormVisible = ref(false)

const openAddMemberForm = () => {
	isAddMemberFormVisible.value = true
}

const closeAddMemberForm = () => {
	isAddMemberFormVisible.value = false
}
</script>

<template>
	<section class="card">
		<div class="card-header">
			<div class="d-flex justify-content-between align-items-center">
				<h2 class="h4 m-0">Participantes</h2>
				<button type="button" class="btn btn-sm btn-primary m-0" @click="openAddMemberForm" v-show="!isAddMemberFormVisible">
					<i class="bi bi-plus-lg"></i> Participante
				</button>
			</div>

			<MemberAddForm v-if="isAddMemberFormVisible" @close="closeAddMemberForm" />
		</div>

		<div v-if="store.members.length === 0" class="p-3 text-secondary text-center">
			No hay participantes todavía.
		</div>

		<ul v-else class="list-group list-group-flush border-top-0">
			<MemberListItem
				v-for="(member, index) in store.members"
				:key="member"
				:member="member"
				:index="index"
			/>
		</ul>
	</section>
</template>