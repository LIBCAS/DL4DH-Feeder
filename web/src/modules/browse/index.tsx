/** @jsxImportSource @emotion/react */
import { css } from '@emotion/core';
import { useCallback, useEffect, useMemo, useState } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { useTranslation } from 'react-i18next';

import AvailabilityFilter from 'components/filters/Accordions/AvailabilityFilter';
import BrowseFilter from 'components/filters/Accordions/BrowseFilter';
import BrowseSearchBox from 'components/filters/Accordions/BrowseSearchBox';
import SimpleSelect from 'components/form/select/SimpleSelect';
import MainContainer from 'components/layout/MainContainer';
import { Flex } from 'components/styled';
import Text, { H1 } from 'components/styled/Text';
import { Wrapper } from 'components/styled/Wrapper';
import ClassicTable from 'components/table/ClassicTable';

import { Loader } from 'modules/loader';

import { useTheme } from 'theme';

import { AvailabilityEnum, Collection, ModelsEnum } from 'api/models';
import { useAvailableFilters } from 'api/publicationsApi';

import { modelToText } from 'utils/enumsMap';

type TableItem = {
	id: string;
	label: string;
	count: number;
	key: string;
};

//TODO: presunut toto do makeList funkcie
const categoryHandlers = {
	languages: {
		onClick: () => null,
		//	labelMapper: (key: string) => mapLangToCS[key],
	},
	models: {
		onClick: () => null,
		labelMapper: (key: string) => modelToText(key as ModelsEnum),
	},
	keywords: {
		onClick: () => null,
	},
	authors: {
		onClick: () => null,
	},
};

type SortOption = {
	id: string;
	label: string;
};

const sortOptions: SortOption[] = [
	{
		id: 'count',
		label: 'Podle výskytů',
	},
	{
		id: 'label',
		label: 'Aběcedně',
	},
];

const getLabel = (
	label: string,
	category: string,
	collections?: Collection[],
) =>
	categoryHandlers[category]?.labelMapper?.(label, collections ?? []) ?? label;

const makeList = (
	data: Record<string, number | Collection>,
	lang = 'cs',
): TableItem[] => {
	return Object.keys(data).map((key, index) => {
		let count = 0;
		let label = '';
		if (typeof data[key] === 'object') {
			count = (data[key] as Collection).numberOfDocs;
			label = (data[key] as Collection).descs[lang === 'cz' ? 'cs' : 'en'];
			if (!label) {
				label = (data[key] as Collection).descs.cs;
			}
			if (!label) {
				label = key;
			}
		} else {
			count = data[key] as number;
			label = key;
		}

		return {
			id: `${index}-${key}`,
			label,
			count,
			key,
		};
	});
};

const sortList = (data: TableItem[], sorting: SortOption, category: string) => {
	return sorting.id === 'label'
		? data.sort((a, b) => {
				const labelA = getLabel(a.label, category);
				const labelB = getLabel(b.label, category);
				return labelA < labelB ? -1 : 1;
		  })
		: data.sort((a, b) => b.count - a.count);
};

const Browse = () => {
	const [sp, setSp] = useSearchParams();
	const category = sp.get('category') ?? 'models';
	const availability = (sp.get('availability') ?? 'ALL') as AvailabilityEnum;
	const browseQuery = sp.get('bq') ?? '';
	const nav = useNavigate();
	const theme = useTheme();
	const response = useAvailableFilters({ availability, query: browseQuery });
	const { t, i18n } = useTranslation();

	const [tableData, setTableData] = useState<TableItem[]>([]);

	const [sorting, setSorting] = useState<SortOption>(sortOptions[0]);

	const filters = useMemo(
		() => response.data?.availableFilters,
		[response.data],
	);
	const flitersList = useMemo(
		() => makeList(filters?.[category] ?? {}, i18n.language),
		[filters, category, i18n.language],
	);
	useEffect(() => {
		setTableData(sortList([...flitersList], sorting, category));
	}, [flitersList, category, sorting]);

	const handleChangeFilter = useCallback(
		(type: string) => (key: string) => {
			sp.set(type, key);
			sp.delete('page');
			setSp(sp);
		},
		[sp, setSp],
	);
	if (response.isLoading) {
		return <Loader />;
	}

	return (
		<Wrapper height="100vh" alignItems="flex-start" width={1} bg="paper">
			<MainContainer
				subHeader={{
					leftJsx: (
						<Flex px={2} alignItems="center" justifyContent="center">
							{t('search:results')}: {tableData.length}
						</Flex>
					),

					mainJsx: (
						<H1
							px={2}
							textAlign="left"
							color="#444444!important"
							fontWeight="normal"
							fontSize="lg"
						></H1>
					),

					rightJsx: (
						<Flex
							mr={3}
							width={1}
							alignItems="center"
							justifyContent="flex-end"
						>
							<Text>{t('search:ordering.label')}:</Text>
							<SimpleSelect
								minWidth={150}
								options={sortOptions}
								value={sorting}
								variant="borderless"
								onChange={item => {
									setSorting(item);
								}}
								keyFromOption={item => item?.id ?? ''}
								nameFromOption={item => item?.label ?? ''}
							/>
						</Flex>
					),
				}}
				body={{
					leftJsx: (
						<>
							<BrowseSearchBox isLoading={response.isLoading} />
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
							/>
						</>
					),
				}}
			>
				<ClassicTable
					borderless
					minWidth={400}
					data={tableData}
					hideEditButton
					rowWrapperCss={css`
						border-bottom: 1px solid ${theme.colors.border};
					`}
					renderRow={row => (
						<Flex
							width={1}
							key={row.id}
							justifyContent="space-between"
							px={3}
							css={css`
								cursor: pointer;
							`}
							onClick={() =>
								nav(
									`/search?${category}=${row.key}&availability=${availability}`,
								)
							}
						>
							<Text flex={[5, 6, 7]}>
								{category === 'models' || category === 'languages'
									? t(
											category === 'models'
												? 'model:' + getLabel(row.label, category)
												: 'language:' + getLabel(row.label, category),
									  )
									: getLabel(row.label, category)}
							</Text>

							<Text textAlign="right" flex={1} mx={2}>
								{row.count} x
							</Text>
						</Flex>
					)}
				/>
			</MainContainer>
		</Wrapper>
	);
};

export default Browse;
