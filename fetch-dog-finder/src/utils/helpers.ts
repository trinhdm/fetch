
export const capitalize = (
	word: string
) => word.charAt(0).toUpperCase() + word.slice(1)

export const slugify = (
	str: string
) => str.toLowerCase()
		.replace(/^\s+|\s+$/g, '')
		.replace(/[^a-z0-9 -]/g, '')
		.replace(/\s+/g, '-')
		.replace(/-+/g, '-')
