import { useMemo } from 'https://unpkg.com/htm/preact/standalone.module.js'

import { Users } from './users.js'

const ProductCategories = Object.freeze({
	Fruits: 'Fruits',
	Vegetables: 'Vegetables',
	Meat: 'Meat',
	Pantry: 'Pantry',
	Dairy: 'Dairy',
})

const productCollection = [
	{
		id: 0,
		name: 'Apples',
		category: ProductCategories.Fruits,
		imageURL: '/lab2/assets/images/apples.jpg',
		price: {
			amount: 0.99,
			type: 'apple',
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
	{
		id: 3,
		name: 'Neilson 2% (4L)',
		category: ProductCategories.Dairy,
		imageURL: '/lab2/assets/images/neilson-4l-2p.jpg',
		price: {
			amount: 3.99,
			type: 'bag',
		},
	},
	{
		id: 4,
		name: 'Eggs (1 dozen)',
		category: ProductCategories.Dairy,
		imageURL: '/lab2/assets/images/eggs-1-dozen.jpg',
		price: {
			amount: 7.99,
			type: 'dozen',
		},
	},
	{
		id: 5,
		name: 'Heinz Ketchup (397g)',
		category: ProductCategories.Pantry,
		imageURL: '/lab2/assets/images/heinz-ketchup.jpg',
		price: {
			amount: 1.99,
			type: 'bottle',
		},
	},
	{
		id: 6,
		name: 'Arm & Hammer - Baking Soda (454g)',
		category: ProductCategories.Pantry,
		imageURL: '/lab2/assets/images/arm-baking-soda.jpg',
		price: {
			amount: 1.99,
			type: 'box',
		},
	},
]

// Let's preload the images for perf
productCollection.forEach(({ imageURL }) => {
	$(`<img src="${imageURL}" class="d-none" />`).appendTo(document.body)
})

export function rounded(num) {
	num = Math.round(num * 1e2) / 1e2
	return num.toFixed(2)
}

export const Products = {
	usePreviewProducts({ numProducts }) {
		const { data: currentUser } = Users.useCurrentUser()
		return useMemo(() => {
			if (currentUser) {
				const results = []
				for (const product of productCollection) {
					if (currentUser.diet[product.category] !== false && results.push(product) === numProducts) {
						break
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
		return productCollection.find((product) => product.id === id)
	},

	useFindById(id) {
		return useMemo(
			() => ({
				data: this.findById(id),
			}),
			[id],
		)
	},
}
