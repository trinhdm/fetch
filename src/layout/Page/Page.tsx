import { useEffect, useRef, useState } from 'react'
import { BiRefresh, BiUndo } from 'react-icons/bi'
import { SIDEBAR_DEFAULTS as defaults } from '@utils/constants'
import { PageProvider } from '@providers/PageProvider'
import { useUserContext } from '@providers/UserProvider'
import { getAgeRange, getSortOrder } from '@utils/helpers'
import {
	fetchDogs,
	getZipCodesWithin,
	retrieveDogs,
	retrieveMatch,
} from '@utils/services'
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
	const [zipCodes, setZipCodes] = useState<null | Array<Location['zip_code']>>(null)

	const [filter, setFilter] = useState(defaults.filter)
	const [geolocation, setGeolocation] = useState(defaults.geolocation)
	const [sort, setSort] = useState(defaults.sort)
	const [total, setTotal] = useState(defaults.total)
	const [view, setView] = useState(defaults.view)

	const [isSidebarOpen, setSidebarOpen] = useState<boolean>(false)
	const [page, setPage] = useState<number>(1)

	const changePageTo = (target: number) => {
		window.scrollTo({ behavior: 'smooth', top: 0 })
		setPage(target)
	}

	const toggleSidebar = (event: React.MouseEvent<HTMLElement>) => {
		if (event.target === event.currentTarget)
			setSidebarOpen(state => !state)
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

	const resetDirectory: PageSettings['resetDirectory'] = (category = 'all', refs = []) => {
		setPage(1)

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

		if (refs.length) {
			refs.forEach(rf => {
				if (rf.current)
					rf.current.value = ''
			})
		}
	}

	const updateFilter = (
		name: keyof FilterValues,
		event: React.ChangeEvent<HTMLElement> | React.KeyboardEvent<HTMLElement> | React.MouseEvent<HTMLElement>
	) => {
		const { target, type } = event
		const { value } = target as HTMLInputElement

		let checked,
			entry = { [`${name}`]: [value] } as FilterValues

		;({ checked } = target as HTMLInputElement)

		if (type === 'keydown' && (event as React.KeyboardEvent<HTMLElement>).key === 'Enter')
			checked = !checked

		setFilter(state => {
			const { [`${name}` as keyof FilterValues]: prevValues } = state
			const valuesSet = new Set(prevValues)
			const prevState = state

			if (checked)
				valuesSet.add(value)
			else
				valuesSet.delete(value)

			entry = { [`${name}`]: [...valuesSet] }

			return { ...prevState, ...entry }
		})

		setPage(1)
	}

	const updateAge: FieldChangeHandler = (event) => updateFilter('ages', event)
	const updateBreeds: FieldSelectHandler = (event) => updateFilter('breeds', event)

	const updateLocation: FieldChangeHandler = (event) => {
		const { target: { name, value } } = event
		const entry = { [`${name}`]: value }

		setGeolocation(prevState => {
			const tempState = { ...prevState, ...entry }
			const { city, state } = tempState

			if (state.toLowerCase() === 'state')
				tempState.state = ''

			if (!city && !state)
				tempState.distance = ''

			return tempState
		})

		setPage(1)
	}

	const updateSort: FieldChangeHandler = (event) => {
		const { target: { name, value } } = event
		const entry = { [`${name}`]: value }

		setSort(state => ({ ...state, ...entry }))
		setPage(1)
	}

	const updateView: FieldChangeHandler = (event) => {
		const { target: { name, value } } = event

		let val = value ? value : defaults.view[`${name as keyof ViewValues}`]
		val = name === 'size' ? parseInt(`${val}`) : val
		const entry = { [`${name}`]: val }

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

			try {
				const query: LocationParams = {
					...(hasUsAbbr && { states: [state] }),
					city,
					size: 100,
				}

				let zipRadius = null

				if (city || hasUsAbbr)
					zipRadius = await getZipCodesWithin(query, distance)

				setZipCodes(zipRadius)
			} catch (err) {
				console.error('Error getting zip codes in radius:', err)
			}
		}

		fetchZipCodes()
	}, [geolocation])

	useEffect(() => {
		const getDogs = async () => {
			if (zipCodes && !zipCodes.length) {
				setDogs([])
				setTotal(defaults.total)
				return
			}

			const { ages, breeds } = filter
			const { size } = view

			try {
				const query: DogParams = {
					...getAgeRange(ages),
					...(zipCodes?.length && { zipCodes }),
					breeds,
					from: (page - 1) * size,
					size,
					sort: getSortOrder(sort).toLowerCase(),
				}

				const {
					resultIds,
					total: items,
				} = await fetchDogs(query)

				setDogs(await retrieveDogs(resultIds))
				setTotal({ items, pages: Math.ceil(items/size) - 1 })
			} catch (err) {
				console.warn('Error fetching dogs:', err)
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
