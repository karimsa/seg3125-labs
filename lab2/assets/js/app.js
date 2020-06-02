import 'https://unpkg.com/jquery'
import 'https://unpkg.com/bootstrap/dist/js/bootstrap.min.js'
import { html, render, useRef, useState, useEffect } from 'https://unpkg.com/htm/preact/standalone.module.js'

import { Users } from './models/users.js'
import { Products } from './models/products.js'
import { Modal, useModal } from './modal.js'
import { StoreProvider } from './store.js'

function BestSellersList({ numProducts }) {
	const { data: products } = Products.usePreviewProducts({
		numProducts,
	})
	const [currentProductIndex, setCurrentProductIndex] = useState(0)
	useEffect(() => {
		setCurrentProductIndex(0)
	}, [products])
	useEffect(() => {
		const timer = setInterval(() => {
			setCurrentProductIndex(i => i === products.length - 1 ? 0 : ++i)
		}, 3e3)
		return () => clearInterval(timer)
	}, [])

	const currentProduct = products[currentProductIndex]

	return html`
		<p>Best sellers</p>

		<div className="card py-5" style="
			background-image: url(${currentProduct.imageURL});
			background-size: cover;
			background-position: center center;
		">
			<div className="my-5 py-4" />
		</div>
		<div className="d-flex align-items-center justify-content-between w-100 px-2">
			<p className="small font-weight-bold text-right mt-2 mb-0">${currentProduct.name} / $${currentProduct.price.amount} per ${currentProduct.price.type}</p>
			<div>
				${[...new Array(numProducts)].map((_, index) => html`
					<span
						className="rounded-circle ml-1 d-inline-block ${currentProductIndex === index ? 'bg-dark' : 'border border-dark'}"
						onClick=${() => setCurrentProductIndex(index)}
						style="
							width: .5rem;
							height: .5rem;
							cursor: pointer;
						"
					/>
				`)}
			</div>
		</div>
	`
}

function CategoryGallery() {
	const { data: categories } = Products.useProductCategories()

	return html`
		<p>Explore categories</p>

		<div class="row">
			${categories.map(category => html`
				<div class="col-6 clickable">
					<div className="card" style="
						background-image: url(/lab2/assets/images/category-${category.toLowerCase()}.jpg);
						background-size: cover;
						background-position: center center;
					">
						<div className="card-body py-5 my-4"></div>
					</div>
					<p className="small font-weight-bold">${category}</p>
				</div>
			`)}
		</div>
	`
}

function ShoppingCartMenu() {
	const { data: currentUser } = Users.useCurrentUser()

	return html`
		<li className="nav-item dropdown">
			<a
				href="#cart"
				role="button"
				className="nav-link ${currentUser.activeCart.length > 0 ? 'text-success' : ''}"
				data-toggle="dropdown"
			>
				<i className="fas fa-shopping-cart" />
				<span className="ml-2">Your Cart (${currentUser.activeCart.length})</span>
			</a>

			<div className="dropdown-menu dropdown-menu-right" id="cart">
				<li className="text-muted px-3 text-center">Your cart is empty.</li>
			</div>
		</li>
	`
}

function App() {
	const { data: currentUser, mutate: updateUser } = Users.useCurrentUser()
	const { data: categories } = Products.useProductCategories()
	const { data: bestSellers } = Products.usePreviewProducts({
		numProducts: 3,
	})

	const [settingsRef, { openModal: openSettingsModal }] = useModal()

	const browseDropdownRef = useRef()
	useEffect(() => {
		return () => {
			$(browseDropdownRef.current).dropdown('hide')
		}
	})

	return html`
		<nav className="navbar navbar-expand-lg navbar-light bg-light py-4">
			<div className="container">
				<a href="/lab2" className="navbar-brand">Grocer</a>

				<ul className="navbar-nav nav">
					<${ShoppingCartMenu} />

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
						${categories.map(category => html`
							<div className="form-check">
								<input
									className="form-check-input"
									type="checkbox"
									checked=${currentUser.diet[category] !== false}
									onChange=${evt => updateUser({
										...currentUser,
										diet: {
											...currentUser.diet,
											[category]: evt.target.checked,
										},
									})}
								/>
								<label className="form-check-label">
									${category}
								</label>
							</div>
						`)}
					</div>
				</div>
			</form>
		</${Modal}>

		<div className="container">
			<div className="row py-4">
				<form className="col" onSubmit=${evt => {
					evt.preventDefault()
				}}>
					<div className="form-group row">
						<div className="col">
							<input
								type="text"
								placeholder="Search for fruits, vegetables, and meat"
								className="form-control-lg form-control rounded-lg"
							/>
						</div>
					</div>

					<button type="submit" className="d-none" />
				</form>
			</div>

			${bestSellers.length > 0 && html`
				<div className="row pb-4 mb-5">
					<div className="col">
						<${BestSellersList} numProducts=${3} />
					</div>
				</div>
			`}

			<div className="row pb-4 mb-5">
				<div className="col">
					<${CategoryGallery} />
				</div>
			</div>
		</div>

		<footer className="container py-4">
			<div className="row">
				<div className="col text-center">
					<p className="mb-0">Website designed & built by <a href="https://alibhai.co" rel="noreferrer noopener" target="_blank">Karim Alibhai</a></p>
					<p>Built using Bootstrap, Preact, htm, and lots of other great technologies.</p>
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
