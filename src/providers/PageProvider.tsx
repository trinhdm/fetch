import { createProvider } from './createProvider'
import type { PageSettings } from '@layout/Page/Page.types'

export const [PageProvider, usePageContext] = createProvider<PageSettings>(
	'usePageContext must be used within PageProvider'
)
