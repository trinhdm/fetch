import { useFormContext } from 'react-hook-form'
import { slugify } from '@utils/helpers'
import type { ChoiceFieldProps, FieldKeyboardHandler } from '../../Field.types'
import './choicefield.module.scss'

const ChoiceField = ({
	disabled,
	name,
	handleChange,
	options,
	type,
	values,
 }: ChoiceFieldProps) => {
	const { register } = useFormContext()

	return (
		<ul className="field__choices">
			{ (options as ChoiceFieldProps['options']).map(opt => {
				const group = slugify(name),
					option = slugify(`${opt}`)

				return (
					<li className="field__choice" key={ option }>
						<input
							{ ...register(name, {
								onChange: handleChange,
							}) }
							autoComplete="off"
							checked={ values?.includes(opt) || false }
							className={ `field__${type}` }
							disabled={ disabled }
							id={ option }
							name={ group }
							// onChange={ handleChange as FieldChangeHandler }
							onKeyDown={ handleChange as FieldKeyboardHandler }
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
	)
}

ChoiceField.displayName = 'ChoiceField'
export { ChoiceField }
