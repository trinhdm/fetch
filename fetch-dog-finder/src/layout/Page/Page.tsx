import axios from 'axios'
import clsx from 'clsx'
import { BiRefresh, BiSolidBone, BiUndo, BiX } from 'react-icons/bi'
import { useEffect, useRef, useState } from 'react'
import { useUserContext } from '@providers/UserProvider'
import { generateTitle, getAgeRange, getSortOrder } from '../Directory/helpers'
import { distances, usaLocations } from '@utils/locations'
import {
	fetchBreeds,
	fetchDogs,
	getZipCodesWithin,
	retrieveDogs,
	retrieveMatch,
} from '@utils/services'
import { PageProvider } from '@providers/PageProvider'
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
import type { Dog, DogParams, Location, LocationParams, Sort, SortField } from '@typings/shared'
import type {
	FilterParams,
	FilterValues,
	GeolocationValues,
	PageProps,
	SortValues,
	ViewValues,
} from './Page.types'

const Page = ({ children }: PageProps) => {
	const defaults: {
		filter: FilterValues
		geolocation: GeolocationValues
		sort: SortValues
		view: ViewValues
	} = {
		filter: {
			ages: [],
			breeds: [],
		},
		geolocation: {
			city: '',
			distance: '',
			state: '',
		},
		sort: {
			category: 'Breed',
			order: 'Ascending',
		},
		view: {
			layout: 'Grid',
			size: 24,
		},
	}

	const dialogRef = useRef<HTMLDialogElement>(null)

	const { favorites, handleUser, match } = useUserContext()!

	const [breeds, setBreeds] = useState<string[]>([])
	const [dogs, setDogs] = useState<null | Dog[]>(null)
	const [zipCodes, setZipCodes] = useState<null | Pick<Location, 'zip_code'>[]>(null)

	const [filter, setFilter] = useState<FilterValues>(defaults.filter)
	const [geolocation, setGeolocation] = useState(defaults.geolocation)
	const [sort, setSort] = useState<SortValues>(defaults.sort)
	const [view, setView] = useState(defaults.view)

	const [isSidebarOpen, setSidebarOpen] = useState<boolean>(false)
	const [page, setPage] = useState(1)
	const [title, setTitle] = useState<string>('All Dogs')
	const [total, setTotal] = useState({
		items: 0,
		pages: 1,
	})

	const changePageTo = (target: number) => {
		window.scrollTo({ behavior: 'smooth', top: 0 })
		setPage(target)
	}

	const toggleSidebar = (event: React.MouseEvent<HTMLElement, MouseEvent>) => {
		if (event.target === event.currentTarget)
			setSidebarOpen(state => !state)
	}

	const resetBreeds = () => setFilter(state => ({ ...state, breeds: [] }))
	const resetPagination = () => setPage(1)

	const resetSidebar = () => {
		resetPagination()
		setFilter(defaults.filter)
		setGeolocation(defaults.geolocation)
		setSort(defaults.sort)
		setView(defaults.view)
	}

	const updateFilter = ({ checked, key, value }: {
		checked: boolean
		key: keyof FilterValues
		value: string
	}) => {
		let entry = { [`${key}`]: [value] } as FilterValues

		setFilter(state => {
			const prevState = state

			const { [`${key}` as keyof FilterValues]: prevValues } = state
			const valuesSet = new Set(prevValues)

			if (checked)
				valuesSet.add(value)
			else
				valuesSet.delete(value)

			entry = { [`${key}`]: [...valuesSet] }

			return { ...prevState, ...entry }
		})

		resetPagination()
	}

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

		updateFilter({ key: 'breeds', checked, value })
	}

	const updateAge: FieldChangeHandler = (event) => {
		const { target: { checked, value } } = event
		updateFilter({ key: 'ages', checked, value })
	}

	const updateLocation: FieldChangeHandler = (event) => {
		const { target: { name, value } } = event
		const entry = { [`${name}`]: value }

		setGeolocation(prevState => {
			const tempState = { ...prevState, ...entry }
			const { city, state } = tempState

			if (!city && state.toLowerCase() === 'state')
				tempState.distance = ''

			return tempState
		})
		resetPagination()
	}

	const updateSort: FieldChangeHandler = (event) => {
		const { target: { name, value } } = event
		const entry = { [`${name}`]: value }

		setSort(state => ({ ...state, ...entry }))
		resetPagination()
	}

	const updateView: FieldChangeHandler = (event) => {
		const { target: { name, value } } = event

		const val = value ? value : defaults.view[`${name as keyof ViewValues}`],
			entry = { [`${name}`]: val }

		setView(state => ({ ...state, ...entry }))
	}

	useEffect(() => {
		const getBreedNames = async () => {
			try {
				const result = await fetchBreeds()
				setBreeds(result)
			} catch (err) {
				if (axios.isAxiosError(err) && err.status === 401)
					console.log('LOGGED OUT', err)
			}
		}

		getBreedNames()
	}, [])

	useEffect(() => {
		const heading = generateTitle({ ...filter, ...geolocation })
		setTitle(heading)
	}, [filter, geolocation])

	useEffect(() => {
		const {
			city,
			distance,
			state,
		} = geolocation

		const hasUsAbbr = state && state.length === 2

		const query: LocationParams = {
			...(hasUsAbbr && { states: [state] }),
			city,
			size: 100,
		}

		const fetchZipCodes = async () => {
			let zipRadius = null

			if (city || hasUsAbbr)
				zipRadius = await getZipCodesWithin(query, distance)

			setZipCodes(zipRadius)
		}

		fetchZipCodes()
	}, [geolocation])

	useEffect(() => {
		const { ages } = filter
		const { size } = view

		const ageRange = getAgeRange(ages),
			filterOrder = { ...filter, ...ageRange } as FilterParams

		const sortOrder = getSortOrder(sort).toLowerCase() as Sort

		const query = {
			...filterOrder,
			...(zipCodes?.length && { zipCodes }),
			from: (page - 1) * size,
			size,
			sort: sortOrder,
		} as DogParams

		const getDogs = async () => {
			if (zipCodes && !zipCodes.length) {
				setDogs([])
				setTotal({ items: 0, pages: 1 })
				return
			}

			try {
				const {
					resultIds,
					total: items,
				} = await fetchDogs(query)

				const list = await retrieveDogs(resultIds)
				const pages = Math.ceil(items/size) - 1

				setDogs(list)
				setTotal({ items, pages })
			} catch (error) {
				console.log(error)
			}
		}

		getDogs()
	}, [
		filter,
		page,
		sort,
		view,
		zipCodes,
	])

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
			const match = await retrieveMatch(favorites)
			handleUser({ match })
		} catch (err) {
			console.log(err)
		}
	}

	const clearFavorites = () => {
		toggleModal()
		handleUser({ favorites: [], match: {} })
	}

	const sidebarClasses = clsx({
		overlay: isSidebarOpen,
	})

	const hasDefaultValues = getSortOrder(sort) !== 'Breed:Asc'
		|| Object.values(filter).some(v => v.length)
		|| Object.values(geolocation).some(v => v.length)
		|| view.layout !== 'Grid'

	const pageValues = {
		clearFavorites,
		dogs,
		filter,
		geolocation,
		handleMatch,
		isSidebarOpen,
		page,
		resetBreeds,
		resetSidebar,
		sort,
		title,
		toggleModal,
		toggleSidebar,
		total,
		updateAge,
		updateBreeds,
		updateLocation,
		updateSort,
		updateView,
		view,
	}

	return (
		<PageProvider values={ pageValues }>
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
						variant="horizontal"
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
					<Header className="sidebar__header">
						<h2>Filter & Sort</h2>
						{ hasDefaultValues && (
							<Button onClick={ resetSidebar } variant="text">
								Reset All
							</Button>
						) }
						<Button onClick={ toggleSidebar } variant="icon">
							<BiX />
						</Button>
					</Header>

					<section className="sidebar__content">
						<h3>Sort By</h3>
						<Form
							className="sidebar__form"
							id="sort"
							role="search"
						>
							<Field
								name="category"
								onChange={ updateSort }
								options={ ['Age', 'Breed', 'Name'] as SortField[] }
								selected={ [sort.category!] }
								type="radio"
							/>
							<Field
								name="order"
								onChange={ updateSort }
								options={ ['Ascending', 'Descending'] }
								selected={ [sort.order!] }
								type="radio"
							/>
						</Form>

						<h3>Filter By</h3>
						<Form
							className="sidebar__form"
							id="filter"
							role="search"
						>
							<Field
								name="city"
								onChange={ updateLocation }
								type="text"
							/>
							<Field
								name="state"
								onChange={ updateLocation }
								options={ usaLocations }
								placeholder="State"
								type="select"
							/>
							{ !!(geolocation.city && geolocation.state.length === 2) && (
								<Field
									name="distance"
									onChange={ updateLocation }
									options={ distances }
									type="select"
								/>
							) }
							<Field
								name="ages"
								onChange={ updateAge }
								options={ ['Puppy (0-3)', 'Adult (4-7)', 'Senior (8+)'] }
								selected={ filter.ages }
								type="checkbox"
							/>
							<Field
								name="breeds"
								onChange={ updateBreeds }
								onReset={ resetBreeds }
								options={ breeds }
								placeholder="Search Breeds"
								selected={ filter.breeds }
								type="search"
							/>
						</Form>

						<h3>View As</h3>
						<Form className="sidebar__form" id="view">
							<Field
								name="layout"
								onChange={ updateView }
								options={ ['Grid', 'List'] }
								selected={ [view.layout] }
								type="radio"
							/>
							<Field
								min={ 1 }
								name="size"
								onChange={ updateView }
								placeholder="24"
								type="number"
							/>
						</Form>
					</section>

					<Footer className="sidebar__footer">
						<Button className="sidebar__button" onClick={ toggleSidebar }>
							View Dogs ({ total.items }) <BiSolidBone />
						</Button>
					</Footer>
				</nav>
			</aside>

			<main className="container">
				{ children }
			</main>

			<Footer className="paginate">
				<Pagination
					current={ page }
					handleChangePage={ changePageTo }
					total={ total.pages }
				/>
			</Footer>
		</PageProvider>
	)
}

Page.displayName = 'Page'
export { Page }
