import type { ReactNode } from 'react'


type FormValues = {
	name: string
	email: string
}

type FieldValues = {
	name: keyof FormValues
	type: 'email' | 'text'
}

type FieldGroup = FieldValues[]

interface FormProps {
	buttonText?: string
	children?: ReactNode
	fields: FieldGroup
	onSubmit: (event: FormEvent<HTMLFormElement, FormEvent>) => void
}


export type {
	FieldGroup,
	FieldValues,
	FormProps,
	FormValues,
}
