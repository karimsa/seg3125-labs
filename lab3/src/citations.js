import { html } from 'htm/preact/standalone.module.js'

import { Images } from './models/images.js'
import { useModal, Modal } from './modal.js'

function ImageCitation({ image }) {
	const { error, data: info } = Images.useData(image)
	if (error) {
		return html`<div className="alert alert-danger">Failed to load image source: ${String(error)}</div>`
	}
	return info && html`
		<li><a href=${info.link}>${info.name}</a> by ${info.author} from Unsplash</li>
	`
}

function CitationsModal({ modalRef }) {
	const { data: images } = Images.useCitedImages()

	return html`
		<${Modal} modalRef=${modalRef}>
			<h3 className="text-center">Works Cited</h3>

			<p className="mt-4 font-weight-bold">Images used:</p>
			<ul>
				${images.map(image => (
					html`<${ImageCitation} image=${image} />`
				))}
			</ul>

			<p className="mt-4 font-weight-bold">Tools used:</p>
			<ul>
				<li>Bootstrap (https://getbootstrap.com)</li>
				<li>Preact (https://preactjs.com/)</li>
				<li>htm (https://github.com/developit/htm)</li>
				<li>Parcel (https://parceljs.org/)</li>
			</ul>
		</${Modal}>
	`
}

export function useCitationsModal() {
	const [ref, controls] = useModal()
	return [{
		openCitationsModal: controls.openModal,
		closeCitationsModal: controls.closeModal,
	}, html`<${CitationsModal} modalRef=${ref} />`]
}
