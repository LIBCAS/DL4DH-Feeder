import React, { FC, ReactNode } from 'react';
import { useTranslation } from 'react-i18next';

import { Flex, Grid } from 'components/styled';
import Text from 'components/styled/Text';
import Paper from 'components/styled/Paper';

import { Loader } from 'modules/loader';

type Props = {
	isEmpty: boolean;
	isLoading?: boolean;
	noResults?: string | ReactNode | null;
	fullWidthItems?: boolean;
	tileSize?: string;
	gridGap?: number;
};

const TileGrid: FC<Props> = ({
	isEmpty,
	isLoading,
	noResults,
	fullWidthItems,
	tileSize = '320px',
	children,
	gridGap = 4,
}) => {
	const { t } = useTranslation('alert');
	const noResultMessage =
		noResults ?? `${t('warning')}! ${t('no_results_found')}`;

	return (
		<>
			{isLoading && <Loader />}
			{!isLoading && isEmpty && (
				<Flex
					flexDirection="column"
					justifyContent="center"
					flexGrow={1}
					my={3}
				>
					{typeof noResultMessage === 'string' ? (
						<Paper
							alignItems="center"
							justifyContent="center"
							bg="paper"
							color="warning"
						>
							<Text fontWeight="bold" textAlign="center" fontSize="xxl">
								{noResultMessage}
							</Text>
						</Paper>
					) : (
						noResultMessage
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
};
export default TileGrid;
