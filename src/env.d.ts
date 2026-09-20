/// <reference types="vite/client" />

declare module '*.vue' {
	import type { DefineComponent } from 'vue'

	const component: DefineComponent<Record<string, unknown>, Record<string, unknown>, unknown>
	export default component
}

interface BootstrapTooltip {
	dispose(): void
	hide(): void
	show(): void
	toggle(): void
}

interface BootstrapNamespace {
	Tooltip: {
		new (
			element: Element | string,
			options?: Record<string, unknown>,
		): BootstrapTooltip
		getInstance(element: Element | string): BootstrapTooltip | null
	}
}

declare const bootstrap: BootstrapNamespace | undefined

interface Window {
	bootstrap?: BootstrapNamespace
}