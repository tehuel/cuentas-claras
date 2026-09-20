<script setup lang="ts">
import { onMounted, onUnmounted, ref } from 'vue'

defineProps<{
  text: string
}>()

const buttonRef = ref<HTMLButtonElement | null>(null)

onMounted(() => {
  if (buttonRef.value && window.bootstrap?.Tooltip) {
    new window.bootstrap.Tooltip(buttonRef.value)
  }
})

onUnmounted(() => {
  if (buttonRef.value) {
    window.bootstrap?.Tooltip.getInstance(buttonRef.value)?.dispose()
  }
})
</script>

<template>
  <button
    ref="buttonRef"
    type="button"
    class="btn btn-link p-0 text-secondary opacity-75 border-0 text-decoration-none lh-1"
    data-bs-toggle="tooltip"
    :title="text"
  >
    <i class="bi bi-question-lg" />
  </button>
</template>
