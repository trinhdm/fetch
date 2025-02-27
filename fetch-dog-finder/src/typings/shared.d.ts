// import type { NonNegative } from './helpers'


// user authorization

interface Auth {
	name: string
	email: string
}

interface User extends Auth {
	favorites: string[]
	match: Dog | object
	isLoggedIn: boolean
}

type UserHandler = (data: Partial<User>) => void

interface UserSettings extends User {
	handleUser: UserHandler
}


// dog

interface Dog {
	age: number
	breed: string
	id: string
	img: `https://${string}.jpg`
	name: string
	zip_code: string
}

interface DogParams {
	ageMax?: Dog['Age']
	ageMin?: Dog['Age']
	breeds?: Array<Dog['breed']>
	from?: number
	size?: number
	sort?: Sort
	zipCodes?: Array<Location['zip_code']>
}


// location

interface Coordinates {
    lat: number
    lon: number
}

interface Location {
    city: string
    county: string
    latitude: number
    longitude: number
    state: string
    zip_code: string
}

interface LocationParams {
	city?: string
    states?: string[]
    geoBoundingBox?: {
        top?: Coordinates
        left?: Coordinates
        bottom?: Coordinates
        right?: Coordinates
        bottom_left?: Coordinates
        top_left?: Coordinates
    },
    from?: number
    size?: number
}


// filter + sort + view

type SortField = 'Age' | 'Breed' | 'Name'
type SortOrder = 'Asc' | 'Desc'
type SortParams = `${SortField}:${SortOrder}`

interface FilterValues {
	ages?: string[]
	breeds?: string[]
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

interface TotalValues {
	items: number
	pages: number
}

interface ViewValues {
	layout: 'Grid' | 'List'
	size: number
}

interface SidebarValues {
	filter: FilterValues
	geolocation: GeolocationValues
	sort: SortValues
	total: TotalValues
	view: ViewValues
}


export type {
	Auth,
	Dog,
	DogParams,
	FilterParams,
	FilterValues,
	GeolocationValues,
	Location,
	LocationParams,
	SidebarValues,
	SortParams,
	SortField,
	SortOrder,
	SortValues,
	User,
	UserSettings,
	ViewValues,
}
