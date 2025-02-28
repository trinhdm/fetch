import { useMemo } from 'react'
import { BiX } from 'react-icons/bi'
import { Button } from '@components/Button'
import { ChoiceField } from '../FieldTypes'
import type { FieldSelectHandler, FieldTagsProps } from '../Field.types'
import './fieldtags.module.scss'

const FieldTags = ({
	disabled,
	name,
	handleChange,
	options,
	search,
	values,
 }: FieldTagsProps) => {
	const filteredOptions = useMemo(() => (options?.length
		? (options as FieldTagsProps['options']).filter(opt => `${opt}`.toLowerCase().includes(search))
		: []
	 ), [options, search])

	return (
		<>
			{ filteredOptions.length ? (
				<fieldset className="field-tags" disabled={ disabled }>
					<div className="field-tags__wrapper">
						<ChoiceField
							name={ name }
							handleChange={ handleChange }
							options={ filteredOptions }
							type="checkbox"
							values={ values }
						/>
					</div>
				</fieldset>
			) : (
				<p className="field-tags field-tags--empty">
					<i>Looks like we couldn’t find a match! Try widening your search.</i>
				</p>
			) }

			{ !!values?.length && (
				<ul className="field-tags__list" tabIndex={ -1 }>
					{ values.sort().map(option => (
						<li className="field__tag" key={ `${option}-tag` }>
							<Button
								disabled={ disabled }
								onClick={ handleChange as FieldSelectHandler }
								variant="tag"
								value={ option }
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
