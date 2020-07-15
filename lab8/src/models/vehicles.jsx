import imgHyundaiSonata2019 from '../images/hyundai-sonata-2019-white.png'

const VEHICLES = [
	{
		id: 0,
		imageURL: imgHyundaiSonata2019,
		type: 'sedan',
		location: {
			lat: 43.194852977801446,
			lng: -79.87198441191966,
		},
		manufacturer: 'Hyundai',
		model: 'Sonata',
		year: 2019,
		price: 15,
	},
]

// const LAT_DIFF = 1
// const LNG_DIFF = 1

export const Vehicles = {
	async search({ carType, price: { min, max } }) {
		return VEHICLES.filter((vehicle) => {
			return (
				(vehicle.type === carType || carType === 'all') &&
				min <= vehicle.price &&
				vehicle.price <= max
				// &&
				// lat - LAT_DIFF <= vehicle.lat &&
				// vehicle.lat <= lat + LAT_DIFF &&
				// lng - LNG_DIFF <= vehicle.lng &&
				// vehicle.lng <= lng - LNG_DIFF
			)
		})
	},
}
