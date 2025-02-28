import {
	Children,
	cloneElement,
	isValidElement,
	MutableRefObject,
	type FunctionComponent,
	type ReactElement,
	type ReactNode,
} from 'react'


export const getChildrenByDisplayName = <P extends object>({
	children,
	props,
	targetName,
}: {
	children: ReactNode
	props?: P
	targetName: string
}) => Children.map(children, child => {
	if (!isValidElement(child))
		return null

	const { props: childProps, type } = child as ReactElement<P>
	const { displayName } = type as FunctionComponent

	if (displayName !== targetName)
		return null

	let childEl = child

	if (props && !!Object.keys(props).length) {
		const updatedProps = { ...childProps, ...props }
		childEl = cloneElement(child, { ...updatedProps })
	}

	return childEl
}) as ReactElement<P> | null


// timeouts

export const debounce = (
	callback: () => void,
	ref: MutableRefObject<NodeJS.Timeout | null> | null = null,
	delay = 250
) => {
	let debounceID = ref?.current

	if (debounceID)
		clearTimeout(debounceID)

	debounceID = setTimeout(callback, delay)
}
