import axios from 'axios'
import clsx from 'clsx'
import { useEffect, useMemo, useState } from 'react'
import { BiSolidBone, BiX } from 'react-icons/bi'
import {
	AGE_OPTIONS,
	MILE_RADIUSES,
	SIDEBAR_DEFAULTS,
	SORT_OPTIONS,
	SORT_ORDER,
	USA_STATES,
	VIEW_OPTIONS,
} from '@utils/constants'
import { fetchBreeds } from '@utils/services'
import { getSortOrder } from '@utils/helpers'
import { usePageContext } from '@providers/PageProvider'
import { useUserContext } from '@providers/UserProvider'
import { Button } from '@components/Button'
import { Field } from '@components/Field'
import { Footer } from '@components/Footer'
import { Form } from '@components/Form'
import { Header } from '@components/Header'
import type { SidebarProps } from './Sidebar.types'
import './sidebar.module.scss'

const Sidebar = ({
	updateAge,
	updateBreeds,
	updateLocation,
	updateSort,
	updateView,
}: SidebarProps) => {
	const {
		filter,
		geolocation,
		isSidebarOpen,
		resetDirectory,
		sort,
		toggleSidebar,
		total,
		view,
	} = usePageContext()!

	const { handleUser } = useUserContext()!

	const [breeds, setBreeds] = useState<string[]>([])

	useEffect(() => {
		const getBreedNames = async () => {
			try {
				const result = await fetchBreeds()
				setBreeds(result)
			} catch (err) {
				if (axios.isAxiosError(err) && err.status === 401) {
					handleUser({ isLoggedIn: false })
					console.log('please login again', err)
				}
			}
		}

		getBreedNames()
	}, [handleUser])

	const hasDefaultValues = useMemo(() => (
		getSortOrder(sort) !== 'Breed:Asc'
		|| Object.values(filter).some(v => v.length)
		|| Object.values(geolocation).some(v => v.length)
		|| view.layout !== 'Grid'
	), [filter, geolocation, sort, view])

	const sidebarClasses = clsx('overlay', {
		'overlay--visible': isSidebarOpen,
	})

	return (
		<aside className={ sidebarClasses } onClick={ toggleSidebar }>
			<nav className="sidebar">
				<Header className="sidebar__header">
					<h2>Filter & Sort</h2>
					{ hasDefaultValues && (
						<Button
							className="sidebar__button--reset"
							disabled={ !isSidebarOpen }
							onClick={ resetDirectory }
							variant="text"
						>
							Reset All
						</Button>
					) }
					<Button
						disabled={ !isSidebarOpen }
						onClick={ toggleSidebar }
						variant="icon"
					>
						<BiX />
					</Button>
				</Header>

				<section className="sidebar__content">
					<h3>Filter By</h3>
					<Form
						className="sidebar__form"
						disabled={ !isSidebarOpen }
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
							options={ USA_STATES }
							placeholder="State"
							type="select"
						/>
						{ !!(geolocation.city && geolocation.state.length === 2) && (
							<Field
								name="distance"
								onChange={ updateLocation }
								options={ MILE_RADIUSES }
								type="select"
							/>
						) }
						<Field
							name="breeds"
							onChange={ updateBreeds }
							onReset={ () => resetDirectory('breeds') }
							options={ breeds }
							placeholder="Search Breeds"
							selected={ filter.breeds }
							type="search"
						/>
						<Field
							name="ages"
							onChange={ updateAge }
							options={ AGE_OPTIONS }
							selected={ filter.ages }
							type="checkbox"
						/>
					</Form>

					<h3>Sort By</h3>
					<Form
						className="sidebar__form"
						disabled={ !isSidebarOpen }
						id="sort"
					>
						<Field
							name="category"
							onChange={ updateSort }
							options={ SORT_OPTIONS }
							selected={ [sort.category] }
							type="radio"
						/>
						<Field
							name="order"
							onChange={ updateSort }
							options={ SORT_ORDER }
							selected={ [sort.order] }
							type="radio"
						/>
					</Form>

					<h3>View As</h3>
					<Form
						className="sidebar__form"
						disabled={ !isSidebarOpen }
						id="view"
					>
						<Field
							name="layout"
							onChange={ updateView }
							options={ VIEW_OPTIONS }
							selected={ [view.layout] }
							type="radio"
						/>
						<Field
							min={ 1 }
							name="size"
							onChange={ updateView }
							placeholder={ `${SIDEBAR_DEFAULTS.view.size}` }
							type="number"
						/>
					</Form>
				</section>

				<Footer className="sidebar__footer">
					<Button
						className="sidebar__button--search"
						disabled={ !isSidebarOpen }
						onClick={ toggleSidebar }
					>
						View Dogs ({ total.items }) <BiSolidBone />
					</Button>
				</Footer>
			</nav>
		</aside>
	)
}

Sidebar.displayName = 'Sidebar'
export { Sidebar }
