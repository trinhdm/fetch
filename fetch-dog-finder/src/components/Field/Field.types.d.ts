import type { ReactNode } from 'react'


type FieldTypes =
	| 'email'
	| 'multiselect'
	| 'number'
	| 'range'
	| 'search'
	| 'select'
	| 'text'

type FieldValidations = Exclude<FieldTypes,
	| 'multiselect'
	| 'range'
	| 'select'
>


type FieldBase = {
	name: string
	onChange?: (event: ChangeEvent<HTMLSelectElement>) => void
}

type InputValues = FieldBase & {
	options?: never
	type: FieldValidations
}

type RangeValues = FieldBase & {
	options: number[] | string[]
	type: Extract<FieldTypes, 'range'>
}

type SelectValues = FieldBase & {
	options: string[]
	type: Extract<FieldTypes, 'multiselect' | 'select'>
}

type FieldValues =
	| InputValues
	| RangeValues
	| SelectValues

type FieldGroup = FieldValues[]


type ValidationPattern = {
	message: string
	value: RegExp
}

interface FieldProps extends Pick<FieldValues,
	| 'name'
	| 'onChange'
	| 'type'
> {
	children?: ReactNode
	hideLabel?: boolean
	onValidation: (field: FieldValidations) => {
		required: string;
		pattern: ValidationPattern
	}
}


export type {
	FieldGroup,
	FieldProps,
	FieldValidations,
}
