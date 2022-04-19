/** @jsxImportSource @emotion/react */
import { css } from '@emotion/react';
import { FC, useCallback, useMemo } from 'react';

import Pagination from 'components/table/Pagination';
import { Wrapper } from 'components/styled/Wrapper';
import { Flex } from 'components/styled';

import { Loader } from 'modules/loader';

import { theme } from 'theme';

import { useSearchPublications } from 'api/publicationsApi';

import { useSearchContext } from 'hooks/useSearchContext';

import ListView from './list';
import TileView from './tiles';
import useAdminFilter from './list/useAdminFilter';

const Results: FC = () => {
	const { state, dispatch } = useSearchContext();

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

	const setPageLimit = useCallback(
		(p: number) => dispatch?.({ type: 'setPageSize', pageSize: p }),
		[dispatch],
	);

	return (
		<Wrapper>
			{state?.viewMode === 'list' ? (
				<>
					<ListView
						data={data}
						count={count}
						isLoading={isLoading}
						hasMore={hasMore}
					/>
				</>
			) : (
				<Wrapper overflowY="auto">
					{isLoading ? <Loader /> : <TileView data={data} />}
				</Wrapper>
			)}
			<Flex
				position="sticky"
				bottom={0}
				mt={2}
				p={3}
				css={css`
					border-top: 1px solid ${theme.colors.border};
				`}
			>
				<Pagination
					page={filters.page}
					changePage={filters.setPage}
					changeLimit={setPageLimit}
					pageLimit={state?.pageSize ?? 15}
					totalCount={count}
					hasMore={hasMore}
					offset={offset}
					loading={isLoading}
				/>
			</Flex>
		</Wrapper>
	);
};

export default Results;
