import { useState } from 'https://unpkg.com/htm/preact/standalone.module.js'

export function useQueryParam(name, defaultValue = '') {
	const searchParams = new URLSearchParams(location.search)
	const [state, setState] = useState(() => {
		return searchParams.has(name) ? searchParams.get(name) : defaultValue
	})
	return [
		state,
		(value) => {
			let search = `${name}=${value}`
			for (const [key, val] of searchParams.entries()) {
				if (key !== name) {
					search += `&${key}=${val}`
				}
			}
			history.replaceState(
				null,
				document.title,
				`${location.pathname}?${search}`,
			)
			setState(value)
		},
	]
}
