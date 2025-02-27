import clsx from 'clsx'
import { useMemo, useRef, useState } from 'react'
import { BiChevronDown, BiSearch, BiX } from 'react-icons/bi'
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
	SearchValues,
	SelectValues,
} from './Field.types'
import './field.module.scss'

const Field = ({
	disabled = false,
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

	const hasOptions = !!options?.length,
		hasSelected = !!selected?.length,
		isSearchField = type === 'search'

	const error = errors[name],
		labelledby = `${name}-label`,
		placehold = placeholder ?? capitalize(name)

	const handleInputChange: FieldChangeHandler = event => {
		let debounceID = debounceRef.current

		if (debounceID)
			clearTimeout(debounceID)

		debounceID = setTimeout(() => {
			if (isSearchField)
				setValue(event.target.value)
			else if (!!onChange && typeof onChange === 'function')
				onChange(event)
		}, 300)
	}

	const handleSelect: FieldSelectHandler = (event, index) => {
		setValue(index === 0 ? '' : (event.target as HTMLElement).innerText)

		if (!!onChange && typeof onChange === 'function')
			onChange(event as React.ChangeEvent<HTMLInputElement>)
	}

	const BiIcon = useMemo(() => {
		return {
			search: value ? BiX : BiSearch,
			select: BiChevronDown,
		}[type as Extract<FieldValidations, 'search' | 'select'>] || null
	}, [type, value])

	 const filteredOptions = useMemo(() => (
		isSearchField && hasOptions
			? (options as SearchValues['options']).filter(opt => `${opt}`.toLowerCase().includes(value.toLowerCase()))
			: []
	 ), [
		isSearchField,
		hasOptions,
		options,
		value,
	])

	const classes = clsx({
		'field': true,
		'field--error': error,
	})

	return (
		<div className={ classes }>
			{ showLabel && (type === 'checkbox' || type === 'radio' || type === 'select') && (
				<legend className="field__label" id={ labelledby }>
					{ capitalize(name) }
				</legend>
			) }

			{ showLabel && (type !== 'checkbox' && type !== 'radio' && type !== 'select') && (
				<label
					className="field__label"
					htmlFor={ name }
					id={ labelledby }
				>
					{ capitalize(name) }
				</label>
			) }

			<div className="field__container">
				{ (type === 'email' || type === 'number' || type === 'search' || type === 'text') && (
					<input
						{ ...register(name, {
							onChange: handleInputChange,
							...onValidation!(type as FieldValidations)
						}) }
						className="field__input"
						disabled={ disabled }
						id={ name }
						placeholder={ placehold }
						type={ type }
						{ ...props }
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
										autoComplete="off"
										checked={ selected?.includes(opt) || false }
										className={ `field__${type}` }
										disabled={ disabled }
										id={ option }
										name={ group }
										onChange={ onChange }
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
						<Menu.Toggle disabled={ disabled }>
							<span className={ `field__selected ${value ? 'field__selected--value' : 'field__selected--default' }` }>
								{ value ? value : Object.keys(options as SelectValues['options'])[0] }
							</span>
						</Menu.Toggle>
						{ Object.entries(options as SelectValues['options']).map(([label], i) => (
							<Menu.Item
								disabled={ disabled }
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

				{ !!(isSearchField && hasSelected) && (
					<Button
						className="field__button"
						disabled={ disabled }
						onClick={ onReset }
						variant="text"
					>
						Clear Tags
					</Button>
				) }

				{ BiIcon && <BiIcon className={ `field__icon field__icon--${type}` } /> }

				{ error && (
					<span className="field__message">
						{ error.message?.toString() }
					</span>
				) }
			</div>

			{ (isSearchField && hasOptions) && (
				filteredOptions.length ? (
					<fieldset className="field__list">
						<ul className="field__choices">
							{ filteredOptions.map(opt => {
								const group = slugify(name),
									option = slugify(`${opt}`)

								return (
									<li className="field__choice" key={ option }>
										<input
											checked={ selected?.includes(opt) || false }
											className="field__checkbox"
											disabled={ disabled }
											id={ option }
											name={ group }
											onChange={ onChange }
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
				) : (
					<p className="field__list field__list--empty">
						<i>Looks like we couldn’t find a match! Try widening your search.</i>
					</p>
				)
			) }

			{ (isSearchField && hasSelected) && (
				<ul className="field__tags" tabIndex={ -1 }>
					{ selected.sort().map(option => (
						<li className="field__tag" key={ `${option}-tag` }>
							<Button
								disabled={ disabled }
								onClick={ onChange as FieldSelectHandler }
								variant="tag"
							>
								<span>{ option }</span>
								<BiX />
							</Button>
						</li>
					)) }
				</ul>
			) }
		</div>
	)
}

Field.displayName = 'Field'
export { Field }
