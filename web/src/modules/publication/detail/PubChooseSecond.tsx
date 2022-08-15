/** @jsxImportSource @emotion/react */
import {
	FC,
	useCallback,
	useContext,
	useEffect,
	useMemo,
	useState,
} from 'react';
import { css } from '@emotion/react';
import { useNavigate, useParams, useSearchParams } from 'react-router-dom';

import Button from 'components/styled/Button';
import Paper from 'components/styled/Paper';
import { DetailsCell, Flex } from 'components/styled';
import Pagination from 'components/table/Pagination';
import Divider from 'components/styled/Divider';
import QuerySearchInput from 'components/search/QuerySearchInput';
import { H2 } from 'components/styled/Text';
import { Wrapper } from 'components/styled/Wrapper';

import SplitScreenView from 'modules/searchResult/list/SplitScreenView';
import { Loader } from 'modules/loader';
import PeriodicalTiles from 'modules/searchResult/tiles/PeriodicalTileView';

import { useTheme } from 'theme';

import {
	usePublicationChildren,
	usePublicationDetail,
	useSearchPublications,
} from 'api/publicationsApi';
import { PublicationDto } from 'api/models';

import useHeaderHeight from 'utils/useHeaderHeight';

import { PubCtx } from '../ctx/pub-ctx';

const PubChooseSecond: FC<{ onClose: () => void; variant: 'left' | 'right' }> =
	({ onClose, variant }) => {
		const [query, setQuery] = useState<string | undefined>('');
		const { id, id2 } = useParams<{ id: string; id2: string }>();
		const nav = useNavigate();
		const [page, setPage] = useState(0);
		const [pageLimit, setPageLimit] = useState(30);
		const handleQueryChange = (query: string) => {
			setPage(0);
			setQuery(query);
		};
		const [publicOnly, setPublicOnly] = useState<boolean>(true);
		const [sp, setSp] = useSearchParams();
		const [uuid, setUUID] = useState('');
		const [step, setStep] = useState(0);
		const headerHeight = useHeaderHeight();
		const onSelect = (uuid: string) => {
			setUUID(uuid);
		};

		console.log({ params: useParams() });

		const handleSecond = () => {
			//sp.set('secondPublication', uuid);
			//setSp(sp);
			setStep(1);
			//nav(`/multiview/${id}/${uuid}`);
			//onClose();
		};

		const { data, count, isLoading, hasMore } = useSearchPublications({
			start: page * pageLimit,
			pageSize: pageLimit,
			availability: publicOnly ? 'PUBLIC' : 'ALL',
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
					width="50vw"
					height={`calc(100vh - ${headerHeight}px)`}
					zIndex={3}
					overflow="auto"
					css={css`
						box-sizing: border-box;
						padding-bottom: 0px !important;
						padding: 0px !important;
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
					{step === 0 ? (
						<>
							<Flex p={2}>
								<QuerySearchInput
									onQueryUpdate={handleQueryChange}
									publicOnly={publicOnly}
									setPublicOnly={setPublicOnly}
								/>
							</Flex>
							<Flex height={'70vh'} width={1} position="relative">
								<SplitScreenView
									data={data}
									isLoading={isLoading}
									variant={variant}
									onSelect={onSelect}
								/>
							</Flex>
							<Flex p={2}>
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
							</Flex>
						</>
					) : (
						<Flex px={2}>
							<ChoosePeriodical id={uuid} />
						</Flex>
					)}
					<Flex
						justifyContent="space-between"
						alignItems="center"
						position="sticky"
						bottom={0}
						bg="paper"
						p={3}
						mt={2}
						css={css`
							/* border-top: 1px solid black; */
							box-shadow: 0px -13px 16px -8px rgb(0 0 0 / 6%);
						`}
					>
						<Button variant="primary" onClick={handleSecond}>
							Potvrdit výběr
						</Button>
						<Button variant="outlined" onClick={() => setStep(0)}>
							Zpět
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

const ChoosePeriodical: FC<{ id: string }> = ({ id: rootId }) => {
	const { id: leftId } = useParams<{ id: string }>();

	const [id, setId] = useState(rootId);
	const childrenResponse = usePublicationChildren(id ?? '');
	const detail = usePublicationDetail(id ?? '');
	const children = childrenResponse.data ?? [];
	const [page, setPageUrlParam] = useSearchParams();
	const pubCtx = useContext(PubCtx);
	const nav = useNavigate();

	const pageId = useMemo(
		() => page.get('page') ?? children[0]?.pid ?? undefined,
		[page, children],
	);

	/* useEffect(() => {
		const childIndex = pages.findIndex(p => p.pid === pageId);
		pubCtx.setCurrentPage({
			uuid: pageId ?? '',
			childIndex,
			prevPid: pages[childIndex - 1]?.pid,
			nextPid: pages[childIndex + 1]?.pid,
		});
		pubCtx.setPublicationChildren(pages);

		if (detail?.data) {
			const context = detail.data?.context?.flat() ?? [];
			pubCtx.setPublication({
				...detail.data,
				context,
			});
		}

		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, [pages, pageId]); */

	/* useEffect(() => {
		if (childrenResponse.isSuccess && !childrenResponse.data?.[0]?.datanode) {
			nav(`/periodical/${id}`, { replace: true });
		}
	}, [childrenResponse.data, nav, childrenResponse.isSuccess, id]); */

	if (childrenResponse.isLoading || detail.isLoading) {
		return <Loader />;
	}
	/* if (!page.get('page')) {
		page.append('page', children[0]?.pid ?? 'undefined');
		setPageUrlParam(page, { replace: true });
	} */

	if (children?.[0].datanode) {
		nav(`/multiview/${leftId}/${id}`);
	}
	return (
		<>
			{children?.[0].datanode ? (
				<>datanode</>
			) : (
				<Wrapper>
					<H2>Vyberte se seznamu:</H2>

					<PeriodicalTiles data={children} onSelect={id => setId(id)} />
				</Wrapper>
			)}
		</>
	);
};

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
