import { useEffect, useState } from 'react'
import { BiSolidDog } from 'react-icons/bi'
import { retrieveDogs } from '@utils/services'
import { usePageContext } from '@providers/PageProvider'
import { useUserContext } from '@providers/UserProvider'
import { Card } from '@components/Card'
import type { Dog } from '@typings/shared'

const Favorites = () => {
	const { favorites } = useUserContext()!
	const { view } = usePageContext()!

	const [faves, setFaves] = useState<Dog[]>([])

	useEffect(() => {
		const getFavorites = async () => {
			try {
				const list = await retrieveDogs(favorites)
				setFaves(list)
			} catch (err) {
				console.error('Error retrieving favorited dogs:', err)
			}
		}

		getFavorites()
	}, [favorites])

	return (
		<>
			<hgroup className="heading">
				<h1 className="heading__title">Favorited Dogs</h1>
				<span className="heading__count">({ favorites.length })</span>
			</hgroup>

			<section className="description">
				<p>These are the dogs that have stolen your heart! Review your favorite pups here, and when you're ready, click <b>Find Your Match <BiSolidDog /></b> to discover your paw-fect companion.</p>
			</section>

			<section className="directory">
				{ !faves?.length && (
					<p><i>You haven’t favorited any dogs yet! Browse our network of over thousands of pups and tap the heart to save your favorites.</i></p>
				) }
				{ faves?.map(fave => (
					<Card
						{ ...fave }
						key={ fave.id }
						variant={ view.layout === 'Grid' ? 'vertical' : 'horizontal' }
					/>
				)) }
			</section>
		</>
	)
}

Favorites.displayName = 'Favorites'
export { Favorites }
