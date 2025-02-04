import { useForm, FormProvider } from 'react-hook-form'
import { Button } from '@components/Button'
import { Field, type FieldValidations } from '@components/Field'
import type { FormProps, FormValues } from './Form.types'
import './form.module.scss'

const Form = ({
	buttonText,
	children,
	fields,
	onSubmit = () => {},
	role = 'form',
 }: FormProps) => {
	const methods = useForm<FormValues>()
	const { handleSubmit } = methods

	const handleValidation = (fieldType: FieldValidations) => {
		const pattern = {
			email: {
				message: 'Email is invalid.',
				value: /^[a-zA-Z0-9_.+-]+@[a-zA-Z0-9-]+\.[a-zA-Z0-9-.]+/,
			},
			number: {
				message: 'Field can only contain numbers.',
				value: /^[0-9]*$/,
			},
			search: {
				message: 'Field can only contain letters.',
				value: /^[\w\-\s]+/,
			},
			text: {
				message: 'Name cannot start with a number.',
				value: /^[\w\-\s]+/,
			},
		}[fieldType]

		const required = 'This field is required.',
			validation = { required, pattern }

		return validation
	}

	if (!fields?.length) return

	return (
		<FormProvider { ...methods }>
			{ children }

			<form
				noValidate={ role === 'search' }
				className="form"
				onSubmit={ handleSubmit(onSubmit) }
				{ ...(role === 'search' ? { role } : {}) }
			>
				{ fields.map(field => (
					<Field
						{ ...field }
						key={ field.name }
						onValidation={ handleValidation }
					/>
				)) }

				<input
					hidden
					aria-hidden="true"
					className="field__honeypot"
					tabIndex={ -1 }
					type="text"
				/>

				{ !!buttonText && (
					<Button className="form__button" type="submit">
						{ buttonText }
					</Button>
				) }
			</form>
		</FormProvider>
	)
}

Form.displayName = 'Form'
export { Form }
