import React from 'react';
import { useTranslation } from 'react-i18next';

import { Box } from 'components/styled';
import { NavHrefButton } from 'components/styled/Button';
import Text from 'components/styled/Text';

import norwayImg from 'assets/img/donator_norway.png';
import k3tok5Img from 'assets/img/donator_k3tok5.png';
import eodopenImg from 'assets/img/donator_eodopen.png';

type Props = {
	donators: string[];
};

const mapDonatorImage: Record<string, string> = {
	'donator:norway': norwayImg,
	'donator:eoopen': eodopenImg,
	'donator:k3tok5': k3tok5Img,
};

const BibDonators: React.FC<Props> = ({ donators }) => {
	const { t } = useTranslation();

	if (donators.length === 0) {
		return <></>;
	}

	return (
		<Box>
			<Text>{t('metadata:donator')}</Text>
			{donators.map(d => (
				<NavHrefButton
					key={d}
					variant="text"
					href={t(`${d}.url`)}
					target="_blank"
					title={t(`${d}.name`)}
				>
					<img
						src={mapDonatorImage[d]}
						alt={t(`${d}.name`)}
						title={t(`${d}.name`)}
					/>
				</NavHrefButton>
			))}
		</Box>
	);
};
export default BibDonators;
