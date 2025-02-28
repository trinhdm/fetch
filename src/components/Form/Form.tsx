import clsx from 'clsx'
import { getChildrenByDisplayName } from '@utils/children'
import { FormProvider, useForm } from 'react-hook-form'
import { Button } from '@components/Button'
import type { FieldValidations } from '@components/Field'
import type { FormProps, FormValues } from './Form.types'
import './form.module.scss'

const Form = ({
	buttonText,
	children,
	className,
	disabled,
	error,
	id,
	onSubmit = () => {},
	role = 'form',
 }: FormProps) => {
	const methods = useForm<FormValues>()
	const { handleSubmit } = methods

	const classes = clsx('form', className)

	const getSubComponent = (
		targetName: string
	) => getChildrenByDisplayName({
		children,
		props: {
			disabled,
			onValidation: handleValidation,
		},
		targetName,
	})

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

	if (!children)
		return null

	return (
		<FormProvider { ...methods }>
			<form
				className={ classes }
				id={ id }
				noValidate={ role === 'search' }
				onSubmit={ handleSubmit(onSubmit) }
				role={ role }
			>
				{ getSubComponent('Field') }

				<input
					hidden
					aria-hidden="true"
					className="field__honeypot"
					name={ `${id}-honeypot` }
					tabIndex={ -1 }
					type="email"
				/>

				{ !!buttonText && (
					<Button className="form__button" type="submit">
						{ buttonText }
					</Button>
				) }

				{ error && <span className="form__error">{ error }</span> }
			</form>
		</FormProvider>
	)
}

Form.displayName = 'Form'
export { Form }
