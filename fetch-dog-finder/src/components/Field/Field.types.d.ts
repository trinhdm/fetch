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

type FieldChangeHandler = (event: FieldChangeEvent, index?: number) => void
type FieldSelectHandler = (event: FieldChangeEvent | MouseEvent<HTMLElement>, index?: number) => void


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

type FieldProps = FieldValues & {
	onValidation?:
		| ((field: FieldValidations) => {
			required: string
			pattern: ValidationPattern
		})
		| (() => void)
	showLabel?: boolean
}

type ChoiceFieldProps = FieldBaseProps & Pick<ChoiceValues, 'options' | 'selected'>
type InputFieldProps = FieldBaseProps & Pick<FieldProps, 'onValidation' | 'placeholder'>
type SelectFieldProps = Omit<FieldBaseProps, 'handleChange'> & Pick<SelectValues, 'options'> & {
	handleSelect: FieldSelectHandler
	value: string
}


interface FieldLabelProps extends Pick<FieldValues, 'name' | 'type'> {
	children: string
}

interface FieldTagsProps extends FieldBaseProps, Pick<SearchValues, 'options' | 'selected'> {
	value: string
}


export type {
	ChoiceFieldProps,
	FieldChangeHandler,
	FieldLabelProps,
	FieldProps,
	FieldSelectHandler,
	FieldTagsProps,
	FieldValidations,
	InputFieldProps,
	SelectFieldProps,
}
