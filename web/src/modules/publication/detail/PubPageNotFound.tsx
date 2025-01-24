/** @jsxImportSource @emotion/react */
import { css } from '@emotion/react';
import { useTranslation } from 'react-i18next';

import { Flex } from 'components/styled';
import Text from 'components/styled/Text';

import { useTheme } from 'theme';

type Props = {
	isSecond?: boolean;
	multiview?: boolean;
};
const PubPageNotFound: React.FC<Props> = ({ multiview, isSecond }) => {
	const theme = useTheme();
	const { t } = useTranslation('alert');
	return (
		<Flex
			width={multiview ? 1 / 2 : 1}
			bg="border"
			alignItems="center"
			position="relative"
			height="100vh"
			css={css`
				border-left: ${isSecond ? 2 : 0}px solid ${theme.colors.primary};
			`}
		>
			<Flex
				width={1}
				alignItems="center"
				justifyContent="center"
				textAlign="center"
				bg="formBg"
				px={4}
			>
				<div>
					<Text fontSize="xxl" fontWeight="600" color="warning">
						{t('warning')}
					</Text>
					<Text fontSize="xxl" fontWeight="600" color="warning">
						{t('book_no_results')}
					</Text>
					<Text fontSize="xxl" fontWeight="600" color="warning">
						{t('try_different_query')}
					</Text>
				</div>
			</Flex>
		</Flex>
	);
};

export default PubPageNotFound;
