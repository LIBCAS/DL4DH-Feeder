/** @jsxImportSource @emotion/react */
import { css } from '@emotion/react';

import { Flex } from 'components/styled';
import Text from 'components/styled/Text';

import { useTheme } from 'theme';

type Props = {
	isSecond?: boolean;
	multiview?: boolean;
};
const PubPageNotFound: React.FC<Props> = ({ multiview, isSecond }) => {
	const theme = useTheme();
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
				//height="100vh"
				alignItems="center"
				justifyContent="center"
				bg="formBg"
			>
				<Text fontSize="xl" fontWeight="600" color="warning">
					Upozornění! Nebyly nalezeny žádné výsledky. Prosím, zkuste jiný dotaz.
				</Text>
			</Flex>
		</Flex>
	);
};

export default PubPageNotFound;
