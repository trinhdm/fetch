import { slugify } from '@utils/helpers'
import type { ChoiceFieldProps } from '../../Field.types'
import './choicefield.module.scss'

const ChoiceField = ({
	disabled,
	name,
	handleChange,
	options,
	selected,
	type,
 }: ChoiceFieldProps) => (
	<ul className="field__choices">
		{ (options as ChoiceFieldProps['options']).map(opt => {
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
						onChange={ handleChange }
						onKeyDown={ handleChange }
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

ChoiceField.displayName = 'ChoiceField'
export { ChoiceField }
