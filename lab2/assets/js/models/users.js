import { useStore } from '../store.js'

export const Users = {
	useCurrentUser() {
		const [store, setStore] = useStore()
		if (!store.currentUser) {
			setStore({
				...store,
				currentUser: {
					id: 0,
					name: 'Jane Smith',
					diet: {},
					activeCart: [],
				},
			})
		}
		return {
			data: store.currentUser,
			mutate: (data) =>
				setStore({
					...store,
					currentUser: data,
				}),
		}
	},
}
