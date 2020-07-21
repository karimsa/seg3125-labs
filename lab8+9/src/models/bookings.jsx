import { useMemo } from 'react'
import moment from 'moment'

import { useStore } from '../hooks/store'

export const INSURANCE_OFFERINGS = [
	{
		title: { en: 'Minimum insured', fr: 'Minimum assuré' },
		description: {
			en: `This level of insurance only covers tire changes.`,
			fr: `Ce niveau d'assurance ne couvre que les changements de pneus.`,
		},
		price: 5,
		planID: 'min',
	},

	{
		title: { fr: 'Assurance de base', en: 'Basic insurance' },
		description: {
			en: `This level of insurance gives you access to roadside assistance.`,
			fr: `Ce niveau d'assurance vous donne accès à l'assistance routière.`,
		},
		price: 8,
		planID: 'basic',
	},

	{
		title: { en: 'Premium insurance', fr: 'Assurance premium' },
		description: {
			en: `This level of insurance will cover damages up to $1000.`,
			fr: `Ce niveau d'assurance couvrira les dommages jusqu'à 1000 $.`,
		},
		price: 10,
		planID: 'premium',
	},
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
