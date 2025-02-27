import type { ChangeEvent, MouseEvent } from 'react'


type FieldTypes =
	| 'checkbox'
	| 'email'
	| 'number'
	| 'radio'
	| 'range'
	| 'search'
	| 'select'
	| 'text'

type FieldValidations = Exclude<FieldTypes,
	| 'checkbox'
	| 'radio'
	| 'range'
	| 'select'
>

type FieldChangeEvent = ChangeEvent<HTMLInputElement>

type FieldChangeHandler = (event: FieldChangeEvent) => void
type FieldSelectHandler = (event: FieldChangeEvent | MouseEvent<HTMLElement>, index?: number) => void

type FieldBase = {
	disabled?: boolean
	name: string
	onChange?: FieldChangeHandler | FieldSelectHandler
	placeholder?: string
}

type InputValues = {
	autoComplete?: 'on' | 'off'
	max?: never
	min?: never
	onReset?: never
	options?: never
	selected?: never
	type: Extract<FieldTypes, 'email' | 'text'>
}

type NumberValues = {
	autoComplete?: never
	max?: number
	min?: number
	onReset?: never
	options?: never
	selected?: never
	type: Extract<FieldTypes, 'number'>
}

type SearchValues = {
	autoComplete?: never
	max?: never
	min?: never
	onReset?: (event: React.MouseEvent<HTMLElement, MouseEvent>) => void
	options: (number | string)[]
	selected?: (number | string)[]
	type: Extract<FieldTypes, 'search'>
}

type SelectValues = {
	autoComplete?: never
	max?: never
	min?: never
	onReset?: never
	options: Record<string, number | string>
	selected?: never
	type: Extract<FieldTypes, 'select'>
}

type CheckboxRadioValues = {
	autoComplete?: never
	max?: never
	min?: never
	onReset?: never
	options: (number | string)[]
	selected?: (number | string)[]
	type: Extract<FieldTypes, 'checkbox' | 'radio'>
}

type FieldValues = FieldBase & (
	| CheckboxRadioValues
	| InputValues
	| NumberValues
	| SearchValues
	| SelectValues
)

type ValidationPattern = {
	message: string
	value: RegExp
}

type FieldProps = FieldValues & {
	onValidation?: (field: FieldValidations) => {
		required: string
		pattern: ValidationPattern
	}
	showLabel?: boolean
}

type SelectFieldProps = FieldBase & SelectValues


export type {
	CheckboxRadioValues,
	FieldChangeHandler,
	FieldProps,
	FieldSelectHandler,
	FieldValidations,
	SearchValues,
	SelectFieldProps,
	SelectValues,
}
