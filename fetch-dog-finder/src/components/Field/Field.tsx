import clsx from 'clsx'
import { useRef, useState } from 'react'
import { useFormContext } from 'react-hook-form'
import { BiSearch, BiX } from 'react-icons/bi'
import { capitalize } from '@utils/helpers'
import { Button } from '@components/Button'
import { ChoiceField, InputField, SelectField } from './FieldTypes'
import { FieldLabel } from './FieldLabel'
import { FieldTags } from './FieldTags'
import type {
	ChoiceFieldProps,
	FieldChangeHandler,
	FieldProps,
	FieldSelectHandler,
	FieldTagsProps,
	SelectFieldProps,
} from './Field.types'
import './field.module.scss'

const Field = ({
	disabled = false,
	name,
	onChange = () => {},
	onReset,
	onValidation,
	options,
	placeholder,
	selected,
	showLabel = true,
	type = 'text',
	...props
 }: FieldProps) => {
	const { formState: { errors } } = useFormContext()
	const [value, setValue] = useState('')
	const debounceRef = useRef<NodeJS.Timeout>(null)

	const classes = clsx('field', {
		'field--error': errors[name],
	})

	const sharedProps = {
		disabled,
		name,
		type,
		...props
	}

	const debounce = (callback: () => void, delay = 250) => {
		let debounceID = debounceRef.current

		if (debounceID)
			clearTimeout(debounceID)

		debounceID = setTimeout(callback, delay)
	}

	const handleChange: FieldChangeHandler = event => {
		switch (type) {
			case 'checkbox':
			case 'radio':
				console.log(event.target)
				onChange(event)
				break
			case 'search':
				if (event.target.type === 'search')
					debounce(() => setValue(event.target.value))
				else
					onChange(event)
				break
			default:
				debounce(() => onChange(event))
				break
		}
	}

	const handleSelect: FieldSelectHandler = (event, index) => {
		setValue(index === 0 ? '' : (event.target as HTMLElement).innerText)
		handleChange(event as React.ChangeEvent<HTMLInputElement>)
	}

	const renderField = () => {
		const BiIcon = value ? BiX : BiSearch

		switch (type) {
			case 'email':
			case 'number':
			case 'search':
			case 'text':
				return (
					<>
						<InputField
							{ ...sharedProps }
							disabled={ disabled }
							handleChange={ handleChange }
							name={ name }
							onValidation={ onValidation }
							placeholder={ placeholder ?? capitalize(name) }
							type={ type }
						/>
						{ type === 'search' && (
							<>
								{ !!selected?.length && (
									<Button
										className="field__button"
										disabled={ disabled }
										onClick={ onReset }
										variant="text"
									>
										Clear Tags
									</Button>
								) }
								<BiIcon className="field__icon field__icon--search" />
							</>
						) }
					</>
				)
			case 'checkbox':
			case 'radio':
				return (
					<ChoiceField
						{ ...sharedProps }
						handleChange={ handleChange }
						options={ options as ChoiceFieldProps['options'] }
						selected={ selected }
					/>
				)
			case 'select':
				return (
					<SelectField
						{ ...sharedProps }
						handleSelect={ handleSelect }
						options={ options as SelectFieldProps['options'] }
						value={ value }
					/>
				)
			default:
				return null
		}
	}

	return (
		<div className={ classes }>
			{ showLabel && (
				<FieldLabel name={ name } type={ type }>
					{ name }
				</FieldLabel>
			) }

			<div className="field__container">
				{ renderField() }
			</div>

			{ type === 'search' && (
				<FieldTags
					{ ...sharedProps }
					handleChange={ handleChange }
					options={ options as FieldTagsProps['options'] }
					selected={ selected }
					value={ value.toLowerCase() }
				/>
			) }
		</div>
	)
}

Field.displayName = 'Field'
export { Field }
