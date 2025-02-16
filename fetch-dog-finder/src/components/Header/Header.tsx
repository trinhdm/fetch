import {
	useCallback,
	useEffect,
	useRef,
	useState,
} from 'react'
import {
	BiCog,
	BiRefresh,
	BiSlider,
	BiSolidDog,
	BiUndo,
	BiX,
} from 'react-icons/bi'
import {
	logout,
	retrieveDogs,
	retrieveMatch,
} from '@utils/services'
import { useUserContext } from '@providers/UserProvider'
import { Button } from '@components/Button'
import { Card } from '@components/Card'
import { Logo } from '@components/Logo'
import { Menu } from '@components/Menu'
import type { Dog } from '@typings/shared'
import type { HeaderProps } from './Header.types'
import './header.module.scss'

const Header = ({
	handleSidebar = () => {},
}: HeaderProps) => {
	const {
		favorites,
		handleUser,
		// matchID,
		name,
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

	const handleLogout = async () => {
		try {
			await logout()
			handleUser({ isLoggedIn: false })
		} catch (error) {
			console.log(error)
		}
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

	return (
		<>
			<header className="header">
				<div className="header__wrapper">
					<Logo />
					<nav className="header__nav">
						<Menu className="settings">
							<Menu.Toggle>
								<span className="settings__welcome">
									<span>Welcome,&nbsp;</span><i>{ name }</i>
								</span>
								<BiCog />
							</Menu.Toggle>
							<Menu.Item>
								View Favorites
							</Menu.Item>
							<Menu.Item onClick={ handleLogout }>
								Logout
							</Menu.Item>
						</Menu>
						<Button
							hideTextMobile
							onClick={ handleSidebar }
							variant="outline"
						>
							Filter & Sort
							<BiSlider />
						</Button>
						<Button
							hideTextMobile
							disabled={ !favorites.length }
							onClick={ handleMatch }
						>
							Find Your Match
							<BiSolidDog />
						</Button>
					</nav>
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
