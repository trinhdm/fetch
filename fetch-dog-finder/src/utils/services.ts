import axios from 'axios'
import type { User } from '@typings/shared'


const API_URL = 'https://frontend-take-home-service.fetch.com'

const api = axios.create({
	baseURL: API_URL,
	withCredentials: true,
})

api.interceptors.request.use(config => {
	const token = localStorage.getItem('accessToken')
	config.headers.Authorization =  token ? `Bearer ${token}` : ''
	return config
})

export const login = async (credentials: User) => await api.post('/auth/login', credentials)

export const logout = async () => {
	await api.post('/auth/logout')
}

export const fetchBreeds = async () => {
	const response = await api.get('/dogs/breeds')
	return response.data
}

export const fetchDogs = async (query: Record<string, any>) => {
	const response = await api.get('/dogs/search', { params: query })
	return response.data
}

export const retrieveDogs = async (ids: string[]) => {
	const response = await api.post('/dogs', ids)
	return response.data
}

export const fetchMatch = async (dogIds: string[]) => {
	const response = await api.post('/dogs/match', dogIds)
	return response.data
}
