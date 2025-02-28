import type { ChangeEvent, KeyboardEvent, MouseEvent } from 'react'


type FieldTypes =
	| 'checkbox'
	| 'email'
	| 'number'
	| 'radio'
	| 'range'
	| 'search'
	| 'select'
	| 'text'

export type FieldValidations = Exclude<FieldTypes,
	| 'checkbox'
	| 'radio'
	| 'range'
	| 'select'
>

type FieldChangeEvent = ChangeEvent<HTMLInputElement>

export type FieldChangeHandler = (event: FieldChangeEvent, index?: number) => void
export type FieldKeyboardHandler = (event: KeyboardEvent<HTMLElement>, index?: number) => void
export type FieldSelectHandler = (event: FieldChangeEvent | MouseEvent<HTMLElement>, index?: number) => void


type InputValues = {
	autoComplete?: 'on' | 'off'
	max?: never
	min?: never
	onReset?: never
	options?: never
	type: Extract<FieldTypes, 'email' | 'text'>
	values?: never
}

type NumberValues = {
	autoComplete?: never
	max?: number
	min?: number
	onReset?: never
	options?: never
	type: Extract<FieldTypes, 'number'>
	values?: never
}

type SearchValues = {
	autoComplete?: never
	max?: never
	min?: never
	onReset?: (event: MouseEvent<HTMLElement>) => void
	options: (number | string)[]
	type: Extract<FieldTypes, 'search'>
	values?: (number | string)[]
}

type SelectValues = {
	autoComplete?: never
	max?: never
	min?: never
	onReset?: never
	options: Record<string, number | string>
	type: Extract<FieldTypes, 'select'>
	values?: never
}

type ChoiceValues = {
	autoComplete?: never
	max?: never
	min?: never
	onReset?: never
	options: (number | string)[]
	type: Extract<FieldTypes, 'checkbox' | 'radio'>
	values?: (number | string)[]
}


interface FieldBase {
	disabled?: boolean
	name: string
	value?: number | string
}

interface FieldBaseValues extends FieldBase {
	onChange?: FieldChangeHandler | FieldSelectHandler
	placeholder?: string
}

interface FieldBaseProps extends FieldBase {
	handleChange: FieldChangeHandler | ((event: KeyboardEvent<HTMLElement>) => void)
	type: FieldTypes
}

type FieldValues = FieldBaseValues & (
	| ChoiceValues
	| InputValues
	| NumberValues
	| SearchValues
	| SelectValues
)


type ValidationPattern = {
	message: string
	value: RegExp
}

export type FieldProps = FieldValues & {
	onValidation?:
		| ((field: FieldValidations) => {
			required: string
			pattern: ValidationPattern
		})
		| (() => void)
	showLabel?: boolean
}

export interface FieldLabelProps extends Pick<FieldValues,
	| 'name'
	| 'type'
> {
	children: string
}

export interface FieldTagsProps extends FieldBaseProps, Pick<SearchValues,
	| 'options'
	| 'values'
> {
	search: string
}


export type ChoiceFieldProps = FieldBaseProps & Pick<ChoiceValues,
	| 'options'
	| 'values'
>

export type InputFieldProps = FieldBaseProps & Pick<FieldProps,
	| 'onValidation'
	| 'placeholder'
>

export type SelectFieldProps = FieldBaseProps & Pick<SelectValues, 'options'>
