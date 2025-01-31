import { createProvider } from './createProvider'
import type { User } from '@typings/shared'

interface UserSettings extends User {
	favorites?: string[]
}

export const [UserProvider, useUserContext] = createProvider<UserSettings | undefined>(
	'useUserContext must be used within UserProvider'
)
