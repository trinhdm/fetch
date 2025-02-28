import { BiArrowBack, BiExpandVertical } from 'react-icons/bi'
import { matchPath, useLocation } from 'react-router'
import { usePageContext } from '@providers/PageProvider'
import { Button } from '@components/Button'
import { Menu } from '@components/Menu'
import type { PaginationProps } from './Pagination.types'
import './pagination.module.scss'

const Pagination = ({
	current,
	handleChangePage,
}: PaginationProps) => {
	const { pathname } = useLocation()
	const { total: { pages } } = usePageContext()!

	const isFavoritesPath = matchPath('/favorites', pathname)
	const total = pages > 0 ? pages : 1

	if (isFavoritesPath) {
		return (
			<nav className="pagination">
				<Button
					hideTextMobile
					className="pagination__back"
					href="/"
					type="link"
					variant="outline"
				>
					<BiArrowBack />
					Back to Directory
				</Button>
			</nav>
		)
	}

	return (
		<nav className="pagination">
			<Button
				hideTextMobile
				className="pagination__prev"
				disabled={ current === 1 }
				onClick={ () => handleChangePage(current - 1) }
				variant="outline"
			>
				<BiArrowBack />
				Previous
			</Button>

			<span className="pagination__indicator">
				<span className="pagination__label">
					Page:
				</span>

				<Menu className="pagination__menu">
					<Menu.Toggle>
						{ current } <BiExpandVertical />
					</Menu.Toggle>
					{ Array.from(Array(total).keys()).map(page => {
						const pgNum = page + 1

						return (
							<Menu.Item
								isActive={ current === pgNum }
								key={ `page-${pgNum}` }
								onClick={ () => handleChangePage(pgNum) }
							>
								{ pgNum }
							</Menu.Item>
						)
					}) }
				</Menu>

				<span>/</span>

				<span className="pagination__total">
					{ total }
				</span>
			</span>

			<Button
				hideTextMobile
				className="pagination__next"
				disabled={ current === total }
				onClick={ () => handleChangePage(current + 1) }
				variant="outline"
			>
				Next
				<BiArrowBack />
			</Button>
		</nav>
	)
}

Pagination.displayName = 'Pagination'
export { Pagination }
