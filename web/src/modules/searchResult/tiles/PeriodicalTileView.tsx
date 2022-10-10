/** @jsxImportSource @emotion/react */
import { SerializedStyles } from '@emotion/core';
import { FC } from 'react';

import { Wrapper } from 'components/styled/Wrapper';
import TileGrid from 'components/tiles';

import { PublicationChild } from 'api/models';

import MonographTileItem from './MonographTileItem';
import PeriodicalTileItem from './PeriodicalTileItem';

type Props = {
	data?: PublicationChild[];
	onSelect?: (uuid: string) => void;
	gridGap?: number;
	tileWrapperCss?: (uuid: string) => SerializedStyles;
};

const PeriodicalTiles: FC<Props> = ({
	tileWrapperCss,
	data,
	onSelect,
	gridGap = 4,
}) => {
	const isMonograph = data?.[0]?.model === 'monographunit';
	return (
		<Wrapper p={2}>
			<TileGrid
				tileSize={isMonograph ? undefined : '120px'}
				isEmpty={data === undefined || data.length < 1}
				gridGap={gridGap}
			>
				{(data ?? []).map(d => {
					const isMonograph = d.model === 'monographunit';
					if (isMonograph) {
						return <MonographTileItem child={d} />;
					} else {
						return (
							<PeriodicalTileItem
								child={d}
								onSelect={onSelect}
								tileWrapperCss={tileWrapperCss}
							/>
						);
					}
				})}
			</TileGrid>
		</Wrapper>
	);
};

export default PeriodicalTiles;
