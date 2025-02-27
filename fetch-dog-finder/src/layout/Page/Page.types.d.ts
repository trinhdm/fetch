import type { MouseEvent, ReactNode } from 'react'
import type {
	Dog,
	FilterValues,
	GeolocationValues,
	SortValues,
	ViewValues,
} from '@typings/shared'


interface PageProps {
	children: ReactNode
}

interface PageSettings {
	dogs: Dog[] | null
	filter: FilterValues
	geolocation: GeolocationValues
	handleMatch: () => Promise<void>
	isSidebarOpen: boolean
	resetDirectory: (category?: string) => void
	sort: SortValues
	toggleModal: () => void
	toggleSidebar: (event: MouseEvent<HTMLElement>) => void
	total: {
		items: number
		pages: number
	}
	view: ViewValues
}


export type {
	PageProps,
	PageSettings,
}
