import type { SortParams, SortValues } from '@typings/shared'


// strings

export const capitalize = (
	word: string
) => word.charAt(0).toUpperCase() + word.slice(1)

export const slugify = (
	str: string
) => str.toLowerCase()
		.replace(/^\s+|\s+$/g, '')
		.replace(/[^a-z0-9 -]/g, '')
		.replace(/\s+/g, '-')
		.replace(/-+/g, '-')


// haversine formula to calculate the distance between two lat/lng points

export const haversineDistance = (
	lat1: number,
	lon1: number,
	lat2: number,
	lon2: number
) => {
	const EARTH_RADIUS_MILES = 3958.8
	const toRadians = (degrees: number) => (degrees * Math.PI) / 180

	const dLat = toRadians(lat2 - lat1)
	const dLon = toRadians(lon2 - lon1)

	const a = Math.sin(dLat / 2) ** 2 +
		Math.cos(toRadians(lat1)) * Math.cos(toRadians(lat2)) * Math.sin(dLon / 2) ** 2

	const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a))

	return EARTH_RADIUS_MILES * c // Distance in miles
}


// parsing filter, sort

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

	return `${category!}:${orderBy!}` as SortParams
}
