// import type { NonNegative } from './helpers'

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



interface Dog {
	age: number
	breed: string
	id: string
	img: `https://${string}.jpg`
	name: string
	zip_code: string
}

interface Location {
    city: string
    county: string
    latitude: number
    longitude: number
    state: string
    zip_code: string
}

interface Coordinates {
    lat: number
    lon: number
}


type SortField = 'Age' | 'Breed' | 'Name'
type SortOrder = 'Asc' | 'Desc'
type Sort = `${SortField}:${SortOrder}`

interface DogParams {
	ageMax?: Dog['Age']
	ageMin?: Dog['Age']
	breeds?: Array<Dog['breed']>
	from?: number
	size?: number
	sort?: Sort
	zipCodes?: Array<Location['zip_code']>
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

export type {
	Auth,
	Dog,
	DogParams,
	Location,
	LocationParams,
	Sort,
	SortField,
	SortOrder,
	User,
	UserSettings,
}
