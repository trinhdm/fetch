import { createProvider } from './createProvider'
import type { UserSettings } from '@typings/shared'

export const [UserProvider, useUserContext] = createProvider<UserSettings>(
	'useUserContext must be used within UserProvider'
)
