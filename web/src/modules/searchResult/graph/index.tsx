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
import { groupBy } from 'lodash-es';
import { MdZoomIn, MdZoomOut } from 'react-icons/md';

import { Box, Flex } from 'components/styled';
import TitleText from 'components/styled/TitleText';
import SimpleSelect from 'components/form/select/SimpleSelect';
import IconButton from 'components/styled/IconButton';

import { useTheme } from 'theme';
import { MakeTuple } from 'utils';

import { TPublication } from 'api/models';

type Props = {
	data: TPublication[];
};

const XAxisOptTuple = MakeTuple('authors', 'date');
type XAxisOpts = typeof XAxisOptTuple[number];

const GraphView: FC<Props> = ({ data }) => {
	const theme = useTheme();
	const [zoom, setZoom] = useState(50);
	const [axisX, setAxisX] = useState<XAxisOpts>('date');

	const formattedData = useMemo(
		() =>
			groupBy(
				data.filter(p => p[axisX] !== undefined),
				d => {
					if (axisX === 'date') {
						const year = new Date(d.date).getFullYear();
						return Math.round(year / zoom) * zoom;
					}

					return d.date;
				},
			),
		[zoom, data, axisX],
	);

	const chartData = useMemo(
		() =>
			Object.keys(formattedData).map(key => ({
				year: key,
				count: formattedData[key].length,
			})),
		[formattedData],
	);

	return (
		<Box position="relative" height="100%" width={1}>
			<Flex justifyContent="space-between" m={2} alignItems="center">
				<TitleText textAlign="left" ml={1}>
					Záznamy v grafickej podobe
				</TitleText>
				<Flex>
					<SimpleSelect
						label="Os X"
						options={XAxisOptTuple}
						onChange={item => setAxisX(item)}
						value={axisX}
						minWidth={200}
						variant="outlined"
						labelMinWidth={50}
					/>
					<SimpleSelect
						ml={3}
						label="Seřadit dle"
						options={[1, 2, 3]}
						onChange={() => null}
						value={2}
						minWidth={250}
						variant="outlined"
						labelMinWidth={100}
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
					</Flex>
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
						<XAxis dataKey="year" fontSize={12} />
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
