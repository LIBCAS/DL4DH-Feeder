import { useState } from 'react';

import { Flex } from 'components/styled';
import Pagination from 'components/table/Pagination';

import TileView from 'modules/searchResult/tiles/TileView';

import { PublicationDto } from 'api/models';

import Store from 'utils/Store';

const MAX_VISITED_COUNT = 24;

export const getVisited = () => {
	try {
		return JSON.parse(
			Store.get(Store.keys.VisitedPublications) as string,
		) as PublicationDto[];
	} catch (error) {
		console.log(error);
		return [];
	}
};

export const updateVisited = (publication: PublicationDto) => {
	let visited = getVisited();
	const oldIndex = visited.findIndex(v => v.pid === publication.pid);
	if (oldIndex >= 0) {
		visited.splice(oldIndex, 1);
	}
	visited = [publication, ...visited];
	if (visited.length > MAX_VISITED_COUNT) {
		visited.pop();
	}
	Store.set(Store.keys.VisitedPublications, JSON.stringify(visited));
};

const VisitedHomepageFeed = () => {
	const data = getVisited();
	const [page, setPage] = useState(1);
	const pageLimit = 6;
	const count = data.length ?? 0;
	const pagesCount = Math.ceil(count / pageLimit);
	const hasMore = page < pagesCount;
	return (
		<Flex flexDirection="column">
			<TileView
				data={data.slice(
					pageLimit * (page - 1),
					pageLimit * (page - 1) + pageLimit,
				)}
				noResultsMsg={<></>}
			/>
			<Flex width={1} mt={4} alignItems="center" justifyContent="center">
				<Flex>
					{count > pageLimit && (
						<Pagination
							page={page}
							changePage={setPage}
							changeLimit={() => null}
							pageLimit={pageLimit}
							loading={false}
							offset={pageLimit * (page - 1)}
							hasMore={hasMore}
							totalCount={count}
							hideLimitOptions
						/>
					)}
				</Flex>
			</Flex>
		</Flex>
	);
};

export default VisitedHomepageFeed;
