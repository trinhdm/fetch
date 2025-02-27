import { useMemo } from 'react'
import { BiX } from 'react-icons/bi'
import { slugify } from '@utils/helpers'
import { Button } from '@components/Button'
import type { FieldSelectHandler, FieldTagsProps } from '../Field.types'
import './fieldtags.module.scss'

const FieldTags = ({
	disabled,
	name,
	handleChange,
	options,
	selected,
	value,
 }: FieldTagsProps) => {
	const filteredOptions = useMemo(() => (options?.length
		? (options as FieldTagsProps['options']).filter(opt => `${opt}`.toLowerCase().includes(value))
		: []
	 ), [options, value])

	return (
		<>
			{ filteredOptions.length ? (
				<fieldset className="field-tags">
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
										onChange={ handleChange }
										onKeyDown={ handleChange }
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
				<p className="field-tags field-tags--empty">
					<i>Looks like we couldn’t find a match! Try widening your search.</i>
				</p>
			) }

			{ !!selected?.length && (
				<ul className="field-tags__list" tabIndex={ -1 }>
					{ selected.sort().map(option => (
						<li className="field__tag" key={ `${option}-tag` }>
							<Button
								disabled={ disabled }
								onClick={ handleChange as FieldSelectHandler }
								variant="tag"
							>
								<span>{ option }</span>
								<BiX />
							</Button>
						</li>
					)) }
				</ul>
			) }
		</>
	)
}

FieldTags.displayName = 'FieldTags'
export { FieldTags }
