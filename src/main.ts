import App from './App.vue'
import { createApp } from 'vue'
import { createPinia } from 'pinia'
import { themeInit } from './theme'

createApp(App).use(createPinia()).mount('#app')

themeInit()