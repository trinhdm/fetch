import { useState } from 'react'
import { BrowserRouter, Route, Routes } from 'react-router'
import { Directory } from '@layout/Directory'
import { Favorites } from '@layout/Favorites'
import { Login } from '@layout/Login'
import { Page } from '@layout/Page'
import { UserProvider } from '@providers/UserProvider'
import type { User, UserSettings } from '@typings/shared'
import '@assets/scss/global.scss'
import './App.scss'

function App() {
	const defaultUser: User = {
		name: '',
		email: '',
		isLoggedIn: false,
		favorites: [],
		match: {},
	}

	const [user, setUser] = useState<User>(defaultUser)

	const handleUser = (
		data: Partial<User> = defaultUser
	) => setUser(state => ({ ...state, ...data }))

	const userValues: UserSettings = {
		...user,
		handleUser,
	}

	return (
		<UserProvider values={ userValues }>
			<BrowserRouter>
				<Routes>
					{ user.isLoggedIn ? (
						<>
							<Route path="/" element={ <Page><Directory /></Page> } />
							<Route path="/favorites" element={ <Page><Favorites /></Page> } />
						</>
					) : (
						<Route path="/" element={ <Login /> } />
					) }
				</Routes>
			</BrowserRouter>
		</UserProvider>
	)
}

export default App
