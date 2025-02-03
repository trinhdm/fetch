import clsx from 'clsx'
import { useFormContext } from 'react-hook-form'
import type { FieldProps, FieldValidations } from './Field.types'
import './field.module.scss'

const Field = ({
	children,
	hideLabel = true,
	name,
	// onChange,
	onValidation,
	type,
 }: FieldProps) => {
	const {
		formState: { errors },
		register,
	} = useFormContext()

	const capitalize = (word: string) => word.charAt(0).toUpperCase() + word.slice(1)

	const validateField = () => register(name, onValidation(type as FieldValidations))

	const error = errors[name],
		label = `${name}-label`,
		placeholder = capitalize(name)

	const classes = clsx({
		'field': true,
		'field--error': error,
	})

	const labelClasses = clsx({
		'field__label': !hideLabel,
		'field__label--hidden': hideLabel,
	})

	const labels = hideLabel
		? { 'aria-label': placeholder }
		: { 'aria-labelledby': label }

	return (
		<div className={ classes }>
			<label
				className={ labelClasses }
				htmlFor={ name }
				id={ label }
			>
				{ placeholder }
			</label>

			<input
				{ ...labels }
				{ ...validateField() }
				autoComplete="on"
				className="field__input"
				placeholder={ placeholder }
				tabIndex={ 0 }
				type={ type }
			/>

			{ children }

			{ error && (
				<span className="field__message">
					{ error.message?.toString() }
				</span>
			) }
		</div>
	)
}

Field.displayName = 'Field'
export { Field }
