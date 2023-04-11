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
				alignItems="center"
				justifyContent="center"
				textAlign="center"
				bg="formBg"
				px={4}
			>
				<div>
					<Text fontSize="xxl" fontWeight="600" color="warning">
						Upozornění!
					</Text>
					<Text fontSize="xxl" fontWeight="600" color="warning">
						Nebyly nalezeny žádné výsledky.
					</Text>
					<Text fontSize="xxl" fontWeight="600" color="warning">
						Prosím, zkuste jiný dotaz.
					</Text>
				</div>
			</Flex>
		</Flex>
	);
};

export default PubPageNotFound;
