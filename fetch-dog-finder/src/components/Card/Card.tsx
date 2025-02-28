import clsx from 'clsx'
import {
	useCallback,
	useEffect,
	useState,
	type KeyboardEvent,
	type MouseEvent,
} from 'react'
import { retrieveLocations } from '@utils/services'
import { BiHeart, BiSolidHeart } from 'react-icons/bi'
import { useUserContext } from '@providers/UserProvider'
import type { CardProps } from './Card.types'
import './card.module.scss'

const Card = ({
	age,
	breed,
	disableLike = false,
	id,
	img,
	name,
	variant = 'vertical',
	zip_code,
}: CardProps) => {
	const { favorites, handleUser } = useUserContext()!
	const [location, setLocation] = useState('')

	const isFavorite = (id && !!favorites.length) && favorites.includes(id)

	const classes = clsx('card', {
		'card--liked': isFavorite,
		[`card--${variant}`]: variant,
	})

	const Heart = isFavorite ? BiSolidHeart : BiHeart

	const handleFavorite = useCallback((event: KeyboardEvent<HTMLElement> | MouseEvent<HTMLElement>) => {
		event.stopPropagation()

		if (
			disableLike
			|| !id
			|| event.type === 'keydown' && (event as KeyboardEvent<HTMLElement>).key !== 'Enter'
		)
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
		const outputLocation = async () => {
			if (!zip_code)
				return

			let isMounted = true,
				location = `${zip_code}`

			try {
				const [result] = await retrieveLocations([location])

				if (isMounted && result) {
					const { city, state } = result
					location = `${city}, ${state} · ${location}`
				}
			} catch (err) {
				console.warn('Error retrieving city, state from zip code:', err)
			} finally {
				if (isMounted)
					setLocation(location)
			}

			return () => { isMounted = false }
		}

		outputLocation()
	}, [zip_code])

	return (
		<article
			className={ classes }
			id={ id }
			onClick={ handleFavorite }
			onKeyDown={ handleFavorite }
			tabIndex={ disableLike ? -1 : 0 }
		>
			<figure className="card__wrapper">
				{ !disableLike && (
					<div className="card__favorite">
						<Heart className="card__heart" />
					</div>
				) }

				{ img && (
					<div className="card__image">
						<img
							alt={ `${name} · ${ breed } · ${age} years old` }
							className="card__img"
							src={ img }
						/>
					</div>
				) }

				<figcaption className="card__caption">
					{ name && <h3 className="card__heading">{ name }</h3> }
					{ breed && <b className="card__subheading">{ breed }</b> }

					<span className="card__details">
						{ typeof age === 'number' && (
							<span>{ age } { age > 1 ? 'years' : 'year' } old</span>
						) }
						<span>{ location ? location : zip_code }</span>
					</span>
				</figcaption>
			</figure>
		</article>
	)
}

Card.displayName = 'Carrd'
export { Card }
