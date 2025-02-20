import type { ReactNode } from 'react'

interface ModalProps {
	children: ReactNode
	handleModal: () => void
}

interface ModalSectionProps {
	children: ReactNode
	handleModal?: () => void
}

export type { ModalProps, ModalSectionProps }
