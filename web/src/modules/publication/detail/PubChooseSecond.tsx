/** @jsxImportSource @emotion/react */
import { css } from '@emotion/react';
import { debounce } from 'lodash-es';
import { FC, useCallback, useEffect, useMemo, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { MdRefresh } from 'react-icons/md';
import { useNavigate, useParams, useSearchParams } from 'react-router-dom';

import Checkbox from 'components/form/checkbox/Checkbox';
import QuerySearchInput from 'components/search/QuerySearchInput';
import { Flex } from 'components/styled';
import Button from 'components/styled/Button';
import IconButton from 'components/styled/IconButton';
import Paper from 'components/styled/Paper';
import Text, { H2 } from 'components/styled/Text';
import { Wrapper } from 'components/styled/Wrapper';
import Pagination from 'components/table/Pagination';

import { Loader } from 'modules/loader';
import ActiveFilters from 'modules/public/homepage/leftPanel/ActiveFilters';
import SplitScreenView from 'modules/searchResult/list/SplitScreenView';
import PeriodicalTiles from 'modules/searchResult/tiles/PeriodicalTileView';

import { useTheme } from 'theme';

import {
	usePublicationChildren,
	useSearchPublications,
} from 'api/publicationsApi';

import { useDashboardFilters } from 'hooks/useDashboardFilters';
import { TSearchQuery } from 'hooks/useSearchContext';

import useHeaderHeight from 'utils/useHeaderHeight';

import { createSearchParamsString } from '../publicationUtils';
import { usePublicationContext } from '../ctx/pub-ctx';

const PubChooseSecond: FC<{ onClose: () => void; variant: 'left' | 'right' }> =
	({ onClose, variant }) => {
		const { dashboardFilters } = useDashboardFilters();
		const [query, setQuery] = useState<string | undefined>(
			dashboardFilters?.query ?? '',
		);
		const { t } = useTranslation();

		const [page, setPage] = useState(1);
		const [pageLimit, setPageLimit] = useState(30);
		const [showDashboardFilters, setShowDashboardFilters] = useState(false);
		const [dirty, setDirty] = useState(false);

		const handleQueryChange = useMemo(
			() =>
				debounce((query: string) => {
					setPage(1);
					setQuery(query);
					setDirty(true);
				}, 50),
			[],
		);
		const [publicOnly, setPublicOnly] = useState<boolean>(
			dashboardFilters?.availability === 'PUBLIC',
		);

		const [uuid, setUUID] = useState('');
		const [step, setStep] = useState(0);
		const [omitDashboardFilters, setOmitDashboardFilters] = useState(false);
		const headerHeight = useHeaderHeight();
		const onSelect = (uuid: string) => {
			setUUID(uuid);
		};

		const handleSecond = () => setStep(1);
		const dfilters = omitDashboardFilters ? { query } : dashboardFilters;
		const { data, count, isLoading, hasMore } = useSearchPublications({
			...dfilters,
			start: (page - 1) * pageLimit,
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
					zIndex={50}
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
							<Flex width={1} justifyContent="flex-end">
								{dirty && dashboardFilters && (
									<IconButton
										px={4}
										color="text"
										onClick={() => {
											setQuery(dashboardFilters?.query ?? '');
											setOmitDashboardFilters(false);
											setDirty(false);
											setPublicOnly(
												dashboardFilters?.availability === 'PUBLIC',
											);
										}}
									>
										<Flex px={3} alignItems="center">
											<MdRefresh size={20} />
											<Text ml={2}>Vrátit původní filtr</Text>
										</Flex>
									</IconButton>
								)}
								{dashboardFilters && (
									<IconButton
										color="text"
										flexShrink={0}
										onClick={() => setShowDashboardFilters(p => !p)}
									>
										<Flex px={3} alignItems="center">
											<Text ml={2}>Zobrazit původní filtr</Text>
										</Flex>
									</IconButton>
								)}
								{showDashboardFilters && (
									<Flex
										position="absolute"
										zIndex={3}
										bg="white"
										top={30}
										css={css`
											box-shadow: 2px 2px 2px 2px rgba(0, 0, 0, 0.1);
										`}
									>
										<ActiveFilters
											savedFilters={dashboardFilters as TSearchQuery}
											readonly
										/>
									</Flex>
								)}
							</Flex>
							<Flex p={2} alignItems="center">
								<QuerySearchInput
									value={query}
									initialQuery={query}
									onQueryUpdate={handleQueryChange}
									publicOnly={publicOnly}
									setPublicOnly={() => {
										setPublicOnly(p => !p);
										setDirty(true);
										setPage(1);
									}}
									onQueryClear={() => {
										setQuery('');
										setPage(1);
									}}
									externalState
								/>
								{dashboardFilters && (
									<Flex pr={1} flexShrink={0}>
										<Checkbox
											checked={omitDashboardFilters}
											onChange={() => {
												setOmitDashboardFilters(p => !p);
												setPage(1);
											}}
											aria-label={'Nepoužít filtr'}
											label={'Nepoužít filtr'}
										/>
									</Flex>
								)}
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
						{step > 0 && (
							<Button variant="outlined" onClick={() => setStep(0)}>
								{t('common:back')}
							</Button>
						)}
						<Button variant="outlined" onClick={onClose}>
							{t('common:close')}
						</Button>
						<Button
							variant="primary"
							onClick={handleSecond}
							loading={isLoading}
							disabled={isLoading || uuid === ''}
						>
							{t('common:confirm')}
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
	//TODO: cleanup A ZAROVEN POZOR NAVIGACIA KAPITOL ZLYHAVA
	// datanode treba testovat inak
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
	console.log({ singleId, mIdLeft, mIdRight });

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
		() => ({
			datanodes: (childrenResponse.data ?? []).filter(c => c.datanode),
			notDataNodes: (childrenResponse.data ?? []).filter(c => !c.datanode),
		}),
		[childrenResponse.data],
	);

	useEffect(() => {
		if (children.datanodes.length > 0) {
			if (currentIdToBeChanged === newId && !singleId) {
				onClose();
			} else {
				if (singleId) {
					pubCtx.setOcrMode(p => {
						if (p) {
							return {
								...p,
								left: 'zoomify',
								leftZoom: 12,
								right: p.left,
								rightZoom: p.leftZoom,
							};
						} else {
							return null;
						}
					});
				}
				variant === 'left'
					? nav(
							`/multiview/${newId}/${notChangingId}${createSearchParamsString([
								{ name: 'page2', value: notChangingPage },
								{ name: 'fulltext2', value: notChangingFulltext },
							])}`,
					  )
					: nav(
							`/multiview/${notChangingId}/${newId}${createSearchParamsString([
								{ name: 'page', value: notChangingPage },
								{ name: 'fulltext', value: notChangingFulltext },
							])}`,
					  );
			}
		} else if (children.notDataNodes.length === 1) {
			setNewId(children.notDataNodes[0].pid);
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
			<PeriodicalTiles
				data={children.notDataNodes}
				onSelect={id => setNewId(id)}
			/>
		</Wrapper>
	);
};
