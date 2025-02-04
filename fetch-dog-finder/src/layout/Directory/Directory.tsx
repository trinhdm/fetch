import { useEffect, useMemo, useState } from 'react'
import { useUserContext } from '@providers/UserProvider'
import { fetchBreeds, retrieveDogs, fetchMatch, fetchDogs } from '@utils/services'
import { Button } from '@components/Button'
import { Form } from '@components/Form'
import type { FieldGroup, FieldSelectHandler } from '@components/Field'


type NonNegative<T extends number> =
	number extends T
		? never
		: `${T}` extends `-${string}` | `${string}.${string}`
			? never
			: T

interface FilterValues {
	ageMax?: [NonNegative<number>]
	ageMin?: [NonNegative<number>]
	breeds?: string[]
}

const Directory = () => {
	const { name } = useUserContext()

	const [breeds, setBreeds] = useState<string[]>([])
	const [dogs, setDogs] = useState<Dog[]>([])
	// const [favoriteDogs, setFavoriteDogs] = useState<string[]>([])
	const [page, setPage] = useState(1)
	const [sortOrder, setSortOrder] = useState<'asc' | 'desc'>('asc')
	const [filter, setFilter] = useState<FilterValues>({
		breeds: [],
	})

	const resetBreeds = () => setFilter(state => ({ ...state, breeds: [] }))

	const updateBreeds: FieldSelectHandler = (event) => {
		const { target, type } = event

		let checked,
			innerText,
			value

		switch (type) {
			case 'change':
				;({ checked, value } = target as HTMLInputElement)
				break
			case 'click':
			default:
				;({ innerText } = target as HTMLElement)
				checked = false
				value = innerText
				break
		}

		let entry = { breeds: [value] }

		setFilter(state => {
			const { breeds: prevBreeds } = state
			const breedSet = new Set(prevBreeds)

			if (checked)
				breedSet.add(value)
			else
				breedSet.delete(value)

			entry = { breeds: [...breedSet] }

			return { ...state, ...entry }
		})
	}


	const changePage = (num: number) => {
		setPage(state => (state += num))
	}

	useEffect(() => {
		const fetchData = async () => {
			const result = await fetchBreeds()
			setBreeds(result)
		}

		fetchData()
	}, [])

	useEffect(() => {
		const fetchDogIds = async () => {
			// const [ageMin, ageMax] = filter.age

			const query = {
				// ageMax,
				// ageMin,
				// breeds: ['Boxer', 'Chow', 'Pug'],
				...filter,
				sort: `breed:${sortOrder}`,
				size: 25,
				from: (page - 1) * 25,
			}

			try {
				const {
					resultIds: ids,
					// total,
				} = await fetchDogs(query)

				const list = await retrieveDogs(ids)
				setDogs(list)
			} catch (error) {
				console.log(error)
			}
		}

		fetchDogIds()
	}, [filter, page, sortOrder])

	// useEffect(() => {
	// 	const fetchData = async () => {
	// 		const breeds = await retrieveDogs(dogs)
	// 		console.log(breeds)
	// 		// setDogs(breeds)
	// 	}
	// 	fetchData()
	// }, [dogs])

	// useEffect(() => {
	// 	const matchData = async () => {
	// 		const result = await fetchMatch(dogs)
	// 		console.log(result)
	// 	}

	// 	matchData()
	// }, [dogs])

	return (
		<div className="container">
			<header>
				<div>
					<h1>Fetch</h1>
				</div>
				<div className="settings">
					Welcome, { name }
					<ul>
						<li>Favorites</li>
						<li>Logout</li>
					</ul>
					<Button>Find Your Match</Button>
				</div>
			</header>
			<div className="directory">
				<aside>
					<Form id="search" role="search">
						<div>
							<h2>Sort by</h2>
							<Field
								name="sort"
								onChange={ (event) => console.log(event.target.value) }
								options={ ['age', 'name', 'breed'] }
								type="radio"
							/>
							<Field
								name="sortOrder"
								onChange={ (event) => console.log(event.target.value) }
								options={ ['asc', 'desc'] }
								type="radio"
							/>
						</div>
						<div>
							<h2>Filter By</h2>
							<div>
								<h3>Age</h3>
								<div>
									<Field
										name="ageMin"
										min={ 0 }
										onChange={ (event) => console.log(event.target.value) }
										placeholder="Min"
										type="number"
									/>
									<Field
										name="ageMax"
										min={ 0 }
										onChange={ (event) => console.log(event.target.value) }
										placeholder="Max"
										type="number"
									/>
								</div>
							</div>
							<div>
								<h3>Breed</h3>
								<Field
									multiple
									name="breed"
									placeholder="Search Breeds"
									onReset={ resetBreeds }
									onSelect={ updateBreeds }
									options={ breeds }
									selected={ filter.breeds }
									type="search"
								/>
							</div>
						</div>
					</Form>
				</aside>

				<section>
					{ dogs.map(({
						age,
						breed,
						id,
						img,
						name,
						zip_code,
					}) => {
						return (
							<div>
								<img src={ img } />
								<h3>{ name }</h3>
								<h4>{ breed }</h4>
								<b>{ age }</b> | <i>{ zip_code }</i>
							</div>
						)
					}) }
				</div>
			</div>
		</div>
	)
}

Directory.displayName = 'Directory'
export { Directory }
