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

export type FieldValidations = Exclude<FieldTypes,
	| 'checkbox'
	| 'radio'
	| 'range'
	| 'select'
>

type FieldChangeEvent = ChangeEvent<HTMLInputElement>

export type FieldChangeHandler = (event: FieldChangeEvent, index?: number) => void
export type FieldSelectHandler = (event: FieldChangeEvent | MouseEvent<HTMLElement>, index?: number) => void


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

type ChoiceValues = {
	autoComplete?: never
	max?: never
	min?: never
	onReset?: never
	options: (number | string)[]
	selected?: (number | string)[]
	type: Extract<FieldTypes, 'checkbox' | 'radio'>
}


interface FieldBase {
	disabled?: boolean
	name: string
}

interface FieldBaseValues extends FieldBase {
	onChange?: FieldChangeHandler | FieldSelectHandler
	placeholder?: string
}

interface FieldBaseProps extends FieldBase {
	handleChange: FieldChangeHandler
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

export interface FieldLabelProps extends Pick<FieldValues, 'name' | 'type'> {
	children: string
}

export interface FieldTagsProps extends FieldBaseProps, Pick<SearchValues, 'options' | 'selected'> {
	value: string
}


export type ChoiceFieldProps = FieldBaseProps & Pick<ChoiceValues,
	| 'options'
	| 'selected'
>

export type InputFieldProps = FieldBaseProps & Pick<FieldProps,
	| 'onValidation'
	| 'placeholder'
>

export type SelectFieldProps = Omit<FieldBaseProps, 'handleChange'> & Pick<SelectValues, 'options'> & {
	handleSelect: FieldSelectHandler
	value: string
}
