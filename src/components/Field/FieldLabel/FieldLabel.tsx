import { capitalize } from '@utils/helpers'
import type { FieldLabelProps } from '../Field.types'
import './fieldlabel.module.scss'

const FieldLabel = ({
	children,
	name,
	type,
 }: FieldLabelProps) => {
	const labelledby = `${name}-label`

	switch (type) {
		case 'checkbox':
		case 'radio':
		case 'select':
			return (
				<legend className="field-label" id={ labelledby }>
					{ capitalize(children) }
				</legend>
			)
		default:
			return (
				<label
					className="field-label"
					htmlFor={ name }
					id={ labelledby }
				>
					{ capitalize(children) }
				</label>
			)
	}
}

FieldLabel.displayName = 'FieldLabel'
export { FieldLabel }
