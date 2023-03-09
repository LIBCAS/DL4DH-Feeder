/** @jsxImportSource @emotion/react */
import { css } from '@emotion/core';
import { useCallback, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { BiLinkExternal } from 'react-icons/bi';
import { MdCopyAll } from 'react-icons/md';

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

import { useSearchHistory } from 'api/historyApi';
import { FiltersDto } from 'api/models';

import { NameTagToText } from 'utils/enumsMap';

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

const SearchHistory = () => {
	const enumToText = useActiveFilterLabel();
	const { t } = useTranslation();
	const [page, setPage] = useState(0);
	const [pageSize, setPageSize] = useState(10);
	const [sorting, setSorting] = useState<'ASC' | 'DESC'>('DESC');
	const response = useSearchHistory({
		page,
		size: pageSize,
		sort: { direction: sorting, field: 'createdAt' },
	});

	const constructQuery = useCallback((filter: FiltersDto) => {
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

		return `/search?${sp.toString()}`;
	}, []);

	if (response.isLoading) {
		return <Loader />;
	}

	const hist = (response.data?.content ?? []).map(h => ({
		formatted: formatActiveFilters(h),
		link: constructQuery(h),
		created: h.createdAt
			? new Date(h.createdAt)?.toLocaleDateString?.('cs') ?? h.id
			: h.id,
		query: h,
		id: h.id,
	}));

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
							Výsledky: {response.data?.totalElements ?? 0}
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
							Historie dotazů
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
							<Text>Řazení:</Text>
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
									<Text mr={2}>{row.created}</Text>
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
											const label = `${NameTagToText[nt.type]} ${
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
