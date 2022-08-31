/** @jsxImportSource @emotion/react */
import { css } from '@emotion/core';
import { useCallback, useEffect, useMemo, useState } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';

import BrowseFilter from 'components/filters/Accordions/BrowseFilter';
import SimpleSelect from 'components/form/select/SimpleSelect';
import LeftMenuContainer from 'components/sidepanels/LeftMenuContainer';
import { Box, Flex } from 'components/styled';
import SubHeader from 'components/styled/SubHeader';
import Text, { H1 } from 'components/styled/Text';
import { Wrapper } from 'components/styled/Wrapper';
import ClassicTable from 'components/table/ClassicTable';
import AvailabilityFilter from 'components/filters/Accordions/AvailabilityFilter';

import { Loader } from 'modules/loader';

import { useTheme } from 'theme';

import { AvailabilityEnum, ModelsEnum } from 'api/models';
import { useAvailableFilters } from 'api/publicationsApi';

import { modelToText } from 'utils/enumsMap';
import { mapLangToCS } from 'utils/languagesMap';
import { INIT_HEADER_HEIGHT, SUB_HEADER_HEIGHT } from 'utils/useHeaderHeight';

type TableItem = {
	id: string;
	label: string;
	count: number;
};
//mapLangToCS
//modelToText
const categoryHandlers = {
	languages: {
		onClick: () => null,
		labelMapper: (key: string) => mapLangToCS[key],
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

const getLabel = (label: string, category: string) =>
	categoryHandlers[category]?.labelMapper?.(label) ?? label;

const makeList = (data: Record<string, number>): TableItem[] =>
	Object.keys(data).map((key, index) => ({
		id: `${index}-${key}`,
		label: key,
		count: data[key],
	}));

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
	const nav = useNavigate();
	const theme = useTheme();
	const response = useAvailableFilters({ availability });

	const [tableData, setTableData] = useState<TableItem[]>([]);

	const [sorting, setSorting] = useState<SortOption>(sortOptions[0]);

	const filters = useMemo(
		() => response.data?.availableFilters,
		[response.data],
	);
	const flitersList = useMemo(
		() => makeList(filters?.[category] ?? {}),
		[filters, category],
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
			<SubHeader
				leftJsx={
					<Flex px={2} alignItems="center" justifyContent="center">
						Výsledky: {tableData.length}
					</Flex>
				}
				mainJsx={
					<H1
						px={2}
						textAlign="left"
						color="#444444!important"
						fontWeight="normal"
						fontSize="lg"
					></H1>
				}
				rightJsx={
					<Flex px={3} width={1} alignItems="center" justifyContent="flex-end">
						Řazení:
						<SimpleSelect
							options={sortOptions}
							value={sorting}
							variant="borderless"
							onChange={item => {
								//setTableData(sortList([...flitersList], item, category));
								setSorting(item);
							}}
							keyFromOption={item => item?.id ?? ''}
							nameFromOption={item => item?.label ?? ''}
						/>
					</Flex>
				}
			/>
			<Flex
				css={css`
					width: 100%;
					height: calc(100vh - ${INIT_HEADER_HEIGHT + SUB_HEADER_HEIGHT}px);
					border-bottom: 1px solid black;
				`}
				bg="white"
			>
				<LeftMenuContainer>
					<Box
						pt={1}
						width={1}
						css={css`
							border-top: 1px solid ${theme.colors.border};
						`}
					>
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
					</Box>
				</LeftMenuContainer>
				<Flex
					width={1}
					css={css`
						border-top: 1px solid ${theme.colors.border};
					`}
				>
					<ClassicTable
						borderless
						minWidth={500}
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
										`/search?${category}=${row.label}&availability=${availability}`,
									)
								}
							>
								<Text flex={7}>{getLabel(row.label, category)}</Text>
								<Text flex={1}>{row.count}x</Text>
							</Flex>
						)}
					/>
				</Flex>
			</Flex>
		</Wrapper>
	);
};

export default Browse;
