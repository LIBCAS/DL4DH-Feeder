import React, { FC, ReactNode } from 'react';

import { Box, Flex, Grid } from 'components/styled';
import Text from 'components/styled/Text';
import Paper from 'components/styled/Paper';

import { Loader } from 'modules/loader';

type Props = {
	isEmpty: boolean;
	isLoading?: boolean;
	noResults?: string | ReactNode;
	fullWidthItems?: boolean;
	tileSize?: string;
};

const TileGrid: FC<Props> = ({
	isEmpty,
	isLoading,
	noResults = 'Žádné položky nevyhovují požadavkům',
	fullWidthItems,
	tileSize = '320px',
	children,
}) => (
	<>
		{isLoading && <Loader />}
		{!isLoading && isEmpty && (
			<Flex flexDirection="column" justifyContent="center" flexGrow={1} my={3}>
				{typeof noResults === 'string' ? (
					<Paper alignItems="center" justifyContent="center">
						<Text fontWeight="bold" textAlign="center" fontSize="xl">
							{noResults}
						</Text>
						{/* <Box
							as={p => (
								<img src={fileSearchingImage} alt="Žádné výsledky" {...p} />
							)}
							mb={3}
						/> */}
						[Žádné výsledky]
					</Paper>
				) : (
					noResults
				)}
			</Flex>
		)}
		{!isLoading && !isEmpty && (
			<Grid
				gridGap={4}
				gridTemplateColumns={[
					`1fr`,
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
