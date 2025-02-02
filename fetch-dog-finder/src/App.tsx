import { useCallback, useState } from 'react'
import { UserProvider } from '@providers/UserProvider'
import { Directory } from '@layout/Directory'
import { Login } from '@layout/Login'
import type { User, UserSettings } from '@typings/shared'
import './App.css'
import '@assets/scss/global.scss'

function App() {
	const [user, setUser] = useState<User>({
		name: '',
		email: '',
		isLoggedIn: false,
	})

	const handleUser = useCallback((data: User) => setUser(state => ({
		...data,
		isLoggedIn: !state.isLoggedIn,
	})), [setUser])

	const userValues: UserSettings = {
		...user,
		handleUser,
	}

	return (
		<UserProvider values={ userValues }>
			{ user.isLoggedIn ? <Directory /> : <Login /> }
		</UserProvider>
	)
}

export default App
