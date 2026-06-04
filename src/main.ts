import Alpine from 'alpinejs'
import { createApp } from 'vue'
import { expensesApp } from './expensesApp'
import { themeInit } from './theme'
import VueStatus from './VueStatus.vue'

Alpine.data('expensesApp', expensesApp)

Alpine.start()

const vueMount = document.getElementById('vue-app')

if (vueMount) {
	createApp(VueStatus).mount(vueMount)
}

themeInit()