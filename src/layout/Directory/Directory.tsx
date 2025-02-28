import { useEffect, useRef, useState } from 'react'
import { BiSlider, BiSolidDog } from 'react-icons/bi'
import { capitalize, getAgeRange } from '@utils/helpers'
import { debounce } from '@utils/children'
import { usePageContext } from '@providers/PageProvider'
import { Card } from '@components/Card'
import type {
	FilterParams,
	FilterValues,
	GeolocationValues,
} from '@typings/shared'

const Directory = () => {
	const {
		dogs,
		filter,
		geolocation,
		total,
		view,
	} = usePageContext()!

	const [title, setTitle] = useState<string>('All Dogs')
	const debounceRef = useRef<NodeJS.Timeout>(null)

	const generateTitle = (filter: FilterValues & GeolocationValues) => {
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

	useEffect(() => {
		debounce(() => {
			const heading = generateTitle({ ...filter, ...geolocation })
			setTitle(heading)
		}, debounceRef)
	}, [filter, geolocation])

	return (
		<>
			<hgroup className="heading">
				<h1 className="heading__title">{ title }</h1>
				<span className="heading__count">({ total.items })</span>
			</hgroup>

			<section className="description">
				<p>Browse through our network of paw-fect dogs and favorite the ones that steal your heart. Use the <b>Filter & Sort <BiSlider /></b> button above to narrow your search by breed, age, and location. Once you've built your list, click <b>Find Your Match <BiSolidDog /></b>, and we'll pair you with your ideal furry companion.</p>
				<p>You deserve a best friend, and every good pup deserves a loving home.</p>
			</section>

			<section className="directory">
				{ !dogs?.length && (
					<p>
						{ dogs === null
							? <i>Fetching the best pups for you... Hang tight while we round up some furry friends!</i>
							: <i>Looks like we couldn’t find a match! Try widening your search criteria — your perfect pup might be just a few clicks away.</i>
						}
					</p>
				) }
				{ dogs?.map(dog => (
					<Card
						{ ...dog }
						key={ dog.id }
						variant={ view.layout === 'Grid' ? 'vertical' : 'horizontal' }
					/>
				)) }
			</section>
		</>
	)
}

Directory.displayName = 'Directory'
export { Directory }
