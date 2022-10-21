import React, { FC, ReactNode } from 'react';

import { Flex, Grid } from 'components/styled';
import Text from 'components/styled/Text';
import Paper from 'components/styled/Paper';

import { Loader } from 'modules/loader';

type Props = {
	isEmpty: boolean;
	isLoading?: boolean;
	noResults?: string | ReactNode;
	fullWidthItems?: boolean;
	tileSize?: string;
	gridGap?: number;
};

const TileGrid: FC<Props> = ({
	isEmpty,
	isLoading,
	noResults = 'Upozornění! Nebyly nalezeny žádné výsledky. Prosím, zkuste jiný dotaz.',
	fullWidthItems,
	tileSize = '320px',
	children,
	gridGap = 4,
}) => (
	<>
		{isLoading && <Loader />}
		{!isLoading && isEmpty && (
			<Flex flexDirection="column" justifyContent="center" flexGrow={1} my={3}>
				{typeof noResults === 'string' ? (
					<Paper
						alignItems="center"
						justifyContent="center"
						bg="paper"
						color="warning"
					>
						<Text fontWeight="bold" textAlign="center" fontSize="xxl">
							{noResults}
						</Text>
					</Paper>
				) : (
					noResults
				)}
			</Flex>
		)}
		{!isLoading && !isEmpty && (
			<Grid
				gridGap={gridGap}
				gridTemplateColumns={[
					`repeat(auto-fill, ${
						fullWidthItems ? '1fr' : `minmax(${tileSize}, 1fr)`
					})`,
				]}
				justifyItems={fullWidthItems ? 'stretch' : 'center'}
				alignItems="stretch"
			>
				{children}
			</Grid>
		)}
	</>
);
export default TileGrid;
