/** @jsxImportSource @emotion/react */
import { css } from '@emotion/react';

import MyAccordion from 'components/accordion';
import { Box, Flex } from 'components/styled';
import Text from 'components/styled/Text';

import { useTheme } from 'theme';

const DetailLeftMenu = () => {
	const theme = useTheme();
	return (
		<Flex
			position="relative"
			alignItems="flex-start"
			flexShrink={0}
			width={300}
			overflowY="auto"
			// width={leftCollapsed ? 10 : 300}
			// onClick={() => setLeftCollapsed(p => !p)}
			css={css`
				border-right: 1px solid ${theme.colors.border};
				transition: width 1s ease-in-out;
			`}
		>
			{' '}
			{/*hide button TODO: */}
			{/* <Flex bg="red" position="absolute" right={0} top={0}>
            ahoj
        </Flex> */}
			<Box px={2} width={1}>
				<MyAccordion label="Informacie" isExpanded>
					{[0, 1, 2, 3, 4, 5, 6].map(i => (
						<Text key={i}>{i}</Text>
					))}
				</MyAccordion>
			</Box>
		</Flex>
	);
};
export default DetailLeftMenu;
