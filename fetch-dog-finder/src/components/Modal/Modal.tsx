import { forwardRef } from 'react'
import { BiX } from 'react-icons/bi'
import { getChildrenByDisplayName } from '@utils/children'
import { Button } from '@components/Button'
import { Header } from '@components/Header'
import { Footer } from '@components/Footer'
import type { ModalProps, ModalSectionProps } from './Modal.types'
import './modal.module.scss'

const Modal = forwardRef<HTMLDialogElement, ModalProps>(({
	children,
	handleModal,
}, ref) => {
	const getSubComponent = (
		targetName: string
	) => getChildrenByDisplayName({
		children,
		props: { handleModal },
		targetName,
	})

	return (
		<dialog className="modal" ref={ ref }>
			{ getSubComponent('ModalHeader') }
			{ getSubComponent('ModalContent') }
			{ getSubComponent('ModalFooter') }
		</dialog>
	)
})

const ModalHeader = ({
	children,
	handleModal = () => {},
}: ModalSectionProps) => (
	<Header className="modal__header">
		<h2>{ children }</h2>
		<Button
			className="modal__close"
			onClick={ handleModal }
			variant="icon"
		>
			<BiX />
		</Button>
	</Header>
)

const ModalContent = ({ children }: ModalSectionProps) => (
	<div className="modal__content">
		{ children }
	</div>
)

const ModalFooter = ({ children }: ModalSectionProps) => (
	<Footer className="modal__footer">
		{ children }
	</Footer>
)

ModalHeader.displayName = 'ModalHeader'
ModalContent.displayName = 'ModalContent'
ModalFooter.displayName = 'ModalFooter'

const ModalNamespace = Object.assign(Modal, {
	Header: ModalHeader,
	Content: ModalContent,
	Footer: ModalFooter,
})

ModalNamespace.displayName = 'Modal'

export { ModalNamespace as Modal }
