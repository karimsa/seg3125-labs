import { useReducer, useEffect } from 'htm/preact/standalone.module.js'
import axios from 'axios'

const images = new Set()

function reduceUnsplashState(state, action) {
	switch (action.type) {
		case 'fetch':
			return {
				...state,
				isValidating: true,
			}
		case 'success':
			return {
				data: action.data,
			}
		case 'error':
			return {
				error: action.error,
				data: state.data,
			}
		default:
			throw new Error(`Unknown action type: ${action.type}`)
	}
}

export const Images = {
	create(id) {
		images.add(id)
		return id
	},

	useCitedImages() {
		return {
			data: [...images],
		}
	},

	useURL(id) {
		return {
			data: `https://source.unsplash.com/${id}/500x500`,
		}
	},

	useData(id) {
		const [info, dispatch] = useReducer(reduceUnsplashState, {})
		useEffect(() => {
			const promise = axios.get(`https://api.unsplash.com/photos/${id}`, {
				headers: {
					Authorization: `Client-ID maf059W4RkIGSdETdHo749dJgVDbfcEJuBhsvw2LYZ8`,
				},
			})
				.then(({ data }) => {
					dispatch({
						type: 'success',
						data: {
							name: data.alt_description,
							author: data.user.username,
							link: data.links.html,
						},
					})
				})
				.catch(error => dispatch({ type: 'error', error }))
			dispatch({
				type: 'fetch',
				promise,
			})
			return () => promise.cancel()
		}, [id])
		return info
	},
}
