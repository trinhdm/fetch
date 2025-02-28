import axios from 'axios'
import { haversineDistance } from './helpers'
import type {
	Auth,
	DogParams,
	Location,
	LocationParams,
} from '@typings/shared'


const API_URL: string = 'https://frontend-take-home-service.fetch.com'

const api = axios.create({
	baseURL: API_URL,
	withCredentials: true,
})

api.interceptors.request.use(config => {
	const token = localStorage.getItem('accessToken')
	config.headers.Authorization =  token ? `Bearer ${token}` : ''
	return config
})

export const login = async (credentials: Auth) => await api.post('/auth/login', credentials)

export const logout = async () => await api.post('/auth/logout')

export const fetchBreeds = async () => {
	const { data } = await api.get('/dogs/breeds')
	return data
}

export const fetchDogs = async (params: DogParams) => {
	const { data } = await api.get('/dogs/search', { params })
	return data
}

export const getZipCodesWithin = async (
	params: LocationParams,
	radius: null | string = null
): Promise<Array<Location['zip_code']>> => {
	try {
		const { data: { results } } = await api.post('/locations/search', params)

		const zipCoordinates = (results as Location[]).map(({
			latitude,
			longitude,
			zip_code,
		}) => radius
			? { latitude, longitude, zip_code }
			: { zip_code }
		)

		if (!zipCoordinates.length)
			return []

		const zipCoords = zipCoordinates as Pick<Location, 'latitude' | 'longitude' | 'zip_code'>[]

		if (radius) {
			const radiusMiles = parseInt(radius)

			const {
				latitude: baseLat,
				longitude: baseLon,
			} = zipCoords[0] as Pick<Location, 'latitude' | 'longitude'>

			return zipCoords
				.filter(({ latitude, longitude }) => haversineDistance(baseLat, baseLon, latitude, longitude) <= radiusMiles)
				.map(({ zip_code }) => zip_code) as unknown as Array<Location['zip_code']>
		}

		return zipCoords.map(({ zip_code }) => zip_code) as unknown as Array<Location['zip_code']>
	} catch (error) {
		console.error('Error fetching locations:', error)
		return []
	}
}

export const retrieveDogs = async (ids: string[]) => {
	const { data } = await api.post('/dogs', ids)
	return data
}

export const retrieveLocations = async (zipCodes: string[]) => {
	const { data } = await api.post('/locations', zipCodes)
	return data
}

export const retrieveMatch = async (ids: string[]) => {
	const { data: { match: matchID } } = await api.post('/dogs/match', ids)
	const [match] = await retrieveDogs([matchID])

	return match
}
