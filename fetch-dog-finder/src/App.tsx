import { useState } from 'react'
import { login } from '@utils/services'
import { UserProvider } from '@providers/UserProvider'
import { Button } from '@components/Button'
import { Form, type FieldGroup } from '@components/Form'
import type { User } from '@typings/shared'
import dog from '/dog-login.jpg'
import logo from '/logo-icon-purple.svg'
import './App.css'
import '@assets/scss/global.scss'

function App() {
	const [isLoggedIn, setLoggedIn] = useState<boolean>(false)
	const [credentials, setCredentials] = useState<User>()

	const handleLogin = async (data: User) => {
		try {
			await login(data)
			setCredentials(data)
			setLoggedIn(state => !state)
		} catch (error) {
			console.log(error)
		}
	}

	const loginFields: FieldGroup = [
		{
			name: 'name',
			type: 'text',
		},
		{
			name: 'email',
			type: 'email',
		},
	]

	return (
		<UserProvider values={ credentials }>
			{ isLoggedIn && (
				<div>
					<Button onClick={ handleLogin }>
						Logout
					</Button>
				</div>
			) }

			{ !isLoggedIn && (
				<div className="intro">
					<div className="column">
						<div className="content">
							<a href="https://vite.dev" className="logo" target="_blank">
								<img src={ logo } alt="Vite logo" />
							</a>
							<Form fields={ loginFields } onSubmit={ handleLogin }>
								<h1>Ready to Fetch?</h1>
								<p>Welcome to Fetch. Let's find your new best friend, together.</p>
							</Form>
						</div>
					</div>
					<div className="column">
						<img src={ dog } />
					</div>
				</div>
			) }
		</UserProvider>
	)
}

export default App
