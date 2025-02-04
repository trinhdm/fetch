import clsx from 'clsx'
import { HiX } from 'react-icons/hi'
import { useState } from 'react'
import { useFormContext } from 'react-hook-form'
import { capitalize, slugify } from '@utils/helpers'
import { Button } from '@components/Button'
import type { FieldProps, FieldValidations } from './Field.types'
import './field.module.scss'

const Field = ({
	hideLabel = true,
	name,
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

	const [value, setValue] = useState('')

	const hasOptions = !!options && options?.length > 0,
		hasSelected = !!selected && selected?.length > 0


	const validateField = () => register(name, onValidation(type as FieldValidations))
	const handleOnChange = ({ target }) => setValue(target.value)

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
					{ ...validateField() }
					{ ...labels }
					{ ...(hasOptions ? { onChange: handleOnChange } : validateField()) }
					autoComplete="on"
					className="field__input"
					placeholder={ placeholder }
					tabIndex={ 0 }
					type={ type }
				/>

				{ !!(hasOptions && hasSelected && onReset) && (
					<Button
						as="text"
						className="field__button"
						onClick={ onReset }
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
						<legend className={ labelClasses } id={ label }>
							{ placeholder }
						</legend>

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
									key={ `${option}-selected` }
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
