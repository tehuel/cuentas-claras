const THEME_STORAGE_KEY = 'theme'

const setTheme = (theme: 'light' | 'dark') => {
	document.body.setAttribute('data-bs-theme', theme)
	localStorage.setItem(THEME_STORAGE_KEY, theme)
}

export const themeInit = () => {
	const themeToggleButtons = document.querySelectorAll<HTMLElement>('[data-theme-toggle]')

	const savedTheme = localStorage.getItem(THEME_STORAGE_KEY)
	const preferredTheme = window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light'
	const initialTheme = savedTheme === 'dark' || savedTheme === 'light' ? savedTheme : preferredTheme

	setTheme(initialTheme)

	themeToggleButtons.forEach((button) => {
		button.addEventListener('click', () => {
			const currentTheme = document.body.getAttribute('data-bs-theme') === 'dark' ? 'dark' : 'light'
			setTheme(currentTheme === 'dark' ? 'light' : 'dark')
		})
	})
}