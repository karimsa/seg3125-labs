import { useState, useReducer, useEffect } from 'react'

const kPromise = Symbol('promise')

export function useAsyncAction(fn, deps) {
	const [asyncArgs, setAsyncArgs] = useState()
	const [state, dispatch] = useReducer(
		(state, action) => {
			switch (action.type) {
				case 'FETCH':
					if (state.status === 'inprogress') {
						throw new Error(
							`Cannot re-fetch async action that is already inprogress`,
						)
					}
					setAsyncArgs(action.args)
					return {
						isValidating: true,
						data: state.data,
						error: state.error,
					}

				case 'FORCE_FETCH':
					setAsyncArgs(action.args)
					return {
						isValidating: true,
						data: state.data,
						error: state.error,
					}

				case 'SET_data':
					return {
						isValidating: false,
						data: action.data,
					}

				case 'ERROR':
					return {
						isValidating: false,
						error: action.error,
						data: state.data,
					}

				case 'CANCEL':
					const promise = state[kPromise]
					if (promise && promise.cancel) {
						promise.cancel()
					}
					return {
						isValidating: false,
						data: state.data,
					}

				case 'RESET':
					return {
						isValidating: false,
						data: state.data,
					}

				default:
					throw new Error(
						`Unexpected action received by reducer: ${action.type}`,
					)
			}
		},
		{
			status: 'idle',
		},
	)
	useEffect(() => {
		if (asyncArgs) {
			let canceled = false
			const promise = Promise.resolve(fn(...asyncArgs))
			promise
				.then((data) => {
					if (!canceled) {
						dispatch({ type: 'SET_data', data })
					}
				})
				.catch((error) => {
					if (!canceled) {
						dispatch({ type: 'ERROR', error })
					}
				})

			return () => {
				if (promise.cancel) {
					promise.cancel()
				}
				canceled = true
			}
		}
	}, [asyncArgs])
	if (deps) {
		useEffect(() => {
			if (state.status !== 'inprogress') {
				dispatch({ type: 'FETCH', args: deps })
				return () => dispatch({ type: 'CANCEL' })
			}
		}, deps)
	}

	return [
		state,
		{
			fetch: (...args) => dispatch({ type: 'FETCH', args }),
			forceFetch: (...args) => dispatch({ type: 'FORCE_FETCH', args }),
			forceSet: (data) => dispatch({ type: 'SET_data', data }),
			reset: () => dispatch({ type: 'RESET' }),
			cancel: () => dispatch({ type: 'CANCEL' }),
		},
	]
}
