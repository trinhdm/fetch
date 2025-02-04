interface PaginationProps {
	current: number
	handleChangePage: (pg: number) => void
	total: number
}

export type { PaginationProps }
