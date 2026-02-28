import Alpine from 'alpinejs'
import { expensesApp } from './expensesApp'
import { themeInit } from './theme'

Alpine.data('expensesApp', expensesApp)

Alpine.start()

themeInit()