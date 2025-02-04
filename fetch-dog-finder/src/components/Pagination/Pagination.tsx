import { BiArrowBack, BiExpandVertical } from 'react-icons/bi'
import { Button } from '@components/Button'
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
				className="pagination__prev"
				disabled={ current === 1 }
				onClick={ () => handleChangePage(current - 1) }
				variant="outline"
			>
				<BiArrowBack />
				Previous
			</Button>

			<span className="pagination__indicator">
				{/* <span className="pagination__label">
					Page:
				</span> */}
				<span className="pagination__select">
					<span className="pagination__current">
						{ current }
						{ total > 1 && <BiExpandVertical /> }
					</span>

					{ total > 1 && (
						<ul className="dropdown pagination__dropdown">
							{ Array.from(Array(total).keys()).map(pgNum => (
								<li className="dropdown__item" key={ `page-${pgNum}` }>
									<span onClick={ () => handleChangePage(pgNum + 1) }>
										{ pgNum + 1 }
									</span>
								</li>
							)) }
						</ul>
					) }
				</span>

				<span>/</span>

				<span className="pagination__total">
					{ total }
				</span>
			</span>

			<Button
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
