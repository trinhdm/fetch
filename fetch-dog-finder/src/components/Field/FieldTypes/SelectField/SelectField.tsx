import clsx from 'clsx'
import { BiChevronDown } from 'react-icons/bi'
import { slugify } from '@utils/helpers'
import { Menu } from '@components/Menu'
import type { FieldSelectHandler, SelectFieldProps } from '../../Field.types'
import './selectfield.module.scss'

const SelectField = ({
	disabled,
	handleChange,
	name,
	options,
	value,
 }: SelectFieldProps) => {
	const classes = clsx('field__toggle', {
		'field__toggle--default': !value,
		'field__toggle--selected': value,
	})

	return (
		<>
			<Menu className="field__select" disabled={ disabled }>
				<Menu.Toggle>
					<span className={ classes }>
						{ value ? value : Object.keys(options as SelectFieldProps['options'])[0] }
					</span>
				</Menu.Toggle>

				{ Object.entries(options as SelectFieldProps['options']).map(([label]) => (
					<Menu.Item
						isActive={ value === label }
						key={ slugify(`${label}`) }
						name={ name }
						onClick={ handleChange as unknown as FieldSelectHandler }
						value={ label }
					>
						{ label }
					</Menu.Item>
				)) }
			</Menu>

			<BiChevronDown aria-hidden="true" className="field__icon field__icon--select" />
		</>
	)
}

SelectField.displayName = 'SelectField'
export { SelectField }
