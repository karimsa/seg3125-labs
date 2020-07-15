import useSWR from 'swr'

import { useStore } from './store'
import { useLocalValue } from './local-storage'
import imgHyundaiSonata2019 from '../images/hyundai-sonata-2019-white.png'
import imgHondaCRV2015Maroon from '../images/honda-crv-2015-maroon.png'

const vehicleTemplates = [
	{
		id: 0,
		imageURL: imgHyundaiSonata2019,
		type: 'sedan',
		location: {
			lat: 0,
			lng: 0,
		},
		manufacturer: 'Hyundai',
		model: 'Sonata',
		year: 2019,
		price: 15,
	},
	{
		id: 1,
		imageURL: imgHyundaiSonata2019,
		type: 'sedan',
		location: {
			lat: 0,
			lng: 0,
		},
		manufacturer: 'Hyundai',
		model: 'Sonata',
		year: 2019,
		price: 15,
	},
	{
		id: 2,
		imageURL: imgHyundaiSonata2019,
		type: 'sedan',
		location: {
			lat: 0.009,
			lng: 0.009,
		},
		manufacturer: 'Hyundai',
		model: 'Sonata',
		year: 2019,
		price: 15,
	},
	{
		id: 3,
		imageURL: imgHyundaiSonata2019,
		type: 'sedan',
		location: {
			lat: 0.019,
			lng: 0.019,
		},
		manufacturer: 'Hyundai',
		model: 'Sonata',
		year: 2019,
		price: 15,
	},
	{
		id: 4,
		imageURL: imgHondaCRV2015Maroon,
		type: 'suv',
		location: {
			lat: 0,
			lng: 0.019,
		},
		manufacturer: 'Honda',
		model: 'CRV',
		year: 2015,
		price: 19,
	},
	{
		id: 5,
		imageURL: imgHondaCRV2015Maroon,
		type: 'suv',
		location: {
			lat: 0,
			lng: 0.019,
		},
		manufacturer: 'Honda',
		model: 'CRV',
		year: 2015,
		price: 19,
	},
	{
		id: 6,
		imageURL: imgHondaCRV2015Maroon,
		type: 'suv',
		location: {
			lat: 0.019,
			lng: 0,
		},
		manufacturer: 'Honda',
		model: 'CRV',
		year: 2015,
		price: 19,
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
