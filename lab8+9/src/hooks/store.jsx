import React, {
	createContext,
	useContext,
	useState,
	useEffect,
	useMemo,
} from 'react'

const StoreCtx = createContext([])

export function useStore() {
	return useContext(StoreCtx)
}

export function useStoreValue(fn, deps) {
	const [store] = useStore()
	const [lastFocusedAt, setLastFocusedAt] = useState()
	useEffect(() => {
		function handler() {
			setLastFocusedAt(Date.now())
		}
		window.addEventListener('focus', handler)
		return () => window.removeEventListener('focus', handler)
	}, [])
	return useMemo(() => {
		if (!store) {
			return { isValidating: true }
		}

		try {
			return {
				isValidating: false,
				data: fn(store),
			}
		} catch (error) {
			console.warn(error)
			return {
				error: new Error(
					`Sorry, something has gone wrong. Please try reloading the page.`,
				),
			}
		}
	}, [...deps(store), lastFocusedAt])
}

export function StoreProvider({ children }) {
	const [store, setStore] = useState(
		() =>
			JSON.parse(localStorage.getItem('store') || null) || {
				vehicles: [],
				bookings: [],
			},
	)
	useEffect(() => {
		localStorage.setItem('store', JSON.stringify(store))
	}, [store])

	return (
		<StoreCtx.Provider value={[store, setStore]}>{children}</StoreCtx.Provider>
	)
}
