import PropTypes from 'prop-types'
import { useMemo, useRef } from 'react'

import { useStore, useStoreValue } from '../hooks/store'

// const LAT_DIFF = 1
// const LNG_DIFF = 1

export const Vehicles = {
	propType: PropTypes.shape({
		imageURL: PropTypes.string.isRequired,
		manufacturer: PropTypes.string.isRequired,
		model: PropTypes.string.isRequired,
		year: PropTypes.number.isRequired,
		location: PropTypes.shape({
			// address: PropTypes.string.isRequired,
			lat: PropTypes.number.isRequired,
			lng: PropTypes.number.isRequired,
		}).isRequired,
	}),

	useManufacturers(_, { retryKey }) {
		return useStoreValue(
			(store) => {
				return [
					...store.vehicles.reduce((list, vehicle) => {
						list.add(vehicle.manufacturer)
						return list
					}, new Set()),
				]
			},
			(store) => [store.vehicles, retryKey],
		)
	},

	useModels(_, { retryKey }) {
		return useStoreValue(
			(store) => {
				return [
					...store.vehicles.reduce((list, vehicle) => {
						list.add(vehicle.model)
						return list
					}, new Set()),
				]
			},
			(store) => [store.vehicles, retryKey],
		)
	},

	useVehicles({ carType, price, manufacturer, model }, { retryKey }) {
		const ref = useRef()
		ref.current = useStoreValue(
			(store) => {
				// if (!ref.current?.error) {
				// 	throw new Error(`Internal server error`)
				// }

				return store.vehicles.filter((vehicle) => {
					return (
						(vehicle.type === carType || carType === 'all') &&
						(vehicle.manufacturer === manufacturer || manufacturer === 'all') &&
						(vehicle.model === model || model === 'all') &&
						price.min <= vehicle.price &&
						vehicle.price <= price.max
					)
				})
			},
			(store) => [
				store?.vehicles,
				carType,
				price,
				manufacturer,
				model,
				retryKey,
			],
		)
		return ref.current
	},

	useVehicleById(id) {
		const [store] = useStore()
		return useMemo(() => {
			if (!store || id === undefined) {
				return { isValidating: true }
			}

			const vehicle = store.vehicles.find((vehicle) => {
				return vehicle.id === id
			})
			if (!vehicle) {
				return {
					isValidating: false,
					data: null,
					error: new Error(`Failed to find vehicle with ID ${vehicle.id}`),
				}
			}

			return {
				isValidating: false,
				data: vehicle,
			}
		}, [id, store?.vehicles])
	},
}
