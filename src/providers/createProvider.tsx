import {
	createContext,
	useContext,
	type ReactNode,
} from 'react'

type ProviderProps<P> = {
	children: ReactNode
	values: P
}

const createProvider = <P,>(
	errorMsg: string = 'useProviderContext must be used within Provider'
) => {
	const ProviderContext = createContext<P | null>(null)
	ProviderContext.displayName = 'ProviderContext'

	const useProviderContext = () => {
		const Context = useContext(ProviderContext)

		if (!Context)
			console.warn(errorMsg)

		return Context
	}

	const Provider = ({ children, values }: ProviderProps<P>) => (
		<ProviderContext.Provider value={ values }>
			{ children }
		</ProviderContext.Provider>
	)

	return [Provider, useProviderContext] as const
}


export { createProvider }
