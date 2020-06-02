import $ from 'jquery'
import { useMemo } from 'htm/preact/standalone.module.js'

import { Users } from './users.js'
import imgApple from '../images/apples.jpg'
import imgSteak from '../images/steak.jpg'
import imgAsparagus from '../images/asparagus.jpg'
import imgNeilson4L from '../images/neilson-4l-2p.jpg'
import imgEggsDozen from '../images/eggs-1-dozen.jpg'
import imgHeinzKetchup from '../images/heinz-ketchup.jpg'
import imgBakingSoda from '../images/arm-baking-soda.jpg'
import imgCategoryFruits from '../images/category-fruits.jpg'
import imgCategoryVegetables from '../images/category-vegetables.jpg'
import imgCategoryMeat from '../images/category-meat.jpg'
import imgCategoryPantry from '../images/category-pantry.jpg'
import imgCategoryDairy from '../images/category-dairy.jpg'

const ProductCategories = Object.freeze({
	Fruits: { label: 'Fruits', image: imgCategoryFruits },
	Vegetables: { label: 'Vegetables', image: imgCategoryVegetables },
	Meat: { label: 'Meat', image: imgCategoryMeat },
	Pantry: { label: 'Pantry', image: imgCategoryPantry },
	Dairy: { label: 'Dairy', image: imgCategoryDairy },
})

const productCollection = [
	{
		id: 0,
		name: 'Apples',
		category: ProductCategories.Fruits,
		imageURL: imgApple,
		price: {
			amount: 0.99,
			type: 'apple',
		},
	},
	{
		id: 1,
		name: 'AAA Steak',
		keywords: ['beef'],
		category: ProductCategories.Meat,
		imageURL: imgSteak,
		price: {
			amount: 10.99,
			type: 'kg',
		},
	},
	{
		id: 2,
		name: 'Asparagus',
		category: ProductCategories.Vegetables,
		imageURL: imgAsparagus,
		price: {
			amount: 4.99,
			type: 'g',
		},
	},
	{
		id: 3,
		name: 'Neilson 2% (4L)',
		keywords: ['milk'],
		category: ProductCategories.Dairy,
		imageURL: imgNeilson4L,
		price: {
			amount: 3.99,
			type: 'bag',
		},
	},
	{
		id: 4,
		name: 'Eggs (1 dozen)',
		category: ProductCategories.Dairy,
		imageURL: imgEggsDozen,
		price: {
			amount: 7.99,
			type: 'dozen',
		},
	},
	{
		id: 5,
		name: 'Heinz Ketchup (397g)',
		keywords: ['condiments'],
		category: ProductCategories.Pantry,
		imageURL: imgHeinzKetchup,
		price: {
			amount: 1.99,
			type: 'bottle',
		},
	},
	{
		id: 6,
		name: 'Arm & Hammer - Baking Soda (454g)',
		category: ProductCategories.Pantry,
		imageURL: imgBakingSoda,
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
					if (
						currentUser.diet[product.category.label] !== false &&
						results.push(product) === numProducts
					) {
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
			data: Object.values(ProductCategories),
		}
	},

	useSearch({ query }) {
		const { data: currentUser } = Users.useCurrentUser()
		const pttn = new RegExp(query, 'i')

		let totalHidden = 0
		const results = productCollection.filter((product) => {
			const match =
				product.name.match(pttn) ||
				product.category.label.match(pttn) ||
				(product.keywords && product.keywords.find((key) => key.match(pttn)))
			const allowed = currentUser.diet[product.category.label] !== false

			if (match && !allowed) {
				totalHidden++
			}
			return match && allowed
		})

		return {
			data: {
				results,
				totalDocs: productCollection.length,
				totalHidden,
			},
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
