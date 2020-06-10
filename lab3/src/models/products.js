import $ from 'jquery'
import { useMemo } from 'htm/preact/standalone.module.js'

import { Images } from './images.js'
import { Users } from './users.js'

const ProductCategories = Object.freeze({
	Fruits: { label: 'Fruits', image: Images.create('6iYs78oCiZA') },
	Vegetables: { label: 'Vegetables', image: Images.create('s285sDw5Ikc') },
	Meat: { label: 'Meat', image: Images.create('UC0HZdUitWY') },
	Seafood: { label: 'Seafood', image: Images.create('3cjbDO3QJJo') },
	Pantry: { label: 'Pantry', image: Images.create('_Bhh-RCciio') },
	Dairy: { label: 'Dairy', image: Images.create('_8bnn1GqX70') },
	Bakery: { label: 'Bakery', image: Images.create('R1ql7fk3I1Y') },
})

const productCollection = [
	{
		id: null,
		name: 'Apples',
		category: ProductCategories.Fruits,
		imageURL: Images.create('I58f47LRQYM'),
		price: {
			amount: 0.99,
			type: 'apple',
		},
	},
	{
		id: null,
		name: 'Royal gala apples (Organic)',
		keywords: ['organic'],
		category: ProductCategories.Fruits,
		imageURL: Images.create('HfRpk5l943s'),
		price: {
			amount: 1.49,
			type: 'apple',
		},
		isOrganic: true,
	},
	{
		id: null,
		name: 'AAA Steak',
		keywords: ['beef'],
		category: ProductCategories.Meat,
		imageURL: Images.create('J88no2vCrTs'),
		price: {
			amount: 10.99,
			type: 'kg',
		},
	},
	{
		id: null,
		name: 'Asparagus (Organic)',
		keywords: ['organic'],
		category: ProductCategories.Vegetables,
		imageURL: Images.create('ReXxkS1m1H0'),
		price: {
			amount: 4.99,
			type: 'g',
		},
		isOrganic: true,
	},
	{
		id: null,
		name: 'itambe milk (1L)',
		keywords: ['milk'],
		category: ProductCategories.Dairy,
		imageURL: Images.create('I58f47LRQYM'),
		imageType: 'height',
		price: {
			amount: 3.99,
			type: 'carton',
		},
		hasLactose: true,
		isOrganic: true,
	},
	{
		id: null,
		name: 'Eggs (1 dozen) (Organic)',
		keywords: ['organic'],
		category: ProductCategories.Dairy,
		imageURL: Images.create('Hj53USePB1E'),
		price: {
			amount: 7.99,
			type: 'dozen',
		},
		isOrganic: true,
		hasLactose: true,
	},
	{
		id: null,
		name: 'Heinz Ketchup (397g)',
		keywords: ['condiments'],
		category: ProductCategories.Pantry,
		imageURL: Images.create('b8jHMJOzso8'),
		imageType: 'height',
		price: {
			amount: 1.99,
			type: 'bottle',
		},
	},
	{
		id: null,
		name: 'Caraway seeds',
		category: ProductCategories.Pantry,
		imageURL: Images.create('eGWEnG-v0nA'),
		imageType: 'height',
		price: {
			amount: 0.99,
			type: 'lb',
		},
	}, 
	{
		id: null,
		name: 'Mustard',
		keywords: ['condiments'],
		category: ProductCategories.Pantry,
		imageURL: Images.create('LBPpGIKzXok'),
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
		imageURL: Images.create('MRnV51_Yqqk'),
		price: {
			amount: 3.99,
			type: 'box',
		},
	},
	{
		id: null,
		name: 'Eggplants (Organic)',
		keywords: ['organic'],
		category: ProductCategories.Vegetables,
		imageURL: Images.create('YF8cn3GDDC0'),
		price: {
			amount: 3.99,
			type: 'box',
		},
		isOrganic: true,
	},
	{
		id: null,
		name: '10pc Chicken Wings',
		category: ProductCategories.Meat,
		imageURL: Images.create('NbXjZomyNEM'),
		price: {
			amount: 10.99,
			type: '10pc',
		},
	},
	{
		id: null,
		name: 'Chocolate Lava Cake',
		keywords: ['dessert', 'treat', 'sweet'],
		category: ProductCategories.Bakery,
		imageURL: Images.create('W1TOhhlbQpw'),
		price: {
			amount: 19.99,
			type: 'each',
		},
		hasGluten: true,
		hasLactose: true,
	},
	{
		id: null,
		name: 'Fresh baked buns (gluten free)',
		keywords: ['bread', 'gluten-free'],
		category: ProductCategories.Bakery,
		imageURL: Images.create('IUk1S6n2s0o'),
		price: {
			amount: 2.99,
			type: 'roll',
		},
		hasGluten: false,
	},
	{
		id: null,
		name: 'Coffee cake',
		keywords: ['dessert', 'sweet', 'treat'],
		category: ProductCategories.Bakery,
		imageURL: Images.create('HDi8KXLm6kg'),
		price: {
			amount: 3.99,
			type: 'cake',
		},
	},
	{
		id: null,
		name: 'Kraft Dinner',
		keywords: ['mac', 'cheese'],
		category: ProductCategories.Pantry,
		imageURL: Images.create('tf2dNkqagyc'),
		price: {
			amount: 0.99,
			type: 'box',
		},
		hasGluten: true,
		hasLactose: true,
	},
	{
		id: null,
		name: 'Jumbo Shrimp',
		keywords: ['prawn'],
		category: ProductCategories.Seafood,
		imageURL: Images.create('3cjbDO3QJJo'),
		price: {
			amount: 19.99,
			type: 'kg',
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
	organic: {
		label: 'Only organic products',
		keep: product => product.isOrganic,
		hiddenCategories: new Set(),
	},
	lactose: {
		label: 'Lactose intolerant',
		keep: product => !product.hasLactose,
		hiddenCategories: new Set([
			ProductCategories.Dairy,
		]),
	},
	nofish: {
		label: 'Hide fish and seafood items',
		keep: product => product.category !== ProductCategories.Seafood,
		hiddenCategories: new Set([
			ProductCategories.Seafood,
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
