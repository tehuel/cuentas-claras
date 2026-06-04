<script setup lang="ts">
import { computed, ref } from 'vue'

const clicks = ref(0)

const labels = computed(() => ['Vue configurado', 'SFC activo', 'Montado en la página'])
</script>

<template>
	<section class="card border-info-subtle shadow-sm">
		<div class="card-body d-flex flex-column flex-md-row justify-content-between align-items-md-center gap-3">
			<div>
				<p class="text-uppercase text-info fw-semibold small mb-1">Vue setup</p>
				<h2 class="h4 mb-1">Vue ya está listo en Cuentas Claras</h2>
				<p class="mb-0 text-secondary">
					El proyecto ahora tiene el plugin de Vue, soporte para componentes .vue y un punto de montaje activo.
				</p>
			</div>
			<div class="text-md-end">
				<button type="button" class="btn btn-info text-white mb-2" @click="clicks += 1">
					Probar reactividad
				</button>
				<div class="fw-semibold">{{ clicks }} clics</div>
				<div class="small text-secondary">{{ labels.join(' · ') }}</div>
			</div>
		</div>
	</section>
</template>