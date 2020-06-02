import 'https://unpkg.com/jquery'
import 'https://unpkg.com/bootstrap/dist/js/bootstrap.min.js'
import {
	html,
	render,
	useRef,
	useState,
	useEffect,
	useMemo,
} from 'https://unpkg.com/htm/preact/standalone.module.js'

import { Users } from './models/users.js'
import { Products, rounded } from './models/products.js'
import { Modal, useModal } from './modal.js'
import { StoreProvider } from './store.js'
import { useProductModal, ProductQuantityForm } from './product-modal.js'
import { useQueryParam } from './hooks.js'

function BestSellersList({ numProducts, openProductModal }) {
	const { data: products } = Products.usePreviewProducts({
		numProducts,
	})
	numProducts = Math.min(numProducts, products.length)

	const [currentProductIndex, setCurrentProductIndex] = useState(0)
	useEffect(() => {
		setCurrentProductIndex(0)
	}, [products])
	useEffect(() => {
		const timer = setInterval(() => {
			setCurrentProductIndex((i) => (i === products.length - 1 ? 0 : ++i))
		}, 3e3)
		return () => clearInterval(timer)
	}, [currentProductIndex])

	const currentProduct = products[currentProductIndex]

	return html`
		<p>Best sellers</p>

		<div
			className="card py-5 clickable"
			onClick=${() => openProductModal(products[currentProductIndex])}
			style="
				background-image: url(${currentProduct.imageURL});
				background-size: cover;
				background-position: center center;
			"
		>
			<div className="my-5 py-4" />
		</div>
		<div
			className="d-flex align-items-center justify-content-between w-100 px-2"
		>
			<p className="small font-weight-bold text-right mt-2 mb-0">
				${currentProduct.name} / $${currentProduct.price.amount} per
				${currentProduct.price.type}
			</p>
			<div>
				${[...new Array(numProducts)].map(
					(_, index) => html`
						<span
							className="rounded-circle ml-1 d-inline-block ${currentProductIndex ===
							index
								? 'bg-dark'
								: 'border border-dark'}"
							onClick=${() => setCurrentProductIndex(index)}
							style="
							width: .5rem;
							height: .5rem;
							cursor: pointer;
						"
						/>
					`,
				)}
			</div>
		</div>
	`
}

function CategoryGallery() {
	const { data: categories } = Products.useProductCategories()

	return html`
		<p>Explore categories</p>

		<div class="row">
			${categories.map(
				(category) => html`
					<div class="col-6 clickable">
						<div
							className="card"
							style="
						background-image: url(/lab2/assets/images/category-${category.toLowerCase()}.jpg);
						background-size: cover;
						background-position: center center;
					"
						>
							<div className="card-body py-5 my-4"></div>
						</div>
						<p className="small font-weight-bold">${category}</p>
					</div>
				`,
			)}
		</div>
	`
}

function ShoppingCartMenuItem({ quantity, productID, openProductModal }) {
	const { data: product } = Products.useFindById(productID)

	return html`
		<li
			className="dropdown-item clickable"
			onClick=${(evt) => {
				evt.preventDefault()
				openProductModal(product)
			}}
		>
			<div className="d-flex">
				<div className="col pl-0">
					<span className="badge badge-pill badge-secondary mr-2">${quantity}</span>
					<span>${product.name}</span>
				</div>
				<div className="col text-right pr-0">
					<span className="ml-4">$${rounded(quantity * product.price.amount)}</span>
				</div>
			</div>
		</li>
	`
}

function ShoppingCartMenu({ openProductModal }) {
	const { data: currentUser } = Users.useCurrentUser()

	const summary = useMemo(() => {
		const price = currentUser.activeCart.reduce((total, entry) => {
			const product = Products.findById(entry.productID)
			return total + product.price.amount * entry.quantity
		}, 0)
		const tax = price * 0.13
		const total = price + tax

		return {
			price,
			tax,
			total,
		}
	}, [currentUser.activeCart])

	return html`
		<li className="nav-item dropdown">
			<a
				href="#cart"
				role="button"
				className="nav-link ${currentUser.activeCart.length > 0
					? 'text-success'
					: ''}"
				data-toggle="dropdown"
			>
				<i className="fas fa-shopping-cart" />
				<span className="ml-2"
					>Your Cart (${currentUser.activeCart.length})</span
				>
			</a>

			<div
				className="dropdown-menu dropdown-menu-right py-3 overflow-hidden"
				id="cart"
			>
				<h6 className="dropdown-header">Items</h6>

				${currentUser.activeCart.length === 0
					? html`<li className="text-muted px-3 text-center">
							Your cart is empty.
					  </li>`
					: currentUser.activeCart.map(
							(entry) => html`
								<${ShoppingCartMenuItem}
									quantity=${entry.quantity}
									productID=${entry.productID}
									openProductModal=${openProductModal}
								/>
							`,
					  )}

				<div className="dropdown-divider my-4" />

				<li className="d-flex justify-content-between px-4">
					<span>Subtotal</span>
					<span className="text-right">$${rounded(summary.price)}</span>
				</li>
				<li className="d-flex justify-content-between px-4">
					<span>Tax</span>
					<span className="text-right">$${rounded(summary.tax)}</span>
				</li>
				<li
					className="d-flex justify-content-between px-4 py-1 font-weight-bold"
				>
					<span>Total</span>
					<span className="text-right">$${rounded(summary.total)}</span>
				</li>
			</div>
		</li>
	`
}

function ProductSearchResult({ product }) {
	return html`
		<div className="card">
			<div className="card-body row">
				<div className="col-2">
					<img src="${product.imageURL}" className="img-fluid" />
				</div>
				<div className="col d-flex align-items-center">
					<div className="row w-100">
						<div className="col">
							<p className="mb-2">${product.name}</p>
							<p className="mb-0">
								$${rounded(product.price.amount)} per ${product.price.type}
							</p>
						</div>
						<div className="col text-right">
							<${ProductQuantityForm} product=${product} />
						</div>
					</div>
				</div>
			</div>
		</div>
	`
}

function App() {
	const { data: currentUser, mutate: updateUser } = Users.useCurrentUser()
	const { data: categories } = Products.useProductCategories()
	const { data: bestSellers } = Products.usePreviewProducts({
		numProducts: 3,
	})

	const [settingsRef, { openModal: openSettingsModal }] = useModal()
	const [{ openProductModal }, productModal] = useProductModal()
	const [query, setQuery] = useQueryParam('query')
	const { data: searchResults } = Products.useSearch({
		query,
	})

	const browseDropdownRef = useRef()
	useEffect(() => {
		return () => {
			$(browseDropdownRef.current).dropdown('hide')
		}
	}, [])

	return html`
		<nav className="navbar navbar-expand-lg navbar-light bg-light py-4">
			<div className="container">
				<a href="/lab2" className="navbar-brand">Grocer</a>

				<ul className="navbar-nav nav">
					<${ShoppingCartMenu} openProductModal=${openProductModal} />

					<button
						type="button"
						className="btn btn-primary ml-4"
						onClick=${() => openSettingsModal()}
					>
						Settings
					</button>
				</ul>
			</div>
		</nav>

		<${Modal} className="p-4" modalRef=${settingsRef}>
			<h4 className="text-center mb-4">User Preferences</h4>

			<form className="mx-auto">
				<div className="form-group">
					<label className="font-weight-bold">What items are you able to eat?</label>
					<div className="col">
						${categories.map(
							(category) => html`
								<div
									className="form-check cursor-pointer"
									onClick=${() =>
										updateUser({
											...currentUser,
											diet: {
												...currentUser.diet,
												[category]: !currentUser.diet[category],
											},
										})}
								>
									<input
										className="form-check-input"
										type="checkbox"
										checked=${currentUser.diet[category] !== false}
									/>
									<label className="form-check-label cursor-pointer">
										${category}
									</label>
								</div>
							`,
						)}
					</div>
				</div>
			</form>
		</${Modal}>

		${productModal}

		<div className="container">
			<div className="row py-4">
				<form className="col" onSubmit=${(evt) => {
					evt.preventDefault()
				}}>
					<div className="form-group row">
						<div className="col">
							<input
								type="text"
								placeholder="Search for fruits, vegetables, and meat"
								className="form-control-lg form-control rounded-lg"
								value=${query}
								onInput=${(evt) => setQuery(evt.target.value)}
							/>
						</div>
					</div>

					<button type="submit" className="d-none" />
				</form>
			</div>

			${
				query
					? html`
							<p className="font-weight-${searchResults.results.length === 0 ? 'bold' : 'normal'}">
								Found ${searchResults.results.length} of${' '}
								${searchResults.totalDocs} matches.
								${searchResults.totalHidden > 0 && html`<span className="text-muted ml-1">(${searchResults.totalHidden} hidden results to match your dietary preferences.)</span>`}
							</p>

							${searchResults.results.map(
								(product) =>
									html`<${ProductSearchResult} product=${product} />`,
							)}
					  `
					: html`
							${bestSellers.length > 0 &&
							html`
								<div className="row pb-4 mb-5">
									<div className="col">
										<${BestSellersList}
											numProducts=${3}
											openProductModal=${openProductModal}
										/>
									</div>
								</div>
							`}

							<div className="row pb-4 mb-5">
								<div className="col">
									<${CategoryGallery} openProductModal=${openProductModal} />
								</div>
							</div>
					  `
			}
		</div>

		<footer className="container py-4 mt-5">
			<div className="row">
				<div className="col text-center">
					<p className="mb-0">Website designed & built by <a href="https://alibhai.co" rel="noreferrer noopener" target="_blank">Karim Alibhai</a></p>
					<p className="mb-0">Built using Bootstrap, Preact, htm, and lots of other great technologies.</p>
				</div>
			</div>
		</footer>
	`
}

render(
	html`
		<${StoreProvider}>
			<${App} />
		</${StoreProvider}>
	`,
	document.getElementById('app'),
)
