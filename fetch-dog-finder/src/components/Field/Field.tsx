import clsx from 'clsx'
import { HiX } from 'react-icons/hi'
import { useState } from 'react'
import { useFormContext } from 'react-hook-form'
import { capitalize, slugify } from '@utils/helpers'
import { Button } from '@components/Button'
import type {
	FieldChangeHandler,
	FieldProps,
	FieldValidations,
} from './Field.types'
import './field.module.scss'

const Field = ({
	name,
	onChange,
	onReset,
	onSelect,
	onValidation,
	options,
	selected,
	showLabel = false,
	type = 'text',
	...props
 }: FieldProps) => {
	const {
		formState: { errors },
		register,
	} = useFormContext()

	const [value, setValue] = useState('')

	const hasOnChange = !!onChange && typeof onChange === 'function',
		hasOptions = !!options && options?.length > 0,
		hasSelected = !!selected && selected?.length > 0

	const handleOnChange: FieldChangeHandler = (event) => (hasOnChange
		? onChange(event)
		: setValue(event.target.value)
	)

	const validateField = () => (typeof onValidation === 'function'
		? register(name, onValidation!(type as FieldValidations))
		: register(name)
	)

	const error = errors[name],
		label = `${name}-label`,
		placeholder = capitalize(name)

	const ariaLabels = showLabel
		? { 'aria-labelledby': label }
		: { 'aria-label': placeholder }

	const handlers = hasOnChange || hasOptions
		? { onChange: handleOnChange }
		: validateField()

	const classes = clsx({
		'field': true,
		'field--error': error,
	})

	return (
		<div className={ classes }>
			<div className="field__container">
				{ showLabel && (
					<label
						className="field__label"
						htmlFor={ name }
						id={ label }
					>
						{ placeholder }
					</label>
				) }

				<input
					autoComplete="on"
					className="field__input"
					placeholder={ placeholder }
					tabIndex={ 0 }
					type={ type }
					{ ...ariaLabels }
					{ ...handlers }
					{ ...props }
				/>

				{ !!(hasOptions && hasSelected && onReset) && (
					<Button
						className="field__button"
						onClick={ onReset }
						variant="text"
					>
						Clear All
					</Button>
				) }

				{ error && (
					<span className="field__message">
						{ error.message?.toString() }
					</span>
				) }
			</div>

			{ hasOptions && (
				<>
					<fieldset className="field__selection">
						{ showLabel && (
							<legend className="field__label" id={ label }>
								{ placeholder }
							</legend>
						) }

						<ul className="field__list">
							{ options.filter(opt => opt.toString().toLowerCase().includes(
								value.toLowerCase()
							)).map(opt => {
								const option = slugify(`${opt}`),
									fieldset = slugify(name)

								return (
									<li className="field__item" key={ option }>
										<input
											className="field__checkbox"
											checked={ selected?.includes(opt) }
											id={ option }
											name={ fieldset }
											onChange={ onSelect }
											tabIndex={ 0 }
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

					{ hasSelected && (
						<ul className="field__results">
							{ selected.sort().map(option => (
								<li
									className="field__tag"
									onClick={ onSelect }
									key={ `${option}-tag` }
									tabIndex={ 0 }
								>
									<span>{ option }</span>
									<HiX />
								</li>
							)) }
						</ul>
					) }
				</>
			) }
		</div>
	)
}

Field.displayName = 'Field'
export { Field }
