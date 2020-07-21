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
			return { error }
		}
	}, deps(store))
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
