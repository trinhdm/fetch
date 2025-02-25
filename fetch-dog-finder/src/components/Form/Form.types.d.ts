import type { AriaRole, ReactNode } from 'react'


type FormValues = {
	name: string
	email: string
}

interface FormBase {
	children?: ReactNode
	className?: string
	error?: string
	id: string
}

interface FormSubmitProps extends FormBase {
	buttonText?: string
	onSubmit?: (event: FormEvent<HTMLFormElement, FormEvent>) => void
	role?: Extract<AriaRole, 'form'>
}

interface FormSearchProps extends FormBase {
	buttonText?: never
	onSubmit?: never
	role: Extract<AriaRole, 'search'>
}

type FormProps = FormSearchProps | FormSubmitProps


export type {
	FormProps,
	FormValues,
}
