import { useEffect, useState } from 'react'
import { fetchBreeds, retrieveDogs, fetchMatch, fetchDogs } from '@utils/services'
import { useUserContext } from '@providers/UserProvider'
import type { FieldGroup } from '@components/Field'

const Directory = ({}) => {
	const { name } = useUserContext()

	const [breeds, setBreeds] = useState<string[]>([])
	const [dogs, setDogs] = useState<Dog[]>([])
	// const [favoriteDogs, setFavoriteDogs] = useState<string[]>([])
	const [page, setPage] = useState(1)
	const [sortOrder, setSortOrder] = useState<'asc' | 'desc'>('asc')

	useEffect(() => {
		const fetchDogIds = async () => {
			const query = {
				sort: `breed:${sortOrder}`,
				size: 10,
				from: (page - 1) * 10,
			}

			const { resultIds: ids } = await fetchDogs(query),
				list = await retrieveDogs(ids)

			setDogs(list)
		}

		fetchDogIds()
	}, [page, sortOrder])

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

	useEffect(() => {
		const fetchData = async () => {
			const result = await fetchBreeds()
			setBreeds(result)
		}

		fetchData()
	}, [])

	return (
		<div>
			<div>
				Welcome, { name }
				<ul>
					<li>Favorites</li>
					<li>Logout</li>
				</ul>
			</div>
			<div>
				<div><h1>Dog Finder</h1></div>
				<div>Grid View</div>
				<div>Sort By</div>
			</div>
			<div>
				<div>
					<h2>Search By</h2>
					<h3>Name</h3>
					<input />
					<h3>Age</h3>
					<h3>Location</h3>
					{ !!breeds.length && (
						<>
							<h2>Breeds</h2>
							<ul>
								{ breeds.map(breed => (
									<li>
										<span>{ breed }</span>
									</li>
								)) }
							</ul>
						</>
					) }
				</div>
				<div>
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
