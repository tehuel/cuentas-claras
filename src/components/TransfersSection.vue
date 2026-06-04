<script setup lang="ts">
import { useExpensesStore } from '../stores/expenses'

const store = useExpensesStore()
</script>

<template>
	<section class="card">
		<div class="card-header"><h2 class="h4 m-0">Reparto</h2></div>

		<div v-if="store.transfers.length === 0" class="p-3 text-secondary text-center">
			No hay transferencias necesarias.
		</div>

		<ul v-else class="list-group list-group-flush border-top-0">
			<li v-for="(transfer, index) in store.transfers" :key="index" class="list-group-item d-flex justify-content-between align-items-center">
				<span>
					<strong>{{ transfer.from }}</strong>
					le debe a
					<strong>{{ transfer.to }}</strong>
				</span>
				<span class="badge text-bg-primary">$ {{ transfer.amount.toFixed(2) }}</span>
			</li>
		</ul>
	</section>
</template>