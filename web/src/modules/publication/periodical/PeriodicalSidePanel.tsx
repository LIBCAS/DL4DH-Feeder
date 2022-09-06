/** @jsxImportSource @emotion/react */
import { css } from '@emotion/react';
import { FC } from 'react';

import { Flex } from 'components/styled';
import Accordion from 'components/accordion';

import PublishDateFilter from 'modules/public/homepage/leftPanel/PublishDateFilter';

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

	width = 300,
}) => {
	const theme = useTheme();

	return (
		<Flex
			position="relative"
			width={width}
			minWidth={width}
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
			{variant === 'left' && (
				<Accordion label="Rok vydání" isExpanded isLoading={false}>
					<PublishDateFilter />
				</Accordion>
			)}
		</Flex>
	);
};

export default PeriodicalSidePanel;
