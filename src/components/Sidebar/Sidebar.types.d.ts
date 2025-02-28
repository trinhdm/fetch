import type { FieldChangeHandler, FieldSelectHandler } from '@components/Field'

interface SidebarProps {
	updateAge: FieldChangeHandler
	updateBreeds: FieldSelectHandler
	updateLocation: FieldChangeHandler
	updateSort: FieldChangeHandler
	updateView: FieldChangeHandler
}

export type { SidebarProps }
