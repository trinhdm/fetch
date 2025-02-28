import { forwardRef } from 'react'
import { useFormContext } from 'react-hook-form'
import { capitalize } from '@utils/helpers'
import type { FieldValidations, InputFieldProps } from '../../Field.types'
import './inputfield.module.scss'

const InputField = forwardRef<HTMLInputElement, InputFieldProps>(({
	disabled,
	handleChange,
	name,
	onValidation = () => {},
	placeholder,
	type,
	...props
}, ref) => {
	const { register } = useFormContext()

	const placehold = placeholder ?? capitalize(name)

	return (
		<input
			{ ...register(name, {
				onChange: handleChange,
				...onValidation(type as FieldValidations)
			}) }
			className="field__input"
			disabled={ disabled }
			id={ name }
			placeholder={ placehold }
			type={ type }
			{ ...ref && Object.hasOwn(ref, 'current') && { ref } }
			{ ...props }
		/>
	)
})

InputField.displayName = 'InputField'
export { InputField }
