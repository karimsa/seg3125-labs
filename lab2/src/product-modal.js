import {
	html,
	useEffect,
	useState,
} from 'htm/preact/standalone.module.js'

import { Modal, useModal } from './modal.js'
import { Users } from './models/users.js'
import { rounded } from './models/products.js'

function pluralize(num, unit) {
	if (num === 1) {
		return unit
	}
	if (!unit.endsWith('s')) {
		return unit + 's'
	}
	return unit
}

function localize(unit, name) {
	switch (unit) {
		case 'g':
			return 'gram'
		case 'kg':
			return 'kilogram'
		case 'unit':
			return name.toLowerCase()
		default:
			return unit
	}
}

export function ProductQuantityForm({ product }) {
	const { data: currentUser, mutate: updateUser } = Users.useCurrentUser()
	const cartEntry = currentUser.activeCart.find(
		(entry) => entry.productID === product.id,
	)
	const [quantity, setQuantity] = useState(() => {
		return cartEntry ? cartEntry.quantity : 0
	})

	const cartItem = currentUser.activeCart.find(
		({ productID }) => productID === product.id,
	)

	function updateQuantity(quantity) {
		if (quantity > 0) {
			updateUser({
				...currentUser,
				activeCart: [
					...currentUser.activeCart.filter(
						(entry) => entry.productID !== cartEntry.productID,
					),
					{
						productID: cartEntry.productID,
						quantity,
					},
				],
			})
		} else {
			updateUser({
				...currentUser,
				activeCart: currentUser.activeCart.filter(
					(entry) => entry.productID !== cartEntry.productID,
				),
			})
		}
	}

	return html`
		<form
			className="row"
			onSubmit=${(evt) => {
				evt.preventDefault()
				updateUser({
					...currentUser,
					activeCart: [
						...currentUser.activeCart,
						{
							productID: product.id,
							quantity,
						},
					],
				})
			}}
		>
			<div className="col">
				<input
					type="number"
					className="form-control"
					min="0"
					max="100"
					step="1"
					value=${quantity}
					onChange=${(evt) => setQuantity(evt.target.value)}
				/>
			</div>
			<div className="col-auto">
				${cartItem
					? html`
							<div className="btn-group">
								<button
									type="button"
									className="btn btn-primary"
									onClick=${() => updateQuantity(quantity)}
								>
									Update cart
								</button>
								<button
									type="button"
									className="btn btn-danger"
									onClick=${() => updateQuantity(0)}
								>
									Remove from cart
								</button>
							</div>
					  `
					: html`<button
							type="submit"
							className="btn btn-success"
							disabled=${quantity < 1}
					  >
							Add to cart
					  </button>`}
			</div>
		</form>
		${cartEntry &&
		html`<p className="font-weight-normal small mt-2 mb-0">
			There is currently${' '}
			${cartEntry.quantity}${product.price.type === 'g' || product.price.type === 'kg' ? '' : ' '}${pluralize(
				cartEntry.quantity,
				product.price.type,
			)}${' '}
			of this item in your cart for a total of${' '}
			$${rounded(cartEntry.quantity * product.price.amount)}.
		</p>`}
	`
}

export function ProductModal({ product, modalRef }) {
	return html`
			<${Modal} className="p-0 d-flex flex-row" size="xl" modalRef=${modalRef}>
				<img
					src=${product.imageURL}
					className="w-50"
				/>
				<div className="w-50 p-4 d-flex align-items-center">
					<div className="row">
						<div className="col">
							<h5>${product.name}</h5>
							<p>${product.price.amount} per ${localize(product.price.type, product.name)}</p>

							<${ProductQuantityForm} product=${product} />
						</div>
					</div>
				</div>
			</${Modal}>
		`
}

export function useProductModal() {
	const [ref, { openModal, closeModal }] = useModal()
	const [activeProduct, setActiveProduct] = useState()
	useEffect(() => {
		if (activeProduct) {
			openModal()
		} else {
			closeModal()
		}
	}, [activeProduct])
	useEffect(() => {
		if (ref.current) {
			$(ref.current).on('hidden.bs.modal', () => {
				setActiveProduct()
			})
		}
	}, [ref.current])

	return [
		{
			openProductModal: setActiveProduct,
			closeProductModal: () => setActiveProduct(),
		},
		activeProduct &&
			html`<${ProductModal} modalRef=${ref} product=${activeProduct} />`,
	]
}
