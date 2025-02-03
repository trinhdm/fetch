import type { AriaRole, ReactNode } from 'react'


type FormValues = {
	name: string
	email: string
}

type FieldTypes =
	| 'email'
	| 'range'
	| 'search'
	| 'select'
	| 'text'

type FieldValidations = Exclude<FieldTypes, 'range' | 'select'>

type FieldValues = {
	name: keyof FormValues
	type: FieldTypes
}

type FieldGroup = FieldValues[]

interface FormProps {
	buttonText?: string
	children?: ReactNode
	fields: FieldGroup
	onSubmit: (event: FormEvent<HTMLFormElement, FormEvent>) => void
	role?: Extract<AriaRole, 'form' | 'search'>
}


export type {
	FieldGroup,
	FieldValidations,
	FieldValues,
	FormProps,
	FormValues,
}
