
interface ButtonBase {
	children: string
	className?: string
	// onClick?: (event:
	// 	| MouseEvent<HTMLAnchorElement, MouseEvent>
	// 	| MouseEvent<HTMLButtonElement, MouseEvent>
	// 	| MouseEvent<HTMLInputElement, MouseEvent>
	// ) => void
	// type?: 'button' | 'submit'
}

interface ButtonType extends ButtonBase {
	onClick?: (event: React.MouseEvent<HTMLButtonElement, MouseEvent>) => void
	type?: 'button'
}

interface ButtonSubmit extends ButtonBase {
	onClick?: (event: React.MouseEvent<HTMLInputElement, MouseEvent>) => void
	type: 'submit'
}

type ButtonProps = ButtonType | ButtonSubmit

export type {
	ButtonProps,
	ButtonSubmit,
	ButtonType,
}
