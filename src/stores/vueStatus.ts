import { defineStore } from 'pinia'

export const useVueStatusStore = defineStore('vueStatus', {
	state: () => ({
		clicks: 0,
		labels: ['Vue configurado', 'Pinia activo', 'Montado en la página'],
	}),
	actions: {
		increment() {
			this.clicks += 1
		},
		reset() {
			this.clicks = 0
		},
	},
})