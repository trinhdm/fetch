import { capitalize } from '@utils/helpers'
import type { FilterParams, FilterValues, GeolocationValues, SortValues } from './Directory.types'
import type { Sort } from '@typings/shared'


const parseAges = (values?: string[]) => values?.map(value => {
	const ageRange = value.substring(
		value.indexOf('(') + 1,
		value.lastIndexOf(')')
	)
	const [ageMin, , ageMax] = ageRange.split('').map(age => parseInt(age))

	return {
		ageMin,
		...(ageMax && { ageMax }),
	}
})


export const getAgeRange = (values?: string[]) => {
	const ages = parseAges(values)
	let results = {}

	if (ages?.length) {
		const hasAge = (key: string) => ages.some(obj => key in obj)

		const ageMin = hasAge('ageMin') && Math.min(...ages.map(({ ageMin }) => ageMin))
		const ageMax = hasAge('ageMax') && Math.max(...ages.map(({ ageMax }) => ageMax!))

		results = {
			...(!Number.isNaN(ageMin) && { ageMin }),
			...(!Number.isNaN(ageMax) && { ageMax }),
		}
	}

	return results
}


export const getSortOrder = (values: SortValues) => {
	const { category, order } = values
	const orderBy = order!.substring(0, order.lastIndexOf('c') + 1)

	return `${category!}:${orderBy!}` as Sort
}


export const generateTitle = (filter: FilterValues & GeolocationValues) => {
	if (Object.values(filter).every(v => !v.length || (typeof v === 'string' && v.toLowerCase().includes('state'))))
		return 'All Dogs'

	const { ages, breeds, city, state } = filter
	const ageRange = getAgeRange(ages)
	const heading = []

	if (breeds?.length) {
		const filteredBreeds = breeds.map(breed => `${breed}s`).join(' + ')
		heading.push(filteredBreeds)
	}

	if (Object.hasOwn(ageRange, 'ageMin') || Object.hasOwn(ageRange, 'ageMax')) {
		const { ageMax, ageMin } = ageRange as FilterParams
		const ages = []

		if (typeof ageMin === 'number')
			ages.push(ageMin)

		if (typeof ageMax === 'number')
			ages.push(ageMax)

		if (ages.length) {
			const filteredAges = ages.length === 1
				? `${ages}+ years old`
				: `${ages.join(' - ')} years old`

			heading.push(filteredAges)
		}
	}

	if (city || (state && state.length === 2)) {
		const geolocation = []

		if (city)
			geolocation.push(capitalize(city))

		if (state.length === 2)
			geolocation.push(state)

		const filteredLocation = geolocation.join(', ')
		heading.push(`Located in ${filteredLocation}`)
	}

	return heading.join(' · ')
}
