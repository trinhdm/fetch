import type { AriaRole, ReactNode } from 'react'
import type { FieldGroup } from '@components/Field'


type FormValues = {
	name: string
	email: string
}

interface FormProps {
	buttonText?: string
	children?: ReactNode
	fields: FieldGroup
	hideLabels?: boolean
	onSubmit: (event: FormEvent<HTMLFormElement, FormEvent>) => void
	role?: Extract<AriaRole, 'form' | 'search'>
}


export type {
	FormProps,
	FormValues,
}
