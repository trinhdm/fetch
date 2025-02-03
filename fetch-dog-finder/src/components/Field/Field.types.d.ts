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

type FieldChangeEvent = ChangeEvent<HTMLInputElement | HTMLSelectElement>
type FieldSelectHandler = (event: FieldChangeEvent | React.MouseEvent<HTMLElement, MouseEvent>) => void

type FieldBase = {
	name: string
	onChange?: (event: FieldChangeEvent) => void
	type: FieldTypes
}

type InputValues = FieldBase & {
	onReset?: never
	onSelect?: never
	options?: never
	selected?: never
}

type SelectValues = FieldBase & {
	onReset?: (event: React.MouseEvent<HTMLButtonElement, MouseEvent>) => void
	onSelect: FieldSelectHandler
	options: number[] | string[]
	selected: (number[] | string[]) | undefined
}

type FieldValues =
	| InputValues
	| SelectValues

type FieldGroup = FieldValues[]


type ValidationPattern = {
	message: string
	value: RegExp
}

type FieldProps = FieldValues & {
	hideLabel?: boolean
	onValidation: (field: FieldValidations) => {
		required: string;
		pattern: ValidationPattern
	}
}


export type {
	FieldGroup,
	FieldProps,
	FieldSelectHandler,
	FieldValidations,
}
