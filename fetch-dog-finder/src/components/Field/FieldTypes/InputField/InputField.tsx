import { useFormContext } from 'react-hook-form'
import { capitalize } from '@utils/helpers'
import type { FieldValidations, InputFieldProps } from '../../Field.types'
import './inputfield.module.scss'

const InputField = ({
	disabled,
	handleChange,
	name,
	onValidation = () => {},
	placeholder,
	type,
	...props
 }: InputFieldProps) => {
	const {
		formState: { errors },
		register,
	} = useFormContext()

	const error = errors[name],
		placehold = placeholder ?? capitalize(name)

	return (
		<>
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
				{ ...props }
			/>

			{ error && (
				<span className="field__message">
					{ error.message?.toString() }
				</span>
			) }
		</>
	)
}

InputField.displayName = 'InputField'
export { InputField }
