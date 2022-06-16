/** @jsxImportSource @emotion/react */
import { css } from '@emotion/react';
import { FC, useState } from 'react';

import { Flex } from 'components/styled';

import { useTheme } from 'theme';

import { PublicationChild } from 'api/models';

import PubBiblioDetail from '../detail/PubBiblioDetail';

type Props = {
	variant: 'left' | 'right';
	defaultView?: 'detail' | 'search';
	//	page: string;
	pages: PublicationChild[];
	width?: number;
};
const PeriodicalSidePanel: FC<Props> = ({
	variant,
	defaultView,
	pages,
	width = 300,
}) => {
	const theme = useTheme();

	const [viewMode, setViewMode] = useState<'detail' | 'search'>(
		defaultView ?? 'detail',
	);

	return (
		<Flex
			position="relative"
			width={width}
			flexShrink={0}
			height="100vh"
			css={css`
				${variant === 'left' &&
				css`
					border-right: 1px solid ${theme.colors.border};
				`}
				${variant === 'right' &&
				css`
					border-left: 1px solid ${theme.colors.border};
				`}
        transition: width 200ms ease-in-out;
			`}
		>
			{variant === 'right' && <PubBiblioDetail />}
		</Flex>
	);
};

export default PeriodicalSidePanel;
