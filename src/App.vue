<script setup lang="ts">
import AppFooter from './components/AppFooter.vue'
import AppHeader from './components/AppHeader.vue'
import ExpensesSection from './components/ExpensesSection.vue'
import MembersSection from './components/MembersSection.vue'
import PaymentsSection from './components/PaymentsSection.vue'
import TransfersSection from './components/TransfersSection.vue'
import { onMounted } from 'vue'
import { useExpensesStore } from './stores/expenses'

const store = useExpensesStore()

onMounted(() => {
	store.loadState()
})
</script>

<template>
  <div class="d-flex flex-column min-vh-100">
    <AppHeader />

    <main class="container d-flex flex-column gap-4 my-4">
      <MembersSection />
      <ExpensesSection />
      <PaymentsSection />
      <TransfersSection />
    </main>

    <AppFooter />
  </div>
</template>