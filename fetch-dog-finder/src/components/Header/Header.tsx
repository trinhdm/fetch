import clsx from 'clsx'
import {
	useCallback,
	useEffect,
	useRef,
	useState,
} from 'react'
import {
	BiRefresh,
	BiUndo,
	BiX,
} from 'react-icons/bi'
import {
	retrieveDogs,
	retrieveMatch,
} from '@utils/services'
import { useUserContext } from '@providers/UserProvider'
import { Button } from '@components/Button'
import { Card } from '@components/Card'
import type { Dog } from '@typings/shared'
import type { HeaderProps } from './Header.types'
import './header.module.scss'

const Header = ({
	children,
	className,
}: HeaderProps) => {
	const {
		favorites,
		handleUser,
		// matchID,
	} = useUserContext()!

	const dialogRef = useRef<HTMLDialogElement>(null)

	const [bestDog, setBestDog] = useState<Dog | null>(null)
	const [matchID, setMatchID] = useState<string[]>([])

	const openModal = () => dialogRef.current?.showModal()
	const closeModal = () => dialogRef.current?.close()

	const clearFavorites = () => {
		closeModal()
		handleUser({ favorites: [] })
		// handleUser({ favorites: [], matchID: [] })
		setMatchID([])
	}

	const handleMatch = useCallback(async () => {
		try {
			const { match } = await retrieveMatch(favorites)
			setMatchID(state => state.length ? state : [match])
			// const matched = matchID.length ? matchID : [match]
			// handleUser({ matchID: matched })
		} catch (error) {
			console.log(error)
		} finally {
			if (!dialogRef.current?.open)
				openModal()
		}
	}, [favorites])

	const refreshMatch = () => {
		// handleUser({ matchID: [] })
		setMatchID([])
		handleMatch()
	}

	useEffect(() => {
		const getMatch = async () => {
			const [result] = await retrieveDogs(matchID)
			setBestDog(result)
		}

		getMatch()
	}, [matchID])

	const classes = clsx({
		header: true,
		[`${className}`]: className,
	})

	return (
		<>
			<header className={ classes }>
				<div className="header__wrapper">
					{ children }
				</div>
			</header>

			<dialog className="modal" ref={ dialogRef }>
				<header className="header modal__header">
					<div className="header__wrapper">
						<h2>Meet Your Paw-fect Match</h2>
						<Button
							className="modal__close"
							onClick={ closeModal }
							variant="icon"
						>
							<BiX />
						</Button>
					</div>
				</header>

				<div className="modal__content">
					{ bestDog && <Card disableLike { ...bestDog } /> }
				</div>

				<footer className="footer modal__footer">
					<div className="footer__wrapper">
						{ favorites.length > 1 && (
							<Button onClick={ refreshMatch }>
								Refresh Match <BiRefresh />
							</Button>
						) }
						<Button onClick={ clearFavorites } variant="outline">
							Clear Favorites <BiUndo />
						</Button>
					</div>
				</footer>
			</dialog>
		</>
	)
}

Header.displayName = 'Header'
export { Header }
