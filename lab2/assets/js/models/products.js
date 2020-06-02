import { useMemo } from 'https://unpkg.com/htm/preact/standalone.module.js'

import { Users } from './users.js'

const ProductCategories = Object.freeze({
	Fruits: 'Fruits',
	Vegetables: 'Vegetables',
	Meat: 'Meat',
	Pantry: 'Pantry',
})

const productCollection = [
	{
		id: 0,
		name: 'Apples',
		category: ProductCategories.Fruits,
		imageURL: '/lab2/assets/images/apples.jpg',
		price: {
			amount: 0.99,
			type: 'unit',
		},
	},
	{
		id: 1,
		name: 'AAA Steak',
		category: ProductCategories.Meat,
		imageURL: '/lab2/assets/images/steak.jpg',
		price: {
			amount: 10.99,
			type: 'kg',
		},
	},
	{
		id: 2,
		name: 'Asparagus',
		category: ProductCategories.Vegetables,
		imageURL: '/lab2/assets/images/asparagus.jpg',
		price: {
			amount: 4.99,
			type: 'g',
		},
	},
]

// Let's preload the images for perf
productCollection.forEach(({ imageURL }) => {
	$(`<img src="${imageURL}" class="d-none" />`).appendTo(document.body)
})

export const Products = {
	usePreviewProducts({ numProducts }) {
		const { data: currentUser } = Users.useCurrentUser()
		return useMemo(() => {
			if (currentUser) {
				const results = []
				for (const product of productCollection) {
					if (currentUser.diet[product.category] !== false) {
						results.push(product)
					}
				}
				return {
					data: results,
				}
			}
			return {
				data: productCollection.slice(0, numProducts),
			}
		}, [currentUser.diet])
	},

	useProductCategories() {
		return {
			data: Object.keys(ProductCategories),
		}
	},

	findById(id) {
		return productCollection.find(product => product.id === id)
	},

	useFindById(id) {
		return useMemo(() => ({
			data: this.findById(id),
		}), [id])
	},
}
