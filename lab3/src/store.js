import {
	html,
	createContext,
	useContext,
	useState,
	useEffect,
} from 'htm/preact/standalone.module.js'

const StoreCtx = createContext()

export function useStore() {
	return useContext(StoreCtx)
}

export function StoreProvider({ children }) {
	const [store, setStore] = useState(() =>
		JSON.parse(localStorage.getItem('store') || '{}'),
	)
	useEffect(() => {
		localStorage.setItem('store', JSON.stringify(store))
	}, [store])

	return html`
		<${StoreCtx.Provider} value=${[store, setStore]}>
			${children}
		</${StoreCtx.Provider}>
	`
}
