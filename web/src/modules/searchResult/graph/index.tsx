import { FC } from 'react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip } from 'recharts';
import { groupBy } from 'lodash-es';
import useMeasure from 'react-use-measure';

import { Box, Flex } from 'components/styled';

import { useTheme } from 'theme';

import { TPublication } from 'api/models';

const ZOOM = 10;

type Props = {
	data?: TPublication[];
};
const GraphView: FC<Props> = ({ data }) => {
	const theme = useTheme();

	const [wrapperRef, { width, height }] = useMeasure({
		debounce: 10,
	});

	if (!data) {
		return <>ziadne data</>;
	}
	const formattedData = groupBy(
		data.filter(p => p.published !== undefined),
		d => {
			const year = new Date(d.published).getFullYear();
			return Math.round(year / ZOOM) * ZOOM;
		},
	);

	const chartData = Object.keys(formattedData).map(key => ({
		year: key,
		count: formattedData[key].length,
	}));

	return (
		<Flex
			mt={3}
			mr={3}
			justifyContent="center"
			alignItems="center"
			height="100%"
			width={1}
			fontSize="xl"
			fontWeight="bold"
			ref={wrapperRef}
		>
			<Box position="relative" width={width} height={height}>
				<BarChart data={chartData} width={width - 16} height={height - 16}>
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
					<CartesianGrid stroke="#f5f5f5" />
					<Bar
						dataKey="count"
						fill={theme.colors.primary}
						color="red"
						barSize={20}
					/>
				</BarChart>
			</Box>
		</Flex>
	);
};

export default GraphView;
