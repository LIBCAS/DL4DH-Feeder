/** @jsxImportSource @emotion/react */
import { css } from '@emotion/react';
import { FC, useCallback, useEffect, useMemo, useState } from 'react';
import { useNavigate, useParams, useSearchParams } from 'react-router-dom';
import { useTranslation } from 'react-i18next';

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

import { usePublicationContext } from '../ctx/pub-ctx';

const PubChooseSecond: FC<{ onClose: () => void; variant: 'left' | 'right' }> =
	({ onClose, variant }) => {
		const [query, setQuery] = useState<string | undefined>('');
		const { t } = useTranslation();

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
		useEffect(() => {
			if (data) {
				setUUID(data[0]?.pid ?? '');
			}
		}, [data]);

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
							<ChoosePeriodical id={uuid} onClose={onClose} variant={variant} />
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
							box-shadow: 0px -13px 16px -8px rgb(0 0 0 / 6%);
						`}
					>
						<Button
							variant="primary"
							onClick={handleSecond}
							loading={isLoading}
							disabled={isLoading || uuid === ''}
						>
							{t('common:confirm')}
						</Button>
						{step > 0 && (
							<Button variant="outlined" onClick={() => setStep(0)}>
								{t('common:back')}
							</Button>
						)}
						<Button variant="outlined" onClick={onClose}>
							{t('common:close')}
						</Button>
					</Flex>
				</Paper>
			</>
		);
	};

export default PubChooseSecond;

const ChoosePeriodical: FC<{
	id: string;
	onClose: () => void;
	variant?: 'left' | 'right';
}> = ({ id: rootId, onClose, variant }) => {
	//TODO: cleanup
	const pubCtx = usePublicationContext();
	const {
		id: singleId,
		id1: mIdLeft,
		id2: mIdRight,
	} = useParams<{ id: string; id1: string; id2: string }>();
	const [sp] = useSearchParams();
	let currentIdToBeChanged: string | undefined = undefined;
	let notChangingId: string | undefined = undefined;
	let notChangingPage: string | undefined = undefined;
	let notChangingFulltext: string | undefined = undefined;

	if (!singleId) {
		//is multiview variant
		currentIdToBeChanged = variant === 'left' ? mIdLeft : mIdRight;
		notChangingId =
			variant === 'left'
				? mIdRight ?? 'ctx-right-pubid-error'
				: mIdLeft ?? 'ctx-left-pubid-error';
		notChangingPage =
			variant === 'left' ? sp.get('page2') ?? '' : sp.get('page') ?? '';
		notChangingFulltext =
			variant === 'left' ? sp.get('fulltext2') ?? '' : sp.get('fulltext') ?? '';
	} else {
		currentIdToBeChanged = singleId;
		notChangingId = currentIdToBeChanged;
		notChangingPage = sp.get('page') ?? '';
		notChangingFulltext = sp.get('fulltext') ?? '';
	}
	const [newId, setNewId] = useState(rootId);
	const childrenResponse = usePublicationChildren(newId ?? '');
	const nav = useNavigate();
	const children = useMemo(
		() => childrenResponse.data ?? [],
		[childrenResponse.data],
	);

	useEffect(() => {
		if (children?.[0]?.datanode) {
			if (currentIdToBeChanged === newId) {
				onClose();
			} else {
				variant === 'left'
					? nav(
							`/multiview/${newId}/${notChangingId}?page2=${notChangingPage}${
								notChangingFulltext ? `&fulltext2=${notChangingFulltext}` : ``
							}`,
					  )
					: nav(
							`/multiview/${notChangingId}/${newId}?page=${notChangingPage}${
								notChangingFulltext ? `&fulltext=${notChangingFulltext}` : ``
							}`,
					  );
			}
		}
		if (children.length === 1 && !children?.[0]?.datanode) {
			setNewId(children[0].pid);
		}
	}, [
		children,
		newId,
		notChangingId,
		nav,
		currentIdToBeChanged,
		onClose,
		variant,
		notChangingPage,
		pubCtx,
		singleId,
		notChangingFulltext,
	]);

	if (childrenResponse.isLoading) {
		return <Loader />;
	}

	return (
		<Wrapper>
			<H2>Vyberte se seznamu:</H2>
			<PeriodicalTiles data={children} onSelect={id => setNewId(id)} />
		</Wrapper>
	);
};
