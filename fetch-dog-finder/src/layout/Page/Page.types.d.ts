import type { ReactNode } from 'react'
import type { SortField, SortOrder } from '@typings/shared'
// import type { NonNegative } from '@typings/helpers'


interface PageProps {
	children: ReactNode
}

interface FilterValues {
	ages?: string[]
	breeds?: string[]
	// location
}

interface FilterParams extends Pick<FilterValues, 'breeds'> {
	ageMax?: number
	ageMin?: number
}

interface GeolocationValues {
	city: string
	distance: string
	state: string
}

interface SortValues {
	category: SortField
	order: SortOrder | 'Ascending' | 'Descending'
}

interface ViewValues {
	layout: 'Grid' | 'List'
	size: number
}

export type {
	FilterParams,
	FilterValues,
	GeolocationValues,
	PageProps,
	SortValues,
	ViewValues,
}
