import type { ChangeEvent } from 'react'


type FieldTypes =
	| 'email'
	| 'number'
	| 'range'
	| 'search'
	| 'select'
	| 'text'

type FieldValidations = Exclude<FieldTypes,
	| 'range'
	| 'select'
>

type FieldChangeEvent = ChangeEvent<HTMLInputElement>

type FieldChangeHandler = (event: FieldChangeEvent) => void
type FieldSelectHandler = (event: FieldChangeEvent | React.MouseEvent<HTMLElement, MouseEvent>) => void

type FieldBase = {
	name: string
	onChange?: FieldChangeHandler
	placeholder?: string
	// type: FieldTypes
}

type InputValues = {
	autoComplete?: 'on' | 'off'
	max?: never
	min?: never
	onReset?: never
	onSelect?: never
	options?: never
	selected?: never
	type: Extract<FieldTypes, 'email' | 'text'>
}

type NumberValues = {
	autoComplete?: never
	max?: number
	min?: number
	onReset?: never
	onSelect?: never
	options?: never
	selected?: never
	type: Extract<FieldTypes, 'number'>
}

type SelectValues = {
	autoComplete?: never
	max?: never
	min?: never
	onReset?: (event: React.MouseEvent<HTMLButtonElement, MouseEvent>) => void
	onSelect: FieldSelectHandler
	options: (number | string)[]
	selected?: (number | string)[]
	type: Extract<FieldTypes, 'search'>
}

type FieldValues = FieldBase & (
	| InputValues
	| NumberValues
	| SelectValues
)


type ValidationPattern = {
	message: string
	value: RegExp
}

type FieldProps = FieldValues & {
	onValidation?: (field: FieldValidations) => {
		required: string;
		pattern: ValidationPattern
	}
	showLabel?: boolean
}


export type {
	FieldChangeHandler,
	FieldProps,
	FieldSelectHandler,
	FieldValidations,
}
