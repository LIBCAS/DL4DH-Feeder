/** @jsxImportSource @emotion/react */
import { FC } from 'react';
import { useTranslation } from 'react-i18next';

import Accordion from 'components/accordion';
import { Flex } from 'components/styled';
import PublishDateFilterForm from 'components/filters/Accordions/publishDateFilter/PublishDateFilterForm';

import { PublicationChild } from 'api/models';

import BibMain from '../detail/biblio/bib-main';

type Props = {
	variant: 'left' | 'right';
	defaultView?: 'detail' | 'search';
	pages: PublicationChild[];
};
const PeriodicalSidePanel: FC<Props> = ({ variant }) => {
	const { t } = useTranslation('search');
	return (
		<Flex position="relative" flexShrink={0} height="100%">
			{variant === 'right' && (
				<Flex
					position="absolute"
					height="100%"
					width={1}
					alignItems="flex-start"
					flexDirection="column"
				>
					<BibMain variant="right" />
				</Flex>
			)}
			{variant === 'left' && (
				<Accordion label={t('year-range.label')} isExpanded isLoading={false}>
					<PublishDateFilterForm />
				</Accordion>
			)}
		</Flex>
	);
};

export default PeriodicalSidePanel;
