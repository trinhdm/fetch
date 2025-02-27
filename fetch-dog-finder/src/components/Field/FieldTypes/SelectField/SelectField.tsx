import clsx from 'clsx'
import { BiChevronDown } from 'react-icons/bi'
import { slugify } from '@utils/helpers'
import { Menu } from '@components/Menu'
import type { SelectFieldProps } from '../../Field.types'
import './selectfield.module.scss'

const SelectField = ({
	disabled,
	handleSelect,
	name,
	options,
	value,
 }: SelectFieldProps) => {
	const classes = clsx('field__toggle', {
		'field__toggle--selected': value,
		'field__toggle--default': !value,
	})

	return (
		<>
			<Menu className="field__select" disabled={ disabled }>
				<Menu.Toggle>
					<span className={ classes }>
						{ value ? value : Object.keys(options as SelectFieldProps['options'])[0] }
					</span>
				</Menu.Toggle>

				{ Object.entries(options as SelectFieldProps['options']).map(([label], i) => (
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

			<BiChevronDown aria-hidden="true" className="field__icon field__icon--select" />
		</>
	)
}

SelectField.displayName = 'SelectField'
export { SelectField }
