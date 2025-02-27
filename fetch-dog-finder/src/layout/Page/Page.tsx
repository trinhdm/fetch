import { BiRefresh, BiUndo } from 'react-icons/bi'
import { useEffect, useRef, useState } from 'react'
import {
	fetchDogs,
	getZipCodesWithin,
	retrieveDogs,
	retrieveMatch,
} from '@utils/services'
import { getAgeRange, getSortOrder } from '@utils/helpers'
import { SIDEBAR_DEFAULTS as defaults } from '@utils/constants'
import { useUserContext } from '@providers/UserProvider'
import { PageProvider } from '@providers/PageProvider'
import { Button } from '@components/Button'
import { Card } from '@components/Card'
import { Footer } from '@components/Footer'
import { Header } from '@components/Header'
import { Logo } from '@components/Logo'
import { Modal } from '@components/Modal'
import { Navbar } from '@components/Navbar'
import { Pagination } from '@components/Pagination'
import { Sidebar } from '@components/Sidebar'
import type { FieldChangeHandler, FieldSelectHandler } from '@components/Field'
import type { PageProps, PageSettings } from './Page.types'
import type {
	Dog,
	DogParams,
	FilterParams,
	FilterValues,
	Location,
	LocationParams,
	ViewValues,
} from '@typings/shared'

const Page = ({ children }: PageProps) => {
	const {
		favorites,
		handleUser,
		match,
	} = useUserContext()!
	const dialogRef = useRef<HTMLDialogElement>(null)

	const [dogs, setDogs] = useState<null | Dog[]>(null)
	const [zipCodes, setZipCodes] = useState<null | Pick<Location, 'zip_code'>[]>(null)

	const [filter, setFilter] = useState(defaults.filter)
	const [geolocation, setGeolocation] = useState(defaults.geolocation)
	const [sort, setSort] = useState(defaults.sort)
	const [view, setView] = useState(defaults.view)

	const [isSidebarOpen, setSidebarOpen] = useState<boolean>(false)
	const [page, setPage] = useState<number>(1)
	const [total, setTotal] = useState(defaults.total)

	const changePageTo = (target: number) => {
		window.scrollTo({ behavior: 'smooth', top: 0 })
		setPage(target)
	}

	const toggleSidebar = (event: React.MouseEvent<HTMLElement, MouseEvent>) => {
		if (event.target === event.currentTarget)
			setSidebarOpen(state => !state)
	}

	const resetPagination = () => setPage(1)

	const resetDirectory = (category = 'all') => {
		resetPagination()

		switch (category) {
			case 'breeds':
				setFilter(state => ({ ...state, breeds: [] }))
				break
			case 'all':
			default:
				setFilter(defaults.filter)
				setGeolocation(defaults.geolocation)
				setSort(defaults.sort)
				setView(defaults.view)
				break
		}
	}

	const handleMatch = async () => {
		try {
			const matchedDog = await retrieveMatch(favorites)
			handleUser({ match: matchedDog })
		} catch (err) {
			console.warn(err)
		} finally {
			const modal = dialogRef.current

			if (modal && !modal.open)
				modal.showModal()
		}
	}

	const toggleModal = () => {
		const modal = dialogRef.current

		if (modal && modal.open)
			modal.close()
	}

	const clearFavorites = () => {
		toggleModal()
		handleUser({ favorites: [], match: {} })
	}

	const updateFilter = ({ checked, key, value }: {
		checked: boolean
		key: keyof FilterValues
		value: string
	}) => {
		let entry = { [`${key}`]: [value] } as FilterValues

		setFilter(state => {
			const { [`${key}` as keyof FilterValues]: prevValues } = state
			const valuesSet = new Set(prevValues)
			const prevState = state

			if (checked)
				valuesSet.add(value)
			else
				valuesSet.delete(value)

			entry = { [`${key}`]: [...valuesSet] }

			return { ...prevState, ...entry }
		})

		resetPagination()
	}

	const updateAge: FieldChangeHandler = (event) => {
		const { target: { checked, value } } = event
		updateFilter({ key: 'ages', checked, value })
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
		const fetchZipCodes = async () => {
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

			let zipRadius = null

			if (city || hasUsAbbr)
				zipRadius = await getZipCodesWithin(query, distance)

			setZipCodes(zipRadius)
		}

		fetchZipCodes()
	}, [geolocation])

	useEffect(() => {
		const getDogs = async () => {
			if (zipCodes && !zipCodes.length) {
				setDogs([])
				setTotal({ items: 0, pages: 1 })
				return
			}

			const { ages } = filter
			const { size } = view

			const ageRange = getAgeRange(ages),
				filterOrder = { ...filter, ...ageRange } as FilterParams

			const sortOrder = getSortOrder(sort).toLowerCase()

			const query = {
				...filterOrder,
				...(zipCodes?.length && { zipCodes }),
				from: (page - 1) * size,
				size,
				sort: sortOrder,
			} as DogParams

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

	const pageValues: PageSettings = {
		dogs,
		filter,
		geolocation,
		handleMatch,
		isSidebarOpen,
		resetDirectory,
		sort,
		toggleModal,
		toggleSidebar,
		total,
		view,
	}

	return (
		<PageProvider values={ pageValues }>
			<Header className="navigation__header">
				<Logo />
				<Navbar />
			</Header>

			<Modal handleModal={ toggleModal } ref={ dialogRef }>
				<Modal.Header>Meet Your Paw-fect Match</Modal.Header>
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

			<Sidebar
				updateAge={ updateAge }
				updateBreeds={ updateBreeds }
				updateLocation={ updateLocation }
				updateSort={ updateSort }
				updateView={ updateView }
			/>

			<main className="container">
				{ children }
			</main>

			<Footer className="paginate">
				<Pagination current={ page } handleChangePage={ changePageTo } />
			</Footer>
		</PageProvider>
	)
}

Page.displayName = 'Page'
export { Page }
