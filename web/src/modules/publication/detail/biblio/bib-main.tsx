import React from 'react';
import { useLocation, useParams, useSearchParams } from 'react-router-dom';
import { useTranslation } from 'react-i18next';

import { Box } from 'components/styled';
import Text from 'components/styled/Text';

import { Loader } from 'modules/loader';

import useMetadata, { useMetadataFormatter } from 'hooks/useMetadata';

import { BibRootInfo } from './bib-rows';

type Props = {
	variant: 'left' | 'right';
	isSecond?: boolean;
};

const BibMain: React.FC<Props> = () => {
	const { t } = useTranslation();
	const { id } = useParams<{ id: string }>();
	const [sp] = useSearchParams();
	const pageUrl = sp.get('page');
	const { fcm, isLoading, pageTitle } = useMetadata(pageUrl ?? id ?? '');
	const { format } = useMetadataFormatter();
	const formatted = format(fcm);
	if (isLoading) {
		return <Loader />;
	}

	console.log({ fcm, formatted });
	return (
		<>
			<BibRootInfo formatted={formatted}>
				{formatted.slice(1).map(f => (
					<BibRootInfo key={f.pid} formatted={[f]} />
				))}
			</BibRootInfo>
			{pageTitle && (
				<Box mb={3}>
					{t('metadata:page')}
					<Text fontSize="13.5px" color="#9e9e9e">
						{pageTitle}
					</Text>
				</Box>
			)}
		</>
	);
};

export default BibMain;
