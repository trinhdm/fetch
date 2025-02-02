
interface Auth {
	name: string
	email: string
}

interface User extends Auth {
	favorites?: string[]
	isLoggedIn: boolean
}

interface UserSettings extends User {
	handleUser: ((data: User) => void) | (() => void)
}


export type {
	Auth,
	User,
	UserSettings,
}
