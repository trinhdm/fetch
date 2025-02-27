import { BiSlider, BiSolidDog } from 'react-icons/bi'
import { usePageContext } from '@providers/PageProvider'
import { Card } from '@components/Card'


const Directory = () => {
	const {
		dogs,
		title,
		total,
		view,
	} = usePageContext()!

	return (
		<>
			<hgroup className="heading">
				<h1 className="heading__title">{ title }</h1>
				<span className="heading__count">({ total.items })</span>
			</hgroup>

			<section className="description">
				<p>Browse through our network of paw-fect dogs and favorite the ones that steal your heart. Use the <b>Filter & Sort <BiSlider /></b> button above to narrow your search by breed, age, and location. Once you've built your list, click <b>Find Your Match <BiSolidDog /></b>, and we'll pair you with your ideal furry companion.</p>
				<p>You deserve a best friend, and every good pup deserves a loving home.</p>
			</section>

			<section className="directory">
				{ !dogs?.length && (
					<p>
						<i>{ dogs === null
							? `Fetching the best pups for you... Hang tight while we round up some furry friends!`
							: `Looks like we couldn’t find a match! Try widening your search criteria — your perfect pup might be just a few clicks away.`
						}</i>
					</p>
				) }
				{ dogs?.map(dog => (
					<Card
						{ ...dog }
						key={ dog.id }
						variant={ view.layout === 'Grid' ? 'vertical' : 'horizontal' }
					/>
				)) }
			</section>
		</>
	)
}

Directory.displayName = 'Directory'
export { Directory }
