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
} from 'recharts';

import Text from 'components/styled/Text';
import { Box, Flex } from 'components/styled';
import TitleText from 'components/styled/TitleText';
import SimpleSelect from 'components/form/select/SimpleSelect';

import { useTheme } from 'theme';

import { AvailableFilters } from 'api/models';

import { mapLangToCS } from 'utils/languagesMap';

type Props = {
	data: AvailableFilters;
};

type OptionXAxisType = {
	key: keyof AvailableFilters;
	label: string;
	itemLabelFunction?: (key: string) => string;
};
type OptionXAxisSorting = 'key' | 'count';

const OptionsXAxis: OptionXAxisType[] = [
	{ key: 'years', label: 'Léta' },
	{ key: 'authors', label: 'Autor' },
	{ key: 'keywords', label: 'Klíčové slovo' },
	{ key: 'models', label: 'Typ dokumentu' },
	{
		key: 'languages',
		label: 'Jazyk',
		itemLabelFunction: (key: string) => mapLangToCS?.[key] ?? key,
	},
];

const SortingText: Record<OptionXAxisSorting, string> = {
	key: 'Klíč',
	count: 'Četnost',
};
const GraphView: FC<Props> = ({ data }) => {
	const theme = useTheme();
	//const [zoom, setZoom] = useState(50);
	const [sorting, setSorting] = useState<OptionXAxisSorting>('key');
	const [axisX, setAxisX] = useState<OptionXAxisType>(OptionsXAxis[0]);
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
				.sort((a, b) => parseInt(b[sorting]) - parseInt(a[sorting])),
		[formattedData, sorting, axisX],
	);

	return (
		<Box position="relative" height="100%" width={1}>
			<Flex justifyContent="space-between" m={2} alignItems="center">
				<TitleText textAlign="left" ml={1}>
					Záznamy v grafickej podobe
				</TitleText>
				<Flex alignItems="center">
					<Text mr={2}>Os X</Text>
					<SimpleSelect
						label=""
						options={OptionsXAxis}
						onChange={item => setAxisX(item)}
						nameFromOption={item => item?.label ?? ''}
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
						Seřadit dle
					</Text>
					<SimpleSelect<OptionXAxisSorting>
						options={['key', 'count']}
						nameFromOption={item => SortingText[item ?? 'key']}
						onChange={newVal => setSorting(newVal)}
						value={sorting}
						width={100}
						variant="outlined"
						menuItemCss={css`
							width: 100px;
						`}
					/>
					{/* <Flex
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
							<IconButton color="primary" onClick={() => setZoom(z => z + 10)}>
								<MdZoomOut size={24} />
							</IconButton>
						</Flex>
						<Flex
							width={40}
							height={36}
							bg="primary"
							ml={2}
							alignItems="center"
							justifyContent="center"
						>
							<IconButton
								m={0}
								color="white"
								onClick={() => setZoom(z => (z > 10 ? z - 10 : z - 1))}
							>
								<MdZoomIn size={24} />
							</IconButton>
						</Flex>
					</Flex> */}
				</Flex>
			</Flex>
			<Flex
				mt={3}
				mr={3}
				justifyContent="flex-start"
				alignItems="flex-start"
				height="90%"
				width={1}
				fontSize="xl"
				fontWeight="bold"
			>
				<ResponsiveContainer width={'100%'} height="95%">
					<BarChart data={chartData}>
						<XAxis dataKey="label" fontSize={12} />
						<YAxis
							dataKey="count"
							fontSize={12}
							max={4}
							min={4}
							type="number"
							domain={[0, 'dataMax']}
						/>
						<Tooltip />
						<CartesianGrid
							stroke={theme.colors.textLight}
							vertical={false}
							//	horizontalPoints={[10, 20, 30, 40, 50, 60, 70, 80, 90, 100]}
							// strokeDasharray="4"
							strokeDasharray="3 3"
						/>
						<Bar dataKey="count" fill={theme.colors.primary} barSize={20} />
					</BarChart>
				</ResponsiveContainer>
			</Flex>
		</Box>
	);
};

export default GraphView;
