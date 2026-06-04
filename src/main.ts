import { createApp } from 'vue'
import { createPinia } from 'pinia'
import App from './App.vue'
import { themeInit } from './theme'

createApp(App).use(createPinia()).mount('#app')

themeInit()