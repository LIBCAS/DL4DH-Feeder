/** @jsxImportSource @emotion/react */
import { css } from '@emotion/react';
import { useState } from 'react';
import { MdArrowBack, MdArrowForward, MdExpandMore } from 'react-icons/md';

import MyAccordion from 'components/accordion';
import { Box, Flex } from 'components/styled';
import Text from 'components/styled/Text';
import { Wrapper } from 'components/styled/Wrapper';

import { useTheme } from 'theme';

const DetailLeftMenu = () => {
	const theme = useTheme();
	const [leftCollapsed, setLeftCollapsed] = useState(false);
	return (
		<Flex
			position="relative"
			maxHeight="100vh"
			width={leftCollapsed ? '1px' : 300}
			flexShrink={0}
			css={css`
				border-right: 1px solid ${theme.colors.border};
				transition: width 200ms ease-in-out;
			`}
		>
			<Flex
				position="relative"
				alignItems="flex-start"
				overflowY="auto"
				width={1}
			>
				<Flex px={2} width={1} flexDirection="column">
					<MyAccordion label="Informacie" isExpanded>
						{Array.from(Array(5).keys()).map(i => (
							<Text key={i}>{i}</Text>
						))}
					</MyAccordion>
				</Flex>
			</Flex>
			<Flex
				bg="primaryLight"
				position="absolute"
				right={0}
				top={2}
				zIndex={5555}
				onClick={() => setLeftCollapsed(p => !p)}
				marginRight="-28px"
				alignItems="center"
				justifyContent="center"
				width={26}
				height={50}
				css={css`
					border: 1px solid ${theme.colors.border};
					border-left: none;
					border-top-right-radius: 10%;
					border-bottom-right-radius: 10%;
					cursor: pointer;
					box-shadow: 1px 1px 3px 3px rgba(0, 0, 0, 0.01);
				`}
			>
				{leftCollapsed ? (
					<MdExpandMore
						size={16}
						css={css`
							transform: rotate(90deg);
						`}
					/>
				) : (
					<MdExpandMore
						size={16}
						css={css`
							transform: rotate(-90deg);
						`}
					/>
				)}
			</Flex>
		</Flex>
	);
};
export default DetailLeftMenu;
