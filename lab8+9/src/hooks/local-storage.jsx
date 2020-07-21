import { useState, useEffect } from 'react'

export function useLocalValue(key, defaultValue) {
	const [state, setState] = useState(() => {
		return JSON.parse(localStorage.getItem(key) || null) ?? defaultValue
	})
	useEffect(() => {
		localStorage.setItem(key, JSON.stringify(state ?? null))
	}, [state])
	return [state, setState]
}
