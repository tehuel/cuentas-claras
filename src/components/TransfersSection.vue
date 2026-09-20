<script setup lang="ts">
import { onUnmounted, ref } from 'vue'
import { formatTransfersSummary } from '../transfersSummary'
import { useExpensesStore } from '../stores/expenses'
import { useNumberFormat } from '../numberFormatter'

const store = useExpensesStore()
const { format } = useNumberFormat('es-AR')

const isCopied = ref(false)
let copyTimeout: ReturnType<typeof setTimeout> | null = null

const copySummary = async () => {
  if (store.transfers.length === 0) return

  const summary = formatTransfersSummary(store.transfers)
  try {
    if (navigator?.clipboard?.writeText) {
      await navigator.clipboard.writeText(summary)
    } else {
      const textArea = document.createElement('textarea')
      textArea.value = summary
      textArea.style.position = 'fixed'
      textArea.style.opacity = '0'
      document.body.appendChild(textArea)
      textArea.select()
      document.execCommand('copy')
      document.body.removeChild(textArea)
    }

    isCopied.value = true
    if (copyTimeout) clearTimeout(copyTimeout)
    copyTimeout = setTimeout(() => {
      isCopied.value = false
    }, 2000)
  } catch (error) {
    console.error('Error al copiar al portapapeles:', error)
  }
}

onUnmounted(() => {
  if (copyTimeout) clearTimeout(copyTimeout)
})
</script>

<template>
  <section class="card bg-primary">
    <div class="card-header">
      <div class="d-flex justify-content-between align-items-center">
        <h2 class="h4 m-0">
          Reparto
        </h2>
        <button
          v-if="store.transfers.length > 0"
          type="button"
          class="btn btn-sm"
          :class="isCopied ? 'btn-success' : 'btn-light'"
          aria-label="Copiar resumen de reparto para WhatsApp"
          @click="copySummary"
        >
          <template v-if="isCopied">
            <i class="bi bi-check-lg me-1" /> Copiado
          </template>
          <template v-else>
            <i class="bi bi-copy me-1" /> Copiar
          </template>
        </button>
      </div>
    </div>

    <div
      v-if="store.transfers.length === 0"
      class="p-3 text-secondary text-center"
    >
      No hay transferencias necesarias.
    </div>

    <ul
      v-else
      class="list-group list-group-flush border-top-0"
    >
      <li
        v-for="(transfer, index) in store.transfers"
        :key="index"
        class="list-group-item d-flex justify-content-between align-items-center"
      >
        <span>
          <strong>{{ transfer.from }}</strong>
          le debe a
          <strong>{{ transfer.to }}</strong>
        </span>
        <span class="badge text-bg-primary">$ {{ format(Math.round(transfer.amount), { maximumFractionDigits: 0 }) }}</span>
      </li>
    </ul>
  </section>
</template>