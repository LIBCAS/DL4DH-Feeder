/** @jsxImportSource @emotion/react */
import { css } from '@emotion/react';
import { FC, useCallback } from 'react';
import { useSearchParams } from 'react-router-dom';

import Pagination from 'components/table/Pagination';
import { Wrapper } from 'components/styled/Wrapper';
import { Flex } from 'components/styled';

import { Loader } from 'modules/loader';

import { theme } from 'theme';

import { AvailableFilters, PublicationDto } from 'api/models';

import { useSearchContext } from 'hooks/useSearchContext';

import ListView from './list';
import TileView from './tiles/TileView';
import GraphView from './graph';

type Props = {
	data: PublicationDto[] | undefined;
	count: number;
	isLoading: boolean;
	hasMore: boolean;
	stats: AvailableFilters | undefined;
};

const Results: FC<Props> = ({ data, count, isLoading, hasMore, stats }) => {
	const { state, dispatch } = useSearchContext();
	const [sp, setSp] = useSearchParams();

	const changePage = useCallback(
		(page: number) => {
			sp.set('page', page.toString());
			setSp(sp);
		},
		[sp, setSp],
	);

	const currentPage = parseInt(sp.get('page') ?? '1') ?? 1;

	const setPageLimit = useCallback(
		(pageSize: number) => dispatch?.({ type: 'setPageSize', pageSize }),
		[dispatch],
	);

	return (
		<Wrapper>
			{state?.viewMode === 'list' ? (
				<>
					<ListView data={data} isLoading={isLoading} />
				</>
			) : (
				<>
					{state?.viewMode === 'tiles' ? (
						<Wrapper overflowY="auto" overflowX="hidden">
							{isLoading ? <Loader /> : <TileView data={data} />}
						</Wrapper>
					) : (
						<Wrapper overflowY="auto" overflowX="hidden">
							{isLoading || !stats ? <Loader /> : <GraphView data={stats} />}
						</Wrapper>
					)}
				</>
			)}
			{state?.viewMode !== 'graph' && (
				<Flex
					position="sticky"
					bottom={0}
					px={2}
					py={1}
					css={css`
						border-top: 1px solid ${theme.colors.border};
					`}
					bg="white"
				>
					<Pagination
						page={currentPage}
						changePage={changePage}
						changeLimit={setPageLimit}
						pageLimit={state.pageSize}
						totalCount={count}
						hasMore={hasMore}
						offset={state.start}
						loading={isLoading}
						stored
					/>
				</Flex>
			)}
		</Wrapper>
	);
};

export default Results;
