import { useMemo } from 'react'

import { useStore } from '../hooks/store'

export const Bookings = {
	useBookings() {
		const [store] = useStore()
		return useMemo(() => {
			if (!store) {
				return { isValidating: false }
			}
			return { data: store.bookings }
		}, [store])
	},

	useActions() {
		const [store, setStore] = useStore()
		return {
			insert: (booking) =>
				setStore({
					...store,
					bookings: [...store.bookings, booking],
				}),
			update: (booking) =>
				setStore({
					...store,
					bookings: store.bookings.map((item) => {
						if (item.id === booking.id) {
							return booking
						}
						return item
					}),
				}),
		}
	},
}
