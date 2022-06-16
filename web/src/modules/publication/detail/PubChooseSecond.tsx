/** @jsxImportSource @emotion/react */
import { FC, useCallback, useState } from 'react';
import { css } from '@emotion/react';

import Button from 'components/styled/Button';
import Paper from 'components/styled/Paper';
import { Flex } from 'components/styled';
import Pagination from 'components/table/Pagination';
import Divider from 'components/styled/Divider';

import SplitScreenView from 'modules/searchResult/list/SplitScreenView';
import QuerySearchInput from 'modules/public/mainSearch/QuerySearchInput';

import { useTheme } from 'theme';

import { useSearchPublications } from 'api/publicationsApi';

const PubChooseSecond: FC<{ onClose: () => void; variant: 'left' | 'right' }> =
	({ onClose, variant }) => {
		const [query, setQuery] = useState<string | undefined>('');
		const [page, setPage] = useState(0);
		const [pageLimit, setPageLimit] = useState(30);
		const handleQueryChange = (query: string) => setQuery(query);

		const { data, count, isLoading, hasMore } = useSearchPublications({
			start: page * pageLimit,
			pageSize: pageLimit,
			query,
		});

		const changePage = useCallback((page: number) => setPage(page), [setPage]);

		const theme = useTheme();

		return (
			<>
				<Paper
					position="absolute"
					right={variant == 'left' ? 'initial' : 0}
					left={variant == 'right' ? 'initial' : 0}
					top={-8}
					width={700}
					height="calc(100vh - 60px)"
					zIndex={3}
					css={css`
						${variant === 'right' &&
						css`
							border-left: 3px solid ${theme.colors.border};
						`}

						${variant === 'left' &&
						css`
							border-right: 3px solid ${theme.colors.border};
						`}

						box-shadow: -10px 0px 10px 3px rgba(0, 0, 0, 0.1);
					`}
				>
					<Flex px={2}>
						<QuerySearchInput onQueryUpdate={handleQueryChange} />
					</Flex>
					<Flex height={'70vh'} width={1} position="relative">
						<SplitScreenView
							data={data}
							isLoading={isLoading}
							variant={variant}
						/>
					</Flex>
					<Divider my={3} />
					<Pagination
						page={page}
						changePage={changePage}
						changeLimit={limit => setPageLimit(limit)}
						pageLimit={pageLimit}
						totalCount={count}
						hasMore={hasMore}
						offset={page * pageLimit}
						loading={isLoading}
					/>
					<Divider my={3} />
					<Flex justifyContent="space-between" alignItems="center">
						<Button variant="primary" onClick={onClose}>
							Potvrdit výběr
						</Button>
						<Button variant="outlined" onClick={onClose}>
							Zavřít
						</Button>
					</Flex>
				</Paper>
			</>
		);
	};

export default PubChooseSecond;

{
	/*



<>
			<ModalDialog
				label="Info"
				control={openModal => (
					<Button variant="primary" onClick={openModal} p={1}>
						Mnozina
					</Button>
				)}
				customCss={() => css`
					width: 80vw;
					margin-top: 0 !important;
				`}
			>
				{closeModal => (
					<Paper>
						<Flex height={'80vh'} width={1} position="relative">
							<ListView data={data} isLoading={isLoading} />
						</Flex>
						<Divider my={3} />
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
						<Divider my={3} />
						<Flex justifyContent="space-between">
							<Button variant="primary">Zpět</Button>
							<Button variant="primary">Použít</Button>
						</Flex>
					</Paper>
				)}
			</ModalDialog>
		</>










*/
}
