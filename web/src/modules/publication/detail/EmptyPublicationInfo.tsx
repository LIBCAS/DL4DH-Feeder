import { FC } from 'react';
import { useTranslation } from 'react-i18next';

import { Flex } from 'components/styled';
import Text from 'components/styled/Text';

import { INIT_HEADER_HEIGHT } from 'utils/useHeaderHeight';

import { useImageProperties } from '../../../api/publicationsApi';
import { useInfoApi } from '../../../api/infoApi';

export const EmptyPublicationInfo: FC<{
	publication?: string;
	isMultiView?: boolean;
}> = ({ publication, isMultiView }) => {
	const { t } = useTranslation();

	const imageResponse = useImageProperties(publication ?? '', true);
	const info = useInfoApi();
	const isPdf =
		imageResponse &&
		!imageResponse.isLoading &&
		imageResponse.data?.type == 'application/pdf';

	return (
		<Flex
			width={isMultiView ? '50%' : '100%'}
			p={4}
			alignItems="center"
			justifyContent="center"
			fontWeight="bold"
			fontSize="xl"
			height={`calc(100vh - ${INIT_HEADER_HEIGHT}px)`}
		>
			<Flex
				justifyContent="center"
				alignItems="center"
				flexDirection="column"
				mt={-100}
			>
				<Text>
					{isPdf ? (
						<>
							{t('alert:pdf_publication')}{' '}
							<a
								target="_blank"
								rel="noreferrer"
								href={info.data?.kramerius.url + '/view/' + publication}
							>
								Kramerius7.
							</a>
						</>
					) : (
						t('alert:empty_publication')
					)}
				</Text>
			</Flex>
		</Flex>
	);
};
export default EmptyPublicationInfo;
