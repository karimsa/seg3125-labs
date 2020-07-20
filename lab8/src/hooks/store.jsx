import React, { createContext, useContext, useState, useEffect } from 'react'

const StoreCtx = createContext([])

export function useStore() {
	return useContext(StoreCtx)
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
