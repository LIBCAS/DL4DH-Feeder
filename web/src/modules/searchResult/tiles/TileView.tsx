/** @jsxImportSource @emotion/react */
import { SerializedStyles } from '@emotion/core';
import { FC, ReactNode } from 'react';

import { Wrapper } from 'components/styled/Wrapper';
import TileGrid from 'components/tiles';

import { PublicationDto } from 'api/models';

import GenericTileItem from './GenericTileItem';

type Props = {
	data?: PublicationDto[];
	tileWrapperCss?: (uuid: string) => SerializedStyles;
	onSelect?: (uuid: string) => void;
	noResultsMsg?: string | ReactNode;
};

const TileView: FC<Props> = ({
	data,
	tileWrapperCss,
	onSelect,
	noResultsMsg,
}) => {
	return (
		<Wrapper p={2}>
			<TileGrid
				tileSize="300px"
				isEmpty={data === undefined || data.length < 1}
				noResults={noResultsMsg}
			>
				{(data ?? []).map(d => (
					<GenericTileItem
						key={d.pid}
						publication={d}
						tileWrapperCss={tileWrapperCss}
						onSelect={onSelect}
					/>
				))}
			</TileGrid>
		</Wrapper>
	);
};

export default TileView;
