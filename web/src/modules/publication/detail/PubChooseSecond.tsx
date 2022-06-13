/** @jsxImportSource @emotion/react */
import { FC, useCallback } from 'react';
import { css } from '@emotion/react';

import ModalDialog from 'components/modal';
import Button from 'components/styled/Button';
import Paper from 'components/styled/Paper';
import { Box, Flex } from 'components/styled';
import Pagination from 'components/table/Pagination';
import Divider from 'components/styled/Divider';

import ListView from 'modules/searchResult/list';

import { useTheme } from 'theme';

import { useSearchPublications } from 'api/publicationsApi';

import { useSearchContext } from 'hooks/useSearchContext';

const PubChooseSecond: FC<{ onClose: () => void; variant: 'left' | 'right' }> =
	({ onClose, variant }) => {
		const { state, dispatch } = useSearchContext();
		const { data, count, isLoading, hasMore, statistics } =
			useSearchPublications({
				start: state.start,
				pageSize: state.pageSize,
				...state.searchQuery,
			});

		const changePage = useCallback(
			(page: number) => dispatch?.({ type: 'setPage', page }),
			[dispatch],
		);

		const setPageLimit = useCallback(
			(pageSize: number) => dispatch?.({ type: 'setPageSize', pageSize }),
			[dispatch],
		);
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
