import {
	html,
	useRef,
	useEffect,
} from 'https://unpkg.com/htm/preact/standalone.module.js'

export function useModal() {
	const ref = useRef()
	useEffect(() => {
		return () => $(ref.current).modal('hide')
	}, [])

	return [
		ref,
		{
			openModal: () => $(ref.current).modal('show'),
			closeModal: () => $(ref.current).modal('hide'),
		},
	]
}

export function Modal({ modalRef, size, center, className = '', children }) {
	return html`
		<div className="modal fade" tabindex="-1" role="dialog" ref=${modalRef}>
			<div
				className="modal-dialog ${center ? 'modal-dialog-centered' : ''} ${size
					? 'modal-' + size
					: ''}"
			>
				<div className="modal-content">
					<div className="modal-body ${className}">
						${children}
					</div>
				</div>
			</div>
		</div>
	`
}
