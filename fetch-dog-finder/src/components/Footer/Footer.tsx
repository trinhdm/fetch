import clsx from 'clsx'
import type { FooterProps } from './Footer.types'
import './footer.module.scss'

const Footer = ({
	children,
	className,
}: FooterProps) => {
	const classes = clsx({
		footer: true,
		[`${className}`]: className,
	})

	return (
		<footer className={ classes }>
			<div className="footer__wrapper">
				{ children }
			</div>
		</footer>
	)
}

Footer.displayName = 'Footer'
export { Footer }
