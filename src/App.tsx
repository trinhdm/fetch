import { useCallback, useState } from 'react'
import { BrowserRouter, Navigate, Route, Routes } from 'react-router'
import { UserProvider } from '@providers/UserProvider'
import { USER_DEFAULTS } from '@utils/constants'
import { Directory } from '@layout/Directory'
import { Favorites } from '@layout/Favorites'
import { Login } from '@layout/Login'
import { Page } from '@layout/Page'
import type { User, UserSettings } from '@typings/shared'
import '@assets/scss/global.scss'
import './App.scss'

function App() {
	const [user, setUser] = useState<User>(USER_DEFAULTS)

	const handleUser = useCallback((
		data: Partial<User> = USER_DEFAULTS
	) => setUser(state => ({ ...state, ...data })), [])

	const userValues: UserSettings = {
		...user,
		handleUser,
	}

	return (
		<UserProvider values={ userValues }>
			<BrowserRouter>
				<Routes>
					<Route path="/" element={
						user.isLoggedIn
							? <Navigate replace to="/directory" />
							: <Login />
					} />
					<Route path="/directory" element={
						user.isLoggedIn
							? <Page><Directory /></Page>
							: <Navigate replace to="/" />
					} />
					<Route path="/favorites" element={
						user.isLoggedIn
							? <Page><Favorites /></Page>
							: <Navigate replace to="/" />
					} />
				</Routes>
			</BrowserRouter>
		</UserProvider>
	)
}

export default App
