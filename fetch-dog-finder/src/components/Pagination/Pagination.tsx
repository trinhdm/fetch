import { BiArrowBack, BiExpandVertical } from 'react-icons/bi'
import { Button } from '@components/Button'
import { Menu } from '@components/Menu'
import type { PaginationProps } from './Pagination.types'
import './pagination.module.scss'

const Pagination = ({
	current,
	handleChangePage,
	total,
}: PaginationProps) => {
	if (total === 0) return <></>

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
					{ Array.from(Array(total).keys()).map(pgNum => (
						<Menu.Item key={ `page-${pgNum}` } onClick={ () => handleChangePage(pgNum + 1) }>
							{ pgNum + 1 }
						</Menu.Item>
					)) }
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
