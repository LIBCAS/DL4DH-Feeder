import { useState } from 'react';

import { Flex } from 'components/styled';
import Pagination from 'components/table/Pagination';

import { Loader } from 'modules/loader';
import TileView from 'modules/searchResult/tiles/TileView';

import { useSearchPublications } from 'api/publicationsApi';

const NewestHomepageFeed = () => {
	const [page, setPage] = useState(1);
	const pageLimit = 6;

	const { data, isLoading, hasMore, count } = useSearchPublications({
		start: (page - 1) * pageLimit,
		pageSize: pageLimit,
		availability: 'PUBLIC',
		query: '',
		enrichment: 'ENRICHED',
		sort: 'LAST_ENRICHED',
	});

	if (isLoading) {
		return <Loader />;
	}
	return (
		<Flex flexDirection="column">
			<TileView data={data} />
			<Flex width={1} mt={4} alignItems="center" justifyContent="center">
				<Flex>
					{count > pageLimit && (
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
					)}
				</Flex>
			</Flex>
		</Flex>
	);
};

export default NewestHomepageFeed;
