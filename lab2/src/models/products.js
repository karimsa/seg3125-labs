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
import imgMustard from '../images/mustard.jpg'
import imgOranges from '../images/oranges.jpg'
import imgEggplant from '../images/eggplant.jpg'
import imgChicken from '../images/chicken.jpg'
import imgCategoryBakery from '../images/category-bakery.jpg'
import imgChocLavaCake from '../images/chocolate-lava-cake.jpg'
import imgDempstersWhiteBread from '../images/dempsters-white-bread.png'
import imgDempstersWhiteBreadGlutenFree from '../images/dempsters-white-bread-gluten-free.jpg'

const ProductCategories = Object.freeze({
	Fruits: { label: 'Fruits', image: imgCategoryFruits },
	Vegetables: { label: 'Vegetables', image: imgCategoryVegetables },
	Meat: { label: 'Meat', image: imgCategoryMeat },
	Pantry: { label: 'Pantry', image: imgCategoryPantry },
	Dairy: { label: 'Dairy', image: imgCategoryDairy },
	Bakery: { label: 'Bakery', image: imgCategoryBakery },
})

const productCollection = [
	{
		id: null,
		name: 'Apples',
		category: ProductCategories.Fruits,
		imageURL: imgApple,
		price: {
			amount: 0.99,
			type: 'apple',
		},
	},
	{
		id: null,
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
		id: null,
		name: 'Asparagus',
		category: ProductCategories.Vegetables,
		imageURL: imgAsparagus,
		price: {
			amount: 4.99,
			type: 'g',
		},
	},
	{
		id: null,
		name: 'Neilson 2% (4L)',
		keywords: ['milk'],
		category: ProductCategories.Dairy,
		imageURL: imgNeilson4L,
		imageType: 'height',
		price: {
			amount: 3.99,
			type: 'bag',
		},
	},
	{
		id: null,
		name: 'Eggs (1 dozen)',
		category: ProductCategories.Dairy,
		imageURL: imgEggsDozen,
		price: {
			amount: 7.99,
			type: 'dozen',
		},
	},
	{
		id: null,
		name: 'Heinz Ketchup (397g)',
		keywords: ['condiments'],
		category: ProductCategories.Pantry,
		imageURL: imgHeinzKetchup,
		imageType: 'height',
		price: {
			amount: 1.99,
			type: 'bottle',
		},
	},
	{
		id: null,
		name: 'Arm & Hammer - Baking Soda (454g)',
		category: ProductCategories.Pantry,
		imageURL: imgBakingSoda,
		imageType: 'height',
		price: {
			amount: 1.99,
			type: 'box',
		},
	},
	{
		id: null,
		name: 'Mustard',
		keywords: ['condiments'],
		category: ProductCategories.Pantry,
		imageURL: imgMustard,
		imageType: 'height',
		price: {
			amount: 1.99,
			type: 'bottle',
		},
	},
	{
		id: null,
		name: 'Oranges',
		category: ProductCategories.Fruits,
		imageURL: imgOranges,
		price: {
			amount: 3.99,
			type: 'box',
		},
	},
	{
		id: null,
		name: 'Eggplants',
		category: ProductCategories.Vegetables,
		imageURL: imgEggplant,
		price: {
			amount: 3.99,
			type: 'box',
		},
	},
	{
		id: null,
		name: 'Chicken',
		category: ProductCategories.Meat,
		imageURL: imgChicken,
		price: {
			amount: 10.99,
			type: 'tray',
		},
	},
	{
		id: null,
		name: 'Chocolate Lava Cake',
		category: ProductCategories.Bakery,
		imageURL: imgChocLavaCake,
		price: {
			amount: 19.99,
			type: 'each',
		},
		hasGluten: true,
	},
	{
		id: null,
		name: 'Dempsters White Bread',
		category: ProductCategories.Bakery,
		imageURL: imgDempstersWhiteBread,
		price: {
			amount: 2.99,
			type: 'loaf',
		},
		hasGluten: true,
	},
	{
		id: null,
		name: 'Dempsters White Bread (Gluten free)',
		category: ProductCategories.Bakery,
		imageURL: imgDempstersWhiteBreadGlutenFree,
		price: {
			amount: 3.99,
			type: 'loaf',
		},
	},
].map((product, index) => {
	// AutoId
	product.id = index
	return product
})

// Let's preload the images for perf
productCollection.forEach(({ imageURL }) => {
	$(`<img src="${imageURL}" class="d-none" />`).appendTo(document.body)
})

export function rounded(num) {
	num = Math.round(num * 1e2) / 1e2
	return num.toFixed(2)
}

export const SortFunctions = {
	'price-low-to-high': {
		label: 'Price (low to high)',
		sort: (prodA, prodB) => prodA.price.amount - prodB.price.amount,
	},
	'price-high-to-low': {
		label: 'Price (high to low)',
		sort: (prodA, prodB) => prodB.price.amount - prodA.price.amount,
	},
}

export const DietaryRestrictions = {
	glutenFree: {
		label: 'Gluten free',
		keep: product => !product.hasGluten,
		hiddenCategories: new Set(),
	},
	vegetarian: {
		label: 'Vegetarian (hide meat)',
		keep: product => product.category !== ProductCategories.Meat,
		hiddenCategories: new Set([
			ProductCategories.Meat,
		]),
	},
	vegan: {
		label: 'Vegan (hide meat & dairy)',
		keep: product => product.category !== ProductCategories.Meat && product.category !== ProductCategories.Dairy,
		hiddenCategories: new Set([
			ProductCategories.Meat,
			ProductCategories.Dairy,
		]),
	},
}

function userCanEat(user, product) {
	for (const key in DietaryRestrictions) {
		if (DietaryRestrictions.hasOwnProperty(key) && user.diet[key] === true) {
			const { keep } = DietaryRestrictions[key]
			if (!keep(product)) {
				return false
			}
		}
	}
	return true
}

export const Products = {
	usePreviewProducts({ numProducts }) {
		const { data: currentUser } = Users.useCurrentUser()
		return useMemo(() => {
			if (currentUser) {
				const results = []
				for (const product of productCollection) {
					if (
						userCanEat(currentUser, product) &&
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
		const { data: currentUser } = Users.useCurrentUser()
		return useMemo(() => {
			return {
				data: Object.values(ProductCategories).filter(category => {
					for (const key in DietaryRestrictions) {
						// If the user's dietary restrictions forbids the entire category,
						// hide it in this hook
						if (
							DietaryRestrictions.hasOwnProperty(key) &&
							currentUser.diet[key] === true &&
							DietaryRestrictions[key].hiddenCategories.has(category)
						) {
							return false
						}
					}
					return true
				}),
			}
		}, [currentUser.diet])
	},

	useSearch({ query, order }) {
		const { data: currentUser } = Users.useCurrentUser()

		return useMemo(() => {
			const pttn = new RegExp(query, 'i')
			const sorter = (SortFunctions[order] || SortFunctions["price-high-to-low"]).sort
	
			let totalHidden = 0
			const results = productCollection.filter((product) => {
				const match =
					product.name.match(pttn) ||
					product.category.label.match(pttn) ||
					(product.keywords && product.keywords.find((key) => key.match(pttn)))
				const allowed = userCanEat(currentUser, product)
		
				if (match && !allowed) {
					totalHidden++
				}
				return match && allowed
			})
	
			return {
				data: {
					results: results.sort(sorter),
					totalDocs: productCollection.length,
					totalHidden,
				},
			}
		}, [query, order, currentUser.diet])
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
