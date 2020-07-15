import useSWR from 'swr'

import { useLocalValue } from './local-storage'

export function useCurrentLocation() {
	const [staleLocation] = useLocalValue('current-location')
	return useSWR(
		['__USER_CURRENT_LOCATION__'],
		() => {
			return new Promise((resolve, reject) => {
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
		},
		{
			revalidateOnFocus: false,
			initialData: staleLocation,
		},
	)
}
