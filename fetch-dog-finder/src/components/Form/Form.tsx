import {
	Children,
	cloneElement,
	isValidElement,
	type FunctionComponent,
	type ReactElement,
} from 'react'
import clsx from 'clsx'
import { FormProvider, useForm } from 'react-hook-form'
import { Button } from '@components/Button'
import type { FieldProps, FieldValidations } from '@components/Field'
import type { FormProps, FormValues } from './Form.types'
import './form.module.scss'

const Form = ({
	buttonText,
	children,
	className,
	error,
	id,
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

	const classes = clsx({
		form: true,
		[`${className}`]: className,
	})

	if (!children)
		return <></>

	return (
		<FormProvider { ...methods }>
			<form
				className={ classes }
				id={ id }
				noValidate={ role === 'search' }
				onSubmit={ handleSubmit(onSubmit) }
				role={ role }
			>
				{ Children.map(children, child => {
					if (!isValidElement(child))
						return null

					const childEl = child as ReactElement<FieldProps>
					const { type: childType } = childEl,
						{ displayName } = childType as FunctionComponent

					return displayName === 'Field'
						? cloneElement(childEl, { onValidation: handleValidation })
						: child
				}) }

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
