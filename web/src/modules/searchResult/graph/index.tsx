/** @jsxImportSource @emotion/react */
import { css } from '@emotion/react';
import { FC, useMemo, useState } from 'react';
import {
	BarChart,
	Bar,
	XAxis,
	YAxis,
	CartesianGrid,
	Tooltip,
	ResponsiveContainer,
	Brush,
} from 'recharts';
import { FaSortAmountDown, FaSortAmountUp } from 'react-icons/fa';
import { useTranslation } from 'react-i18next';

import Text from 'components/styled/Text';
import { Box, Flex } from 'components/styled';
import TitleText from 'components/styled/TitleText';
import SimpleSelect from 'components/form/select/SimpleSelect';
import IconButton from 'components/styled/IconButton';

import { useTheme } from 'theme';

import { AvailableFilters } from 'api/models';

import { useBulkExportContext } from 'hooks/useBulkExport';

type Props = {
	data: AvailableFilters;
};

type OptionXAxisType = {
	key: keyof AvailableFilters;
	label: string;
	itemLabelFunction?: (key: string) => string;
};
type OptionXAxisSorting = 'key' | 'count';

const GraphView: FC<Props> = ({ data }) => {
	const theme = useTheme();
	const { t } = useTranslation('graph_view');

	const { graphRef } = useBulkExportContext();

	const [zoom, setZoom] = useState<{ startIndex?: number; endIndex?: number }>({
		startIndex: undefined,
		endIndex: undefined,
	});

	const OptionsXAxis: OptionXAxisType[] = useMemo(
		() => [
			{ key: 'years', label: t('axis_x.years') },
			{ key: 'authors', label: t('axis_x.authors') },
			{ key: 'keywords', label: t('axis_x.keywords') },
			{
				key: 'models',
				label: t('axis_x.models'),
				itemLabelFunction: (key: string) => t(`model:${key}`) ?? key,
			},
			{
				key: 'languages',
				label: t('axis_x.languages'),
				itemLabelFunction: (key: string) => t(`language:${key}`) ?? key,
			},
		],
		[t],
	);

	const [sorting, setSorting] = useState<OptionXAxisSorting>('key');
	const [axisX, setAxisX] = useState<OptionXAxisType>(OptionsXAxis[0]);
	const [sortDirection, setSortDirection] = useState<number>(1);
	const formattedData = data[axisX.key];

	const chartData = useMemo(
		() =>
			Object.keys(formattedData)
				.filter(k => k !== '0')
				.map(key => ({
					key,
					count: formattedData[key],
					label: axisX?.itemLabelFunction?.(key) ?? key,
				}))
				.sort(
					(a, b) =>
						parseInt(a[sorting]) * sortDirection -
						parseInt(b[sorting]) * sortDirection,
				),
		// eslint-disable-next-line react-hooks/exhaustive-deps
		[formattedData, sorting, axisX, sortDirection, t],
	);

	return (
		<Box position="relative" height="100%" width={1} overflow="hidden">
			<Flex justifyContent="space-between" m={2} alignItems="center">
				<TitleText textAlign="left" ml={1} fontSize="xl">
					{t('title')}
				</TitleText>

				<Flex alignItems="center">
					<Text mr={2}>{t('axis_x.label')}</Text>
					<SimpleSelect
						label=""
						options={OptionsXAxis}
						onChange={item => {
							setAxisX(item);
							setZoom({});
						}}
						nameFromOption={item => t(`${item ? item.label : 'axis_x.years'}`)}
						keyFromOption={item => item?.key ?? ''}
						value={axisX}
						minWidth={150}
						width={150}
						variant="outlined"
						menuItemCss={css`
							width: 150px;
						`}
					/>
					<Text mr={2} ml={3}>
						{t('sorting.label')}
					</Text>
					<SimpleSelect<OptionXAxisSorting>
						options={['key', 'count']}
						nameFromOption={item => t(`sorting.${item ?? 'key'}`)}
						onChange={newVal => {
							setSorting(newVal);
							setZoom({});
						}}
						value={sorting}
						width={100}
						variant="outlined"
						menuItemCss={css`
							width: 100px;
						`}
					/>
					<Flex
						ml={3}
						pl={3}
						css={css`
							border-left: 1px solid ${theme.colors.border};
						`}
					>
						<Flex
							bg="primaryLight"
							alignItems="center"
							justifyContent="center"
							width={40}
							height={36}
						>
							<IconButton
								color="primary"
								onClick={() => setSortDirection(z => z * -1)}
								tooltip={t('sorting.direction')}
							>
								{sortDirection === 1 ? (
									<FaSortAmountUp size={22} />
								) : (
									<FaSortAmountDown size={22} />
								)}
							</IconButton>
						</Flex>
					</Flex>
				</Flex>
			</Flex>

			<Flex
				mt={3}
				mr={3}
				justifyContent="flex-start"
				alignItems="flex-start"
				height="100%"
				fontSize="xl"
				fontWeight="bold"
				width={1}
				ref={graphRef}
				backgroundColor="paper"
			>
				<ResponsiveContainer height="90%" width="99%">
					<BarChart data={chartData}>
						<XAxis dataKey="label" fontSize={12} />
						<YAxis
							dataKey="count"
							fontSize={12}
							max={8}
							min={8}
							type="number"
							domain={[0, 'dataMax']}
						/>
						<Tooltip />
						<CartesianGrid
							stroke={theme.colors.textLight}
							vertical={false}
							strokeDasharray="3 3"
						/>
						<Bar dataKey="count" fill={theme.colors.primary} barSize={20} />

						<Brush
							dataKey="label"
							height={40}
							stroke={theme.colors.primary}
							className="GRAPH_EXPORT_BRUSH"
							startIndex={zoom.startIndex}
							endIndex={zoom.endIndex}
							onChange={({ startIndex, endIndex }) => {
								setZoom({ startIndex, endIndex });
							}}
						/>
					</BarChart>
				</ResponsiveContainer>
			</Flex>
		</Box>
	);
};

export default GraphView;
