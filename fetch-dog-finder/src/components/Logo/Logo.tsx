import logoIcon from '/logo-icon-purple.svg'
import './logo.module.scss'

const Logo = ({
	alt = 'Fetch logo'
}) => {
	return (
		<a
			className="logo"
			href="https://fetch.com/"
			target="_blank"
		>
			<img src={ logoIcon } alt={ alt } />
		</a>
	)
}

Logo.displayName = 'Logo'
export { Logo }
