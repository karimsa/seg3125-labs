import PropTypes from 'prop-types'

import { useStore } from '../hooks/store'

// const LAT_DIFF = 1
// const LNG_DIFF = 1

export const Vehicles = {
	propType: PropTypes.shape({
		imageURL: PropTypes.string.isRequired,
		manufacturer: PropTypes.string.isRequired,
		model: PropTypes.string.isRequired,
		year: PropTypes.number.isRequired,
	}),

	useVehicles({ carType, price }) {
		const [store] = useStore()
		if (!store) {
			return { isValidating: true }
		}
		return {
			data: store.vehicles.filter((vehicle) => {
				return (
					(vehicle.type === carType || carType === 'all') &&
					price.min <= vehicle.price &&
					vehicle.price <= price.max
					// &&
					// lat - LAT_DIFF <= vehicle.lat &&
					// vehicle.lat <= lat + LAT_DIFF &&
					// lng - LNG_DIFF <= vehicle.lng &&
					// vehicle.lng <= lng - LNG_DIFF
				)
			}),
		}
	},
}
