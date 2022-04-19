import { FC, useMemo } from 'react';

import { useSearchPublications } from 'api/publicationsApi';

import { useSearchContext } from 'hooks/useSearchContext';

import ListView from './list';
import TileView from './tiles';
import useAdminFilter from './list/useAdminFilter';

const Results: FC = () => {
	const { state } = useSearchContext();

	const { params, filters, sort } = useAdminFilter();
	const offset = useMemo(
		() => filters.page * (state?.pageSize ?? 15),
		[filters.page, state?.pageSize],
	);

	const { data, count, isLoading, hasMore } = useSearchPublications({
		...params,
		offset,
		size: state?.pageSize ?? 15,
	});

	switch (state?.viewMode ?? 'list') {
		case 'list':
			return (
				<ListView
					data={data}
					count={count}
					isLoading={isLoading}
					hasMore={hasMore}
				/>
			);
		case 'tiles':
			return <TileView />;

		default:
			return <>ine zobrazenie</>;
	}
};

export default Results;
