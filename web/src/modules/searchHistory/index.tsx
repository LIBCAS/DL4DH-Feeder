/** @jsxImportSource @emotion/react */
import { css } from '@emotion/core';
import { useCallback, useMemo, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { BiLinkExternal } from 'react-icons/bi';
import { MdCopyAll, MdDelete } from 'react-icons/md';
import { toast } from 'react-toastify';
import { useQueryClient } from 'react-query';

import { Chip } from 'components/form/input/TextInput';
import SimpleSelect from 'components/form/select/SimpleSelect';
import MainContainer from 'components/layout/MainContainer';
import { Box, Flex } from 'components/styled';
import Button, { NavLinkButton } from 'components/styled/Button';
import Text, { H1 } from 'components/styled/Text';
import { Wrapper } from 'components/styled/Wrapper';
import ClassicTable from 'components/table/ClassicTable';
import Pagination from 'components/table/Pagination';
import { OperationToTextLabel } from 'components/search/MainSearchInput';

import { Loader } from 'modules/loader';
import {
	formatActiveFilters,
	useActiveFilterLabel,
} from 'modules/public/homepage/leftPanel/ActiveFilters';

import { theme } from 'theme';
import { nameTagQueryCtor } from 'utils';
import { api } from 'api';

import { useSearchHistory } from 'api/historyApi';
import { FiltersDto } from 'api/models';

import { CUSTOM_URL_PARAMS } from 'utils/enumsMap';

const isAdvancedFilterActive = (filter: FiltersDto): boolean => {
	if (!filter.advancedFilterField) {
		return false;
	}
	if (filter.advancedFilterField === 'NONE') {
		return false;
	}
	if (!filter.query) {
		return false;
	}
	return true;
};

const constructQuery = (filter: FiltersDto) => {
	const sp = new URLSearchParams();

	if (filter.query && !isAdvancedFilterActive(filter)) {
		sp.append('query', filter.query);
	}
	if (filter.availability) {
		sp.set('availability', filter.availability);
	}

	if (filter.enrichment && filter.enrichment !== 'ALL') {
		sp.set('enrichment', filter.enrichment);
	}

	if (filter.models) {
		filter.models.forEach(m => sp.append('models', m));
	}
	if (filter.keywords) {
		filter.keywords.forEach(m => sp.append('keywords', m));
	}
	if (filter.authors) {
		filter.authors.forEach(m => sp.append('authors', m));
	}
	if (filter.languages) {
		filter.languages.forEach(m => sp.append('languages', m));
	}

	if (isAdvancedFilterActive(filter)) {
		sp.set('field', filter.advancedFilterField);
		sp.set('value', filter.query);
	}

	['from', 'to', 'nameTagFacet'].map(key => {
		if (filter?.[key]) {
			sp.set(key, filter[key]);
		}
	});
	if (filter.nameTagFilters && filter.nameTagFilters.length > 0) {
		filter.nameTagFilters.forEach(nt => {
			const formatedNt = nameTagQueryCtor(nt.type, nt.operator, nt.values[0]);
			if (formatedNt) {
				sp.append(formatedNt?.name, formatedNt?.value);
			}
		});
	}
	if (filter.id) {
		sp.append(CUSTOM_URL_PARAMS.HISTORY_ID, filter.id);
	}

	return `/search?${sp.toString()}`;
};

const SearchHistory = () => {
	const enumToText = useActiveFilterLabel();
	const { t } = useTranslation();
	const [page, setPage] = useState(0);
	const [pageSize, setPageSize] = useState(10);
	const [sorting, setSorting] = useState<'ASC' | 'DESC'>('DESC');
	const queryClient = useQueryClient();

	const response = useSearchHistory({
		page,
		size: pageSize,
		sort: { direction: sorting, field: 'createdAt' },
	});

	const handleDeleteEntry = useCallback(
		async (id: string) => {
			if (!window.confirm('Opravdu chcete smazat záznam?')) {
				return;
			}
			const response = await api().delete(`search/history/${id}`);
			if (response.ok) {
				toast.success('Záznam byl úspěšně smazán');
				queryClient.invalidateQueries({ queryKey: ['search-history-list'] });
			} else {
				toast.error('Záznam se nepodařilo smazat');
			}
		},
		[queryClient],
	);

	const hist = useMemo(
		() =>
			(response.data?.content ?? []).map(h => ({
				formatted: formatActiveFilters(h),
				link: constructQuery(h),
				created: h.createdAt
					? `${new Date(h.createdAt)?.toLocaleDateString?.('cs') ?? h.id} ${
							new Date(h.createdAt)?.toLocaleTimeString?.('cs') ?? h.id
					  }`
					: h.id,
				id: h.id,
				name: h.name,
				numFound: h.numFound,
			})),
		[response.data?.content],
	);

	if (response.isLoading) {
		return <Loader />;
	}

	return (
		<Wrapper
			height="100vh"
			alignItems="flex-start"
			width={1}
			bg="paper"
			zIndex={0}
		>
			<MainContainer
				subHeader={{
					leftJsx: (
						<Flex px={2} alignItems="center" justifyContent="center">
							{t('search:results')}: {response.data?.totalElements ?? 0}
						</Flex>
					),

					mainJsx: (
						<H1
							px={2}
							textAlign="left"
							color="#444444!important"
							fontWeight="normal"
							fontSize="lg"
						>
							{t('search_history:page_title')}
						</H1>
					),

					rightJsx: (
						<Flex
							mr={3}
							width={1}
							zIndex={2}
							alignItems="center"
							justifyContent="flex-end"
						>
							<Text>{t('search:ordering.label')}:</Text>
							<SimpleSelect<'ASC' | 'DESC'>
								minWidth={150}
								options={['ASC', 'DESC']}
								value={sorting}
								variant="borderless"
								onChange={item => {
									setSorting(item);
								}}
								nameFromOption={item =>
									item !== null
										? t(
												`search:ordering:${
													{ ASC: 'earliest', DESC: 'latest' }[item]
												}`,
										  )
										: ''
								}
							/>
						</Flex>
					),
				}}
				body={{
					leftJsx: (
						<>
							{/* <BrowseSearchBox isLoading={response.isLoading} />
							<AvailabilityFilter
								isLoading={response.isLoading}
								updateFilter={handleChangeFilter}
								withoutCount
								activeItem={availability}
								storeKey="browse-availability"
							/>
							<BrowseFilter
								updateFilter={handleChangeFilter}
								activeItem={category}
							/> */}
						</>
					),
				}}
			>
				<Box width={1} zIndex={0} overflow="auto">
					<ClassicTable
						borderless
						minWidth={400}
						data={hist}
						hideEditButton
						rowWrapperCss={css`
							border-bottom: 1px solid ${theme.colors.border};
						`}
						renderRow={(row, index) => (
							<Flex
								key={row.id}
								width={1}
								justifyContent="space-between"
								px={3}
							>
								<Flex alignItems="center">
									<Box maxWidth={250}>
										{row.name && (
											<Text mr={2}>
												<b>{row.name}</b>
											</Text>
										)}
										{row.numFound != null && (
											<Text mr={2} fontSize="sm">
												{t('search:results')}: <b>{row.numFound}</b>
											</Text>
										)}
										<Text mr={2} fontSize="sm">
											{row.created}
										</Text>
									</Box>
									<Flex color="text" flexWrap="wrap" py={2}>
										{Object.keys(row.formatted.arrayFilters).map(key =>
											row.formatted.arrayFilters[key].map(value => {
												const label = enumToText(key, value, {});
												return label ? (
													<Chip
														key={`${row.id}-${index}-${key}-${value}`}
														px={3}
														py={2}
														m={[1, 2]}
													>
														{label}
													</Chip>
												) : (
													<></>
												);
											}),
										)}
										{row.formatted.NT.map(nt => {
											const label = `${t(`nametag:labels.${nt.type}`)} ${
												OperationToTextLabel[nt.operator]
											}
												${nt.values[0]}`;
											return label ? (
												<Chip
													key={`${row.id}-${index}-${label}`}
													px={3}
													py={2}
													m={[1, 2]}
													css={css`
														border-color: ${theme.colors.primary};
													`}
												>
													{label}
												</Chip>
											) : (
												<></>
											);
										})}
									</Flex>
								</Flex>
								<Flex alignItems="center" fontWeight="bold" flexShrink={0}>
									<Button
										tooltip={t('common:copy_to_clipboard')}
										variant="text"
										onClick={() => {
											navigator.clipboard.writeText(
												`${window.location.origin}${row.link ?? ''}`,
											);
										}}
									>
										<MdCopyAll size={24} />
									</Button>
									<NavLinkButton to={row.link} variant="text" target="_blank">
										<BiLinkExternal size={24} />
									</NavLinkButton>
									<Button
										tooltip={t('common:delete')}
										variant="text"
										onClick={() => row.id && handleDeleteEntry(row.id)}
										color="error"
									>
										<MdDelete size={24} />
									</Button>
								</Flex>
							</Flex>
						)}
					/>
					<Box px={4} py={3}>
						<Pagination
							page={(response.data?.pageable.page ?? 0) + 1}
							changePage={page => setPage(page - 1)}
							changeLimit={limit =>
								limit !== pageSize ? setPageSize(limit) : null
							}
							pageLimit={pageSize}
							totalCount={response.data?.totalElements ?? 0}
							hasMore={
								(response.data?.totalPages ?? 0) !==
								(response.data?.pageable.page ?? 0) + 1
							}
							offset={page * pageSize}
							loading={response.isLoading}
							limitOptions={[10, 20, 30]}
							localStorageKey="feeder-history-list-pagination"
						/>
					</Box>
				</Box>
			</MainContainer>
		</Wrapper>
	);
};

export default SearchHistory;
