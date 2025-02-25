import clsx from 'clsx'
import {
	BiChevronDown,
	BiSearch,
	BiX,
} from 'react-icons/bi'
import { useRef, useState } from 'react'
import { useFormContext } from 'react-hook-form'
import { capitalize, slugify } from '@utils/helpers'
import { Button } from '@components/Button'
import { Menu } from '@components/Menu'
import type {
	CheckboxRadioValues,
	FieldChangeHandler,
	FieldProps,
	FieldSelectHandler,
	FieldValidations,
	SelectValues,
} from './Field.types'
import './field.module.scss'

const Field = ({
	name,
	onChange,
	onReset,
	onValidation,
	options,
	placeholder,
	selected,
	showLabel = true,
	type = 'text',
	...props
 }: FieldProps) => {
	const {
		formState: { errors },
		register,
	} = useFormContext()

	const [value, setValue] = useState('')

	const debounceRef = useRef<NodeJS.Timeout>(null)

	const hasOptions = !!options && options?.length > 0,
		hasSelected = !!selected && selected?.length > 0,
		isSearchField = type === 'search'

	const error = errors[name],
		labelledby = `${name}-label`,
		placehold = placeholder ?? capitalize(name)

	const handleInputChange: FieldChangeHandler = event => {
		let debounceID = debounceRef.current

		clearTimeout(debounceID!)

		debounceID = setTimeout(() => {
			if (isSearchField)
				setValue(event.target.value)
			else if (!!onChange && typeof onChange === 'function')
				onChange(event)
		}, 300)
	}

	const handleSelect = (event, index: number) => {
		setValue(index === 0 ? '' : event.target.innerText)

		if (!!onChange && typeof onChange === 'function')
			onChange(event)
	}

	const BiIcon = {
		checkbox: null,
		email: null,
		number: null,
		radio: null,
		search: (value ? BiX : BiSearch),
		select: BiChevronDown,
		text: null,
	}[`${type}`]

	const ariaLabels = showLabel
		? { 'aria-labelledby': labelledby }
		: { 'aria-label': placehold }

	const attrs = {
		...ariaLabels,
		...props,
	}

	const classes = clsx({
		'field': true,
		'field--error': error,
	})

	return (
		<div className={ classes }>
			{ showLabel && (
				type === 'checkbox' || type === 'radio' || type === 'select'
					? (
						<span className="field__label" id={ labelledby }>
							{ capitalize(name) }
						</span>
					)
					: (
						<label
							className="field__label"
							htmlFor={ name }
							id={ labelledby }
						>
							{ capitalize(name) }
						</label>
					)
			) }

			<div className="field__container">
				{ (type === 'email' || type === 'number' || type === 'search' || type === 'text') && (
					<input
						{ ...register(name, {
							onChange: handleInputChange,
							...onValidation!(type as FieldValidations)
						}) }
						className="field__input"
						id={ name }
						placeholder={ placehold }
						tabIndex={ 0 }
						type={ type }
						{ ...attrs }
					/>
				) }

				{ (type === 'checkbox' || type === 'radio') && (
					<ul className="field__choices">
						{ (options as CheckboxRadioValues['options']).map(opt => {
							const group = slugify(name),
								option = slugify(`${opt}`)

							return (
								<li className="field__choice" key={ option }>
									<input
										checked={ selected?.includes(opt) || false }
										className={ `field__${type}` }
										id={ option }
										name={ group }
										onChange={ onChange }
										tabIndex={ 0 }
										type={ type }
										value={ opt || '' }
									/>

									<label htmlFor={ option }>
										{ opt }
									</label>
								</li>
							)
						}) }
					</ul>
				) }

				{ type === 'select' && (
					<Menu className="field__select">
						<Menu.Toggle>
							<span className={ `field__selected ${value ? 'field__selected--value' : 'field__selected--default' }` }>
								{ value ? value : Object.keys(options as SelectValues['options'])[0] }
							</span>
						</Menu.Toggle>
						{ Object.entries(options as SelectValues['options']).map(([label], i) => (
							<Menu.Item
								isActive={ value === label }
								key={ slugify(`${label}`) }
								name={ name }
								onClick={ event => handleSelect(event, i) }
								value={ label }
							>
								{ label }
							</Menu.Item>
						)) }
					</Menu>
				) }

				{ BiIcon && <BiIcon className="field__icon" /> }

				{ !!(isSearchField && hasOptions && hasSelected && onReset) && (
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

			{ (isSearchField && hasOptions) && (
				<>
					<fieldset className="field__list">
						<ul className="field__choices">
							{ options.filter(opt => opt.toString().toLowerCase().includes(
								value.toLowerCase()
							)).map(opt => {
								const group = slugify(name),
									option = slugify(`${opt}`)

								return (
									<li className="field__choice" key={ option }>
										<input
											checked={ selected?.includes(opt) || false }
											className="field__checkbox"
											id={ option }
											name={ group }
											onChange={ onChange }
											tabIndex={ 0 }
											type="checkbox"
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
						<ul className="field__tags">
							{ selected.sort().map(option => (
								<li className="field__tag" key={ `${option}-tag` }>
									<Button onClick={ onChange as FieldSelectHandler } variant="tag">
										<span>{ option }</span>
										<BiX />
									</Button>
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
