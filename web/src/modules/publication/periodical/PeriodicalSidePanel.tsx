/** @jsxImportSource @emotion/react */
import { FC } from 'react';

import Accordion from 'components/accordion';
import { Flex } from 'components/styled';

import PublishDateFilter from 'modules/public/homepage/leftPanel/PublishDateFilter';

import { PublicationChild } from 'api/models';

import PubBiblioDetail from '../detail/PubBiblioDetail';

type Props = {
	variant: 'left' | 'right';
	defaultView?: 'detail' | 'search';
	pages: PublicationChild[];
};
const PeriodicalSidePanel: FC<Props> = ({ variant }) => {
	return (
		<Flex position="relative" flexShrink={0}>
			{variant === 'right' && <PubBiblioDetail variant="right" />}
			{variant === 'left' && (
				<Accordion label="Rok vydání" isExpanded isLoading={false}>
					<PublishDateFilter />
				</Accordion>
			)}
		</Flex>
	);
};

export default PeriodicalSidePanel;
