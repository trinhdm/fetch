import type { Dog } from '@typings/shared'

interface CardProps extends Partial<Dog> {
	disableLike?: boolean
	variant?: 'horizontal' | 'vertical'
}

export type { CardProps }
