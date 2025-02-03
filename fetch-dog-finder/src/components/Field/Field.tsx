import clsx from 'clsx'
import { useFormContext } from 'react-hook-form'
import { Button } from '@components/Button'
import type { FieldProps, FieldValidations } from './Field.types'
import './field.module.scss'

const Field = ({
	hideLabel = true,
	name,
	// onChange,
	onReset,
	onSelect,
	onValidation,
	options,
	selected,
	type,
 }: FieldProps) => {
	const {
		formState: { errors },
		register,
	} = useFormContext()

	const capitalize = (word: string) => word.charAt(0).toUpperCase() + word.slice(1)
	const slugify = (str: string) => str.toLowerCase()
										.replace(/^\s+|\s+$/g, '')
										.replace(/[^a-z0-9 -]/g, '')
										.replace(/\s+/g, '-')
										.replace(/-+/g, '-')

	const validateField = () => register(name, onValidation(type as FieldValidations))
	// const validateField = () => (!!onChange && typeof onChange === 'function'
	// 	? register(name, onValidation(type as FieldValidations))
	// 	: {})

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
			<div className="field__container">
				{ !options?.length && (
					<label
						className={ labelClasses }
						htmlFor={ name }
						id={ label }
					>
						{ placeholder }
					</label>
				) }

				<input
					{ ...labels }
					{ ...validateField() }
					autoComplete="on"
					className="field__input"
					placeholder={ placeholder }
					tabIndex={ 0 }
					type={ type }
				/>

				{ (!!options && options?.length > 0) && (
					<fieldset className="dropdown">
						<legend className={ labelClasses } id={ label }>
							{ placeholder }
						</legend>

						<ul className="dropdown__list">
							{ options.map(opt => {
								const option = slugify(`${opt}`),
									fieldset = slugify(name)

								return (
									<li className="dropdown__item" key={ option }>
										<input
											checked={ selected.includes(opt) }
											id={ option }
											name={ fieldset }
											onChange={ onSelect }
											type="checkbox"
											value={ opt }
										/>

										<label htmlFor={ option }>
											{ opt }
										</label>
									</li>
								)
							}) }
						</ul>
					</fieldset>
				) }

				{ error && (
					<span className="field__message">
						{ error.message?.toString() }
					</span>
				) }
			</div>

			{ ((!!options && options?.length > 0) && (!!selected && selected?.length > 0)) && (
				<>
					<ul className="field__selected">
						{ selected.map(option => (
							<li onClick={ onSelect } key={ `${option}-selected` } value={ `${option}` }>
								<span>{ option }</span>

							</li>
						)) }
					</ul>

					{ onReset && <Button onClick={ onReset }>Clear All</Button> }
				</>
			) }
		</div>
	)
}

Field.displayName = 'Field'
export { Field }
