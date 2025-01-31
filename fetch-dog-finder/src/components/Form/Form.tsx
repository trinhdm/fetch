import clsx from 'clsx'
import { useForm } from 'react-hook-form'
import type {
	FieldValues,
	FormProps,
	FormValues,
} from './Form.types'
import './form.module.scss'

const Form = ({
	buttonText = 'Log In',
	children,
	fields,
	onSubmit,
 }: FormProps) => {
	const {
		formState: { errors },
		handleSubmit,
		register,
	} = useForm<FormValues>()

	const handleValidation = (field: FieldValues['type']) => {
		const pattern = {
			email: {
				message: 'Email is invalid.',
				value: /^[a-zA-Z0-9_.+-]+@[a-zA-Z0-9-]+\.[a-zA-Z0-9-.]+/,
			},
			text: {
				message: 'Name cannot start with a number.',
				value: /^[\w\-\s]+/,
			},
		}[field]

		const required = 'This field is required.',
			validation = { required, pattern }

		return validation
	}

	if (!fields?.length) return

	return (
		<>
			{ children }

			<form onSubmit={ handleSubmit(onSubmit) }>
				{ fields.map(({ name, type }) => {
					const error = errors[name],
						placeholder = name.charAt(0).toUpperCase() + name.slice(1)

					const classes = clsx({
						'field': true,
						'field--error': error,
					})

					return (
						<div className={ classes } key={ placeholder }>
							<label className="field__label" htmlFor={ name }>
								{ placeholder }
							</label>
							<input
								{ ...register(name, handleValidation(type)) }
								aria-label={ placeholder }
								autoComplete="on"
								className="field__input"
								placeholder={ placeholder }
								tabIndex={ 0 }
								type={ type }
							/>
							{ error && (
								<span className="field__message">
									{ error.message }
								</span>
							) }
						</div>
					)
				}) }

				<input
					hidden
					aria-hidden="true"
					className="field__honeypot"
					tabIndex={ -1 }
					type="text"
				/>

				<input
					className="form__button"
					type="submit"
					value={ buttonText }
				/>
			</form>
		</>
	)
}

Form.displayName = 'Form'
export { Form }
