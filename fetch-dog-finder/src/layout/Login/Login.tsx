import { login } from '@utils/services'
import { useUserContext } from '@providers/UserProvider'
import { Form, type FieldGroup } from '@components/Form'
import type { User } from '@typings/shared'
import dog from '/dog-login.jpg'
import logo from '/logo-icon-purple.svg'

const Login = () => {
	const { handleUser } = useUserContext()!

	const handleLogin = async (data: User) => {
		try {
			await login(data)
			handleUser(data)
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
		<div className="intro">
			<div className="column">
				<div className="content">
					<a href="https://fetch.com/" className="logo" target="_blank">
						<img src={ logo } alt="Fetch logo" />
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
	)
}

Login.displayName = 'Login'
export { Login }
