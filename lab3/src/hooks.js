import { useState, useEffect } from 'htm/preact/standalone.module.js'

export function useQueryParam(name, defaultValue = '') {
	const searchParams = new URLSearchParams(location.search)
	const [state, setState] = useState(() => {
		return searchParams.has(name) ? searchParams.get(name) : defaultValue
	})
	useEffect(() => {
		function onPopState() {
			const searchParams = new URLSearchParams(location.search)
			setState(searchParams.has(name) ? searchParams.get(name) : defaultValue)
		}
		window.addEventListener('popstate', onPopState)
		return () => window.removeEventListener('popstate', onPopState)
	}, [])
	return [
		state,
		(value) => {
			let search = `${name}=${value}`
			for (const [key, val] of searchParams.entries()) {
				if (key !== name) {
					search += `&${key}=${val}`
				}
			}
			history[
				searchParams.has(name) ?
				'replaceState' :
				'pushState'
			](
				{},
				document.title,
				`${location.pathname}?${search}`,
			)
			setState(value)
		},
	]
}
