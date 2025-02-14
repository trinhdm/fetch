import clsx from 'clsx'
import { BiHeart, BiSolidHeart } from 'react-icons/bi'
import { useUserContext } from '@providers/UserProvider'
import type { CardProps } from './Card.types'
import './card.module.scss'
import { useCallback, useEffect, useState } from 'react'
import { retrieveLocations } from '@utils/services'

const Card = ({
	age,
	breed,
	disableLike = false,
	id,
	img,
	name,
	zip_code,
}: CardProps) => {
	const {
		favorites,
		handleUser,
	} = useUserContext()!

	const [location, setLocation] = useState('')

	const handleFavorite = useCallback((event: React.MouseEvent<HTMLElement, MouseEvent>) => {
		event.stopPropagation()

		if (disableLike)
			return

		let faves = favorites

		if (favorites.includes(id))
			faves = faves.filter(prev => prev !== id)
		else
			faves.push(id)

		handleUser({ favorites: faves })
	}, [
		disableLike,
		favorites,
		handleUser,
		id,
	])

	useEffect(() => {
		const findLoc = async () => {
			const [result] = await retrieveLocations([zip_code])
			const { city, state } = result
			setLocation(`${city}, ${state} · ${zip_code}`)

			// console.log(result)
		}

		findLoc()
	}, [zip_code])

	const isFavorite = !!favorites.length && favorites.includes(id)

	const classes = clsx({
		card: true,
		'card--liked': isFavorite,
	})

	const Heart = isFavorite ? BiSolidHeart : BiHeart

	return (
		<article
			className={ classes }
			id={ id }
			onClick={ handleFavorite }
			tabIndex={ 0 }
		>
			<figure className="card__wrapper">
				{ !disableLike && (
					<div className="card__favorite">
						<Heart className="card__heart" />
					</div>
				) }

				{ img && <img className="card__img" src={ img } /> }

				<figcaption className="card__caption">
					{ name && <h3>{ name }</h3> }
					{ breed && <b>{ breed }</b> }

					<span className="card__details">
						{ typeof age === 'number' && (
							<i>{ age } { age > 1 ? 'years' : 'year' } old</i>
						) }
						<i>{ location ? location : zip_code }</i>
					</span>
				</figcaption>
			</figure>
		</article>
	)
}

Card.displayName = 'Carrd'
export { Card }
