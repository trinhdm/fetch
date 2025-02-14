import type { Dog } from '@typings/shared'

interface CardProps extends Dog {
	disableLike?: boolean
}

export type { CardProps }
