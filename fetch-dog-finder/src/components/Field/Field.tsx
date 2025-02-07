import clsx from 'clsx'
import { BiSearch, BiX } from 'react-icons/bi'
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
	multiple = false,
	name,
	onChange,
	onReset,
	onSelect,
	onValidation,
	options,
	placeholder,
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
		labelledby = `${name}-label`,
		placehold = placeholder ?? capitalize(name),
		selection = multiple ? "checkbox" : "radio"

	const ariaLabels = showLabel
		? { 'aria-labelledby': labelledby }
		: { 'aria-label': placehold }

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
						id={ labelledby }
					>
						{ placehold }
					</label>
				) }

				<input
					className="field__input"
					name={ name }
					placeholder={ placehold }
					tabIndex={ 0 }
					type={ type }
					{ ...ariaLabels }
					{ ...handlers }
					{ ...props }
				/>

				{ type === 'search' && <BiSearch className="field__icon" /> }

				{ !!(hasOptions && hasSelected && onReset) && (
					<Button
						className="field__button"
						onClick={ onReset }
						variant="text"
					>
						Clear Tags
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
							<legend className="field__label" id={ labelledby }>
								{ placehold }
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
											checked={ selected?.includes(opt) || false }
											className={ `field__${selection}` }
											id={ option }
											name={ fieldset }
											onChange={ onSelect }
											tabIndex={ 0 }
											type={ selection }
											value={ opt || '' }
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
									<BiX />
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
