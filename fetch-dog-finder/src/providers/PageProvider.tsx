import { createProvider } from './createProvider'
import type { PageSettings } from '@typings/shared'

export const [PageProvider, usePageContext] = createProvider<PageSettings>(
	'usePageContext must be used within PageProvider'
)
