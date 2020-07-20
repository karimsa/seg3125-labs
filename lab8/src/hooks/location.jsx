import useSWR from 'swr'

import { useStore } from './store'
import { useLocalValue } from './local-storage'
import imgHyundaiSonata2019 from '../images/hyundai-sonata-2019-white.png'
import imgHondaCRV2015Maroon from '../images/honda-crv-2015-maroon.png'

const vehicleTemplates = [
	{
		id: 0,
		imageURL: imgHyundaiSonata2019,
		imageWidth: 3,
		type: 'sedan',
		location: {
			address: '123 Storybrooke Lane, Citee, Province',
			lat: 0,
			lng: 0,
		},
		manufacturer: 'Hyundai',
		model: 'Sonata',
		year: 2019,
		price: 15,
		pricePerKm: 0.1,
		amountDriven: 193487,
	},
	{
		id: 1,
		imageURL: imgHyundaiSonata2019,
		imageWidth: 3,
		type: 'sedan',
		location: {
			address: '123 Storybrooke Lane, Citee, Province',
			lat: 0,
			lng: 0,
		},
		manufacturer: 'Hyundai',
		model: 'Sonata',
		year: 2019,
		price: 15,
		pricePerKm: 0.1,
		amountDriven: 1834803,
	},
	{
		id: 2,
		imageURL: imgHyundaiSonata2019,
		imageWidth: 3,
		type: 'sedan',
		location: {
			address: '123 Storybrooke Lane, Citee, Province',
			lat: 0.009,
			lng: 0.009,
		},
		manufacturer: 'Hyundai',
		model: 'Sonata',
		year: 2019,
		price: 15,
		pricePerKm: 0.1,
		amountDriven: 193583,
	},
	{
		id: 3,
		imageURL: imgHyundaiSonata2019,
		imageWidth: 3,
		type: 'sedan',
		location: {
			address: '123 Storybrooke Lane, Citee, Province',
			lat: 0.019,
			lng: 0.019,
		},
		manufacturer: 'Hyundai',
		model: 'Sonata',
		year: 2019,
		price: 15,
		pricePerKm: 0.1,
		amountDriven: 105000,
	},
	{
		id: 4,
		imageURL: imgHondaCRV2015Maroon,
		imageWidth: 4,
		type: 'suv',
		location: {
			address: '123 Storybrooke Lane, Citee, Province',
			lat: 0,
			lng: 0.019,
		},
		manufacturer: 'Honda',
		model: 'CRV',
		year: 2015,
		price: 19,
		pricePerKm: 0.15,
		amountDriven: 19341,
	},
	{
		id: 5,
		imageURL: imgHondaCRV2015Maroon,
		imageWidth: 4,
		type: 'suv',
		location: {
			address: '123 Storybrooke Lane, Citee, Province',
			lat: 0,
			lng: 0.019,
		},
		manufacturer: 'Honda',
		model: 'CRV',
		year: 2015,
		price: 19,
		pricePerKm: 0.15,
		amountDriven: 115358,
	},
	{
		id: 6,
		imageURL: imgHondaCRV2015Maroon,
		imageWidth: 4,
		type: 'suv',
		location: {
			address: '123 Storybrooke Lane, Citee, Province',
			lat: 0.019,
			lng: 0,
		},
		manufacturer: 'Honda',
		model: 'CRV',
		year: 2015,
		price: 19,
		pricePerKm: 0.15,
		amountDriven: 105000,
	},
]

vehicleTemplates.reduce((visited, vehicle) => {
	if (visited.has(vehicle.imageURL)) {
		return visited
	}
	visited.add(vehicle.imageURL)

	const image = new Image()
	image.classList.add('d-none')
	image.src = vehicle.imageURL
	document.body.appendChild(image)
	return visited
}, new Set())

const LAT_DELTA = 0.007
const LNG_DELTA = 0.007
const NODE_ENV = process.env.NODE_ENV

export function useCurrentLocation() {
	const [staleLocation] = useLocalValue('current-location')
	const [store, setStore] = useStore()

	return useSWR(
		['__USER_CURRENT_LOCATION__'],
		async () => {
			const coords = await new Promise((resolve, reject) => {
				if (navigator.geolocation) {
					navigator.geolocation.getCurrentPosition(
						(loc) => {
							resolve({
								lat: loc.coords.latitude,
								lng: loc.coords.longitude,
							})
						},
						(err) => {
							console.error(err)
							reject(new Error(`Sorry, we failed to get your location.`))
						},
					)
				} else {
					reject(new Error(`Sorry, we failed to get your location.`))
				}
			})
			if (
				(NODE_ENV !== 'production' && store) ||
				(NODE_ENV === 'production' && !store.vehicles)
			) {
				setStore({
					...store,
					vehicles: vehicleTemplates.map((template) => ({
						...template,
						location: {
							address: template.location.address,
							lat:
								template.location.lat +
								coords.lat +
								(Math.random() >= 0.5 ? 1 : -1) * (Math.random() * LAT_DELTA),
							lng:
								template.location.lng +
								coords.lng +
								(Math.random() >= 0.5 ? 1 : -1) * (Math.random() * LNG_DELTA),
						},
					})),
				})
			}
			return coords
		},
		{
			revalidateOnFocus: false,
			initialData: staleLocation,
		},
	)
}
