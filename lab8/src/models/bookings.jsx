import { useMemo } from 'react'
import moment from 'moment'

import { useStore } from '../hooks/store'

export const INSURANCE_OFFERINGS = [
	{
		title: 'Minimum insured',
		price: 5,
		planID: 'min',
	},

	{
		title: 'Basic insurance',
		price: 8,
		planID: 'basic',
	},

	{ title: 'Premium insurance', price: 10, planID: 'premium' },
]

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

	useActiveBooking() {
		const { data: bookings } = Bookings.useBookings()
		return useMemo(() => {
			return bookings?.find((booking) => {
				const timeStart = moment(booking.timeStart)
				const timeEnd = moment(booking.timeEnd)
				return (
					moment().isSameOrAfter(timeStart) && moment().isSameOrBefore(timeEnd)
				)
			})
		}, [bookings])
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
