/** @jsxImportSource @emotion/react */
import { css } from '@emotion/react';
import {
	FC,
	useCallback,
	useContext,
	useEffect,
	useMemo,
	useState,
} from 'react';
import { useNavigate } from 'react-router-dom';

import QuerySearchInput from 'components/search/QuerySearchInput';
import { Flex } from 'components/styled';
import Button from 'components/styled/Button';
import Paper from 'components/styled/Paper';
import { H2 } from 'components/styled/Text';
import { Wrapper } from 'components/styled/Wrapper';
import Pagination from 'components/table/Pagination';

import { Loader } from 'modules/loader';
import SplitScreenView from 'modules/searchResult/list/SplitScreenView';
import PeriodicalTiles from 'modules/searchResult/tiles/PeriodicalTileView';

import { useTheme } from 'theme';

import {
	usePublicationChildren,
	useSearchPublications,
} from 'api/publicationsApi';

import useHeaderHeight from 'utils/useHeaderHeight';

import { PubCtx } from '../ctx/pub-ctx';

const PubChooseSecond: FC<{ onClose: () => void; variant: 'left' | 'right' }> =
	({ onClose, variant }) => {
		const [query, setQuery] = useState<string | undefined>('');

		const [page, setPage] = useState(0);
		const [pageLimit, setPageLimit] = useState(30);
		const handleQueryChange = (query: string) => {
			setPage(0);
			setQuery(query);
		};
		const [publicOnly, setPublicOnly] = useState<boolean>(true);

		const [uuid, setUUID] = useState('');
		const [step, setStep] = useState(0);
		const headerHeight = useHeaderHeight();
		const onSelect = (uuid: string) => {
			setUUID(uuid);
		};

		const handleSecond = () => setStep(1);

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
					zIndex={4}
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
						{step > 0 && (
							<Button variant="outlined" onClick={() => setStep(0)}>
								Zpět
							</Button>
						)}
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
	const pubCtx = useContext(PubCtx);
	const leftId = pubCtx.publication?.pid ?? 'ctx-left-pubid-error';
	const [id, setId] = useState(rootId);
	const childrenResponse = usePublicationChildren(id ?? '');
	const nav = useNavigate();
	const children = useMemo(
		() => childrenResponse.data ?? [],
		[childrenResponse.data],
	);

	useEffect(() => {
		if (children?.[0]?.datanode) {
			nav(`/multiview/${leftId}/${id}`);
		}
		if (children.length === 1 && !children?.[0]?.datanode) {
			setId(children[0].pid);
		}
	}, [children, id, leftId, nav]);

	if (childrenResponse.isLoading) {
		return <Loader />;
	}

	return (
		<Wrapper>
			<H2>Vyberte se seznamu:</H2>
			<PeriodicalTiles data={children} onSelect={id => setId(id)} />
		</Wrapper>
	);
};
