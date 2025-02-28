import axios from 'axios'
import dog from '/dog-login.webp'
import { useCallback, useState } from 'react'
import { useNavigate } from 'react-router'
import { useUserContext } from '@providers/UserProvider'
import { login } from '@utils/services'
import { Form } from '@components/Form'
import { Field } from '@components/Field'
import { Logo } from '@components/Logo'
import type { User } from '@typings/shared'

const Login = () => {
	const navigate = useNavigate()
	const { handleUser } = useUserContext()!

	const [error, setError] = useState<string>('')
	const [isLoading, setIsLoading] = useState<boolean>(false)

	const handleLogin = useCallback(
		async (data: User) => {
			let isMounted = true
			setIsLoading(true)

			try {
				await login(data)
			} catch (err) {
				if (axios.isAxiosError(err))
					setError(`${err.message}`)
			} finally {
				if (isMounted) {
					setIsLoading(false)
					handleUser({ ...data, isLoggedIn: true })
					navigate('/directory')
				}
			}

			return () => { isMounted = false }
		}, [handleUser, navigate]
	)

	return (
		<div className="intro">
			<div className="column">
				<div className="content">
					<Logo />

					<h1>Ready to Fetch?</h1>
					<p>Let's find your new best friend, together.<br />Sign in to continue your search for the perfect pup.</p>

					<Form
						buttonText={ isLoading ? 'Loading...' : 'Start Searching' }
						error={ error }
						id="login"
						onSubmit={ handleLogin }
					>
						<Field
							autoComplete="on"
							name="name"
							type="text"
						/>
						<Field
							autoComplete="on"
							name="email"
							type="email"
						/>
					</Form>
				</div>
			</div>
			<div className="column">
				<img alt="Login image" src={ dog } />
			</div>
		</div>
	)
}

Login.displayName = 'Login'
export { Login }
