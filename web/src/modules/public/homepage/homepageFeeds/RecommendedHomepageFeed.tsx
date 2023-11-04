import { useQuery } from 'react-query';
import { useState } from 'react';

import Pagination from 'components/table/Pagination';
import { Flex } from 'components/styled';

import { Loader } from 'modules/loader';
import TileView from 'modules/searchResult/tiles/TileView';

import { api } from 'api';

import { PublicationsListDto } from 'api/models';

const RecommendedHomepageFeed = () => {
	const { data, isLoading } = useQuery('home-feed-reccomended', () =>
		api().get('feed/custom').json<PublicationsListDto>(),
	);

	const [page, setPage] = useState(1);
	const pageLimit = 6;
	const count = data?.numFound ?? 0;
	const pagesCount = Math.ceil(count / pageLimit);
	const hasMore = page < pagesCount;

	if (isLoading) {
		return <Loader />;
	}
	return (
		<Flex flexDirection="column">
			<TileView
				disableExportMode
				data={data?.docs.slice(
					pageLimit * (page - 1),
					pageLimit * (page - 1) + pageLimit,
				)}
			/>
			<Flex width={1} mt={4} alignItems="center" justifyContent="center">
				<Flex>
					<Pagination
						page={page}
						changePage={setPage}
						changeLimit={() => null}
						pageLimit={pageLimit}
						loading={isLoading}
						offset={pageLimit * (page - 1)}
						hasMore={hasMore}
						totalCount={count}
						hideLimitOptions
					/>
				</Flex>
			</Flex>
		</Flex>
	);
};

export default RecommendedHomepageFeed;
