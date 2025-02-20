import clsx from 'clsx'
import { fetchBreeds, retrieveDogs, fetchMatch, fetchDogs } from '@utils/services'
import { BiRefresh, BiSlider, BiSolidBone, BiSolidDog, BiUndo, BiX } from 'react-icons/bi'
import { useEffect, useRef, useState } from 'react'
import { useUserContext } from '@providers/UserProvider'
import { Button } from '@components/Button'
import { Card } from '@components/Card'
import { Footer } from '@components/Footer'
import { Form } from '@components/Form'
import { Header } from '@components/Header'
import { Logo } from '@components/Logo'
import { Modal } from '@components/Modal'
import { Navbar } from '@components/Navbar'
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
	const dialogRef = useRef<HTMLDialogElement>(null)

	const { favorites, handleUser, match } = useUserContext()!

	const [breeds, setBreeds] = useState<string[]>([])
	const [dogs, setDogs] = useState<Dog[]>([])
	// const [favoriteDogs, setFavoriteDogs] = useState<string[]>([])

	const [sortOrder, setSortOrder] = useState<'asc' | 'desc'>('asc')
	const [filter, setFilter] = useState<FilterValues>({})

	const [isSidebarOpen, setSidebarOpen] = useState<boolean>(false)
	const [page, setPage] = useState(1)
	const [totalPages, setTotalPages] = useState<number>(0)


	const changePageTo = (target: number) => setPage(target)
	const toggleSidebar = (event: React.MouseEvent<HTMLElement, MouseEvent>) => {
		if (event.target === event.currentTarget)
			setSidebarOpen(state => !state)
	}

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

	const toggleModal = () => {
		const modal = dialogRef.current

		if (!modal)
			return
		else if (modal.open)
			modal.close()
		else
			modal.showModal()
	}

	const handleMatch = async () => {
		try {
			const { match: id } = await retrieveMatch(favorites)
			const [match] = await retrieveDogs([id])
			handleUser({ match })
		} catch (err) {
			console.log(err)
		}
	}

	const clearFavorites = () => {
		toggleModal()
		handleUser({ favorites: [], match: {} })
	}

	return (
		<>
			<Header className="navigation__header">
				<Logo />
				<Navbar handleModal={ toggleModal } handleSidebar={ toggleSidebar } />
			</Header>

			<Modal handleModal={ toggleModal } ref={ dialogRef }>
				<Modal.Header>
					Meet Your Paw-fect Match
				</Modal.Header>
				<Modal.Content>
					<Card
						{ ...match }
						disableLike
					/>
				</Modal.Content>
				<Modal.Footer>
					{ favorites.length > 1 && (
						<Button onClick={ handleMatch }>
							Refresh Match <BiRefresh />
						</Button>
					) }
					<Button onClick={ clearFavorites } variant="outline">
						Clear Favorites <BiUndo />
					</Button>
				</Modal.Footer>
			</Modal>

			<aside className={ sidebarClasses } onClick={ toggleSidebar }>
				<nav className="sidebar">
					<header className="sidebar__header">
						<h2>Filter & Sort</h2>
						{ Object.values(filter).length > 0 && (
							<Button onClick={ resetFilters } variant="text">
								Reset All
							</Button>
						) }
						<Button onClick={ toggleSidebar } variant="icon">
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

					<Footer className="sidebar__footer">
						<Button className="sidebar__button" onClick={ toggleSidebar }>
							View Dogs ({ total.items }) <BiSolidBone />
						</Button>
					</Footer>
				</nav>
			</aside>

			<main className="container">
				<hgroup className="heading">
					<h1 className="heading__title">{ title }</h1>
					<span className="heading__count">({ total.items })</span>
				</hgroup>

				<section className="description">
					<p>Browse through our network of paw-fect dogs and favorite the ones that steal your heart. Use the <b>Filter & Sort <BiSlider /></b> button above to narrow your search by breed, age, and location. Once you've built your list, click <b>Find Your Match <BiSolidDog /></b>, and we'll pair you with your ideal furry companion.</p>
					<p>You deserve a best friend, and every good pup deserves a loving home.</p>
				</section>

				<section className="directory">
					{ !dogs.length && <p>Loading your future best friend...</p> }
					{ dogs.map(dog => <Card { ...dog } key={ dog.id } />) }
				</section>
			</main>

			<Footer className="paginate">
				<Pagination
					current={ page }
					handleChangePage={ changePageTo }
					total={ total.pages }
				/>
			</Footer>
		</>
	)
}

Directory.displayName = 'Directory'
export { Directory }
