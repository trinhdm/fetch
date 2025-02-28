import clsx from 'clsx'
import { forwardRef, useCallback, useRef, useState } from 'react'
import { useFormContext } from 'react-hook-form'
import { BiSearch, BiX } from 'react-icons/bi'
import { capitalize } from '@utils/helpers'
import { debounce } from '@utils/children'
import { Button } from '@components/Button'
import { ChoiceField, InputField, SelectField } from './FieldTypes'
import { FieldLabel } from './FieldLabel'
import { FieldTags } from './FieldTags'
import type {
	ChoiceFieldProps,
	FieldChangeHandler,
	FieldProps,
	FieldTagsProps,
	SelectFieldProps,
} from './Field.types'
import './field.module.scss'

const Field = forwardRef<HTMLInputElement, FieldProps>(({
	disabled = false,
	name,
	onChange = () => {},
	onReset,
	onValidation,
	options,
	placeholder,
	showLabel = true,
	type = 'text',
	values,
	...props
}, ref) => {
	const { formState: { errors } } = useFormContext()
	const [search, setSearch] = useState('')

	const debounceRef = useRef<NodeJS.Timeout>(null)
	const error = errors[name]

	const classes = clsx('field', {
		'field--error': error,
	})

	const handleChange: FieldChangeHandler = useCallback(event => {
		switch (type) {
			case 'checkbox':
			case 'radio':
			case 'select':
				onChange(event)
				break
			case 'search':
				if (event.target.type === 'search')
					debounce(() => setSearch(event.target.value), debounceRef)
				else
					onChange(event)
				break
			default:
				debounce(() => onChange(event), debounceRef)
				break
		}
	}, [onChange, type])

	const sharedProps = {
		disabled,
		handleChange,
		name,
		type,
		...props
	}

	const renderField = () => {
		const BiIcon = search ? BiX : BiSearch

		switch (type) {
			case 'email':
			case 'number':
			case 'search':
			case 'text':
				return (
					<>
						<InputField
							{ ...sharedProps }
							onValidation={ onValidation }
							placeholder={ placeholder ?? capitalize(name) }
							ref={ ref }
						/>
						{ type === 'search' && (
							<>
								{ !!values?.length && (
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
						options={ options as ChoiceFieldProps['options'] }
						values={ values as ChoiceFieldProps['values'] }
					/>
				)
			case 'select':
				return (
					<SelectField
						{ ...sharedProps }
						options={ options as SelectFieldProps['options'] }
					/>
				)
			default:
				console.warn(`Unsupported field type: ${type}`)
				return null
		}
	}

	return (
		<div className={ classes }>
			{ showLabel && (
				<FieldLabel { ...sharedProps }>
					{ name }
				</FieldLabel>
			) }

			<div className="field__container">
				{ renderField() }

				{ error && (
					<span className="field__message">
						{ error.message?.toString() }
					</span>
				) }
			</div>

			{ type === 'search' && (
				<FieldTags
					{ ...sharedProps }
					options={ options as FieldTagsProps['options'] }
					search={ search.toLowerCase() }
					values={ values as FieldTagsProps['values'] }
				/>
			) }
		</div>
	)
})

Field.displayName = 'Field'
export { Field }
