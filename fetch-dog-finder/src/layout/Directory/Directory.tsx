import clsx from 'clsx'
import { BiHeart, BiX } from 'react-icons/bi'
import { useEffect, useState } from 'react'
import { fetchBreeds, retrieveDogs, fetchMatch, fetchDogs } from '@utils/services'
import { Button } from '@components/Button'
import { Header } from '@components/Header'
import { Form } from '@components/Form'
import { Pagination } from '@components/Pagination'
import {
	Field,
	type FieldChangeHandler,
	type FieldSelectHandler,
} from '@components/Field'


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

	const [breeds, setBreeds] = useState<string[]>([])
	const [dogs, setDogs] = useState<Dog[]>([])
	// const [favoriteDogs, setFavoriteDogs] = useState<string[]>([])

	const [sortOrder, setSortOrder] = useState<'asc' | 'desc'>('asc')
	const [filter, setFilter] = useState<FilterValues>({})

	const [isSidebarOpen, setSidebarOpen] = useState<boolean>(false)
	const [page, setPage] = useState(1)
	const [totalPages, setTotalPages] = useState<number>(0)


	const changePageTo = (target: number) => setPage(target)
	const handleSidebar = () => setSidebarOpen(state => !state)

	const resetBreeds = () => setFilter(state => ({ ...state, breeds: [] }))
	const resetFilters = () => setFilter({})

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
			const prevState = state

			if (Object.hasOwn(state, 'breeds')) {
				const { breeds: prevBreeds } = state
				const breedSet = new Set(prevBreeds)

				if (checked)
					breedSet.add(value)
				else
					breedSet.delete(value)

				if (breedSet.size) {
					entry = { breeds: [...breedSet] }
				} else {
					delete prevState.breeds
					entry = {}
				}
			}

			return { ...prevState, ...entry }
		})
	}

	const updateAge: FieldChangeHandler = (event) => {
		const { target: { name, value } } = event

		setFilter(state => {
			const entry = { [`${name}`]: value }
			return { ...state, ...entry }
		})
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
					total,
				} = await fetchDogs(query)

				const list = await retrieveDogs(ids),
					maxPages = Math.ceil(total/25)

				setDogs(list)
				setTotalPages(maxPages)
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

	const sidebarClasses = clsx({
		overlay: isSidebarOpen,
	})


	return (
		<>
			<Header handleSidebar={ toggleSidebar } />

			<aside className={ sidebarClasses }>
				<nav className="sidebar">
					<header className="sidebar__header">
						<h2>Filter & Sort</h2>
						{ Object.values(filter).length > 0 && (
							<Button onClick={ resetFilters } variant="text">
								Reset All
							</Button>
						) }
						<Button onClick={ handleSidebar } variant="icon">
							<BiX />
						</Button>
					</header>
					<Form id="search" role="search">
						{/* <div>
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
						</div> */}
						<h3>Filter By</h3>
						<div>
							<h4>Age</h4>
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
							<h4>Breed</h4>
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
					</Form>
				</nav>
			</aside>

			<main className="container">
				<hgroup className="heading">
					<h1 className="heading__title">
						{/* { filter.breeds?.length
							? filter.breeds.map((breed, i) => {
								const heading = `${ breed }s${ filter.breeds!.length - 1 !== i && ' · ' }`

								return (
									<Fragment key={ `${breed}-heading` }>{ heading }</Fragment>
								)
							})
							: 'All Dogs'
						} */}
						{ title }
					</h1>
					<span className="heading__count">({ total.items })</span>
				</hgroup>

				<section className="description">
					<p>Browse through our network of paw-fect dogs and favorite the ones that steal your heart. Use the <b>Filter & Sort</b> button above to narrow your search by breed, age, and location. Once you've built your list, click <b>Find Your Match</b>, and we'll pair you with your ideal furry companion.</p>
					<p>You deserve a best friend, and every good pup deserves a loving home.</p>
				</section>

				<section className="directory">
					<section>
						{ !dogs.length && (
							<p>Loading your future best friend..</p>
						) }
						{ dogs.map(({
							age,
							breed,
							id,
							img,
							name,
							zip_code,
						}) => {
							const isFavorite = !!favorites.length && favorites.includes(id)

							const heartClasses = clsx({
								'card__heart': true,
								'card--liked': isFavorite,
							})

							const Heart = isFavorite ? BiSolidHeart : BiHeart

							return (
								<article className="card" key={ id }>
									<figure
										className="card__wrapper"
										id={ id }
										// onClick={ event => console.log(event) }
										onClick={ handleFavorite }
									>
										<div className="card__favorite">
											<Heart className={ heartClasses } />
										</div>

										<img className="card__img" src={ img } />
										<figcaption className="card__caption">
											<div>
												<h3>{ name }</h3>
												<b>{ age } years old</b>
											</div>
											<div>
												<i>{ breed }</i><br />
												<i>{ zip_code }</i>
											</div>
										</figcaption>
									</figure>
								</article>
							)
						}) }
					</section>
				</section>
			</main>

			<footer className="footer">
				<div className="footer__wrapper">
					<Pagination
						current={ page }
						handleChangePage={ changePageTo }
						total={ total.pages }
					/>
				</div>
			</footer>
		</>
	)
}

Directory.displayName = 'Directory'
export { Directory }
