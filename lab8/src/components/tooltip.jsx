import $ from 'jquery'
import { useRef, useEffect } from 'react'

export function useTooltip() {
	const elmRef = useRef()
	useEffect(() => {
		if (elmRef.current) {
			$(elmRef.current).tooltip()
			return () => {
				$(elmRef.current).tooltip('hide')
			}
		}
	}, [elmRef])

	return {
		ref: elmRef,
	}
}
