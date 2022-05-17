/** @jsxImportSource @emotion/react */
import { css } from '@emotion/react';
import { FC, useCallback } from 'react';

import Pagination from 'components/table/Pagination';
import { Wrapper } from 'components/styled/Wrapper';
import { Flex } from 'components/styled';

import { Loader } from 'modules/loader';

import { theme } from 'theme';

import { PublicationDto } from 'api/models';

import { useSearchContext } from 'hooks/useSearchContext';

import ListView from './list';
import TileView from './tiles';
import GraphView from './graph';

type Props = {
	data: PublicationDto[] | undefined;
	count: number;
	isLoading: boolean;
	hasMore: boolean;
};

const Results: FC<Props> = ({ data, count, isLoading, hasMore }) => {
	const { state, dispatch } = useSearchContext();

	const changePage = useCallback(
		(page: number) => dispatch?.({ type: 'setPage', page }),
		[dispatch],
	);

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
							{isLoading || !data ? <Loader /> : <GraphView data={data} />}
						</Wrapper>
					)}
				</>
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
					page={state.page}
					changePage={changePage}
					changeLimit={setPageLimit}
					pageLimit={state.pageSize}
					totalCount={count}
					hasMore={hasMore}
					offset={state.start}
					loading={isLoading}
				/>
			</Flex>
		</Wrapper>
	);
};

export default Results;
