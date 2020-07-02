import axiosMod from 'axios'

export const axios = axiosMod.create({
	baseURL: `${location.protocol}//${location.hostname}:8080`,
})
axios.interceptors.response.use(
	res => res,
	error => {
		if (
			String(error).match(/network error|failed with status/i) ||
			(error.response &&
				error.response.data &&
				error.response.data.error &&
				error.response.status >= 500)
		) {
			return Promise.reject(
				new Error(
					'The application is currently unavailable. Please try again later.',
				),
			)
		}

		return Promise.reject(error)
	},
)
