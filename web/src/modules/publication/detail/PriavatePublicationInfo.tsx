import { FC } from 'react';
import { useTranslation } from 'react-i18next';
import { MdLock } from 'react-icons/md';

import { Flex } from 'components/styled';
import Text from 'components/styled/Text';

import { INIT_HEADER_HEIGHT } from 'utils/useHeaderHeight';

export const PriavatePublicationInfo: FC<{ isMultiView?: boolean }> = ({
	isMultiView,
}) => {
	const { t } = useTranslation();
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
				<MdLock size={60} />
				<Text>{t('licence:private_label')}</Text>
			</Flex>
		</Flex>
	);
};
export default PriavatePublicationInfo;
