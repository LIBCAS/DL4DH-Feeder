/** @jsxImportSource @emotion/react */
import { css } from '@emotion/core';
import { FC } from 'react';

import { useTheme } from 'theme';

import { useMobileView } from 'hooks/useViewport';

import { SUB_HEADER_HEIGHT } from 'utils/useHeaderHeight';

import { Flex } from '.';

const SubHeader: FC<{
	leftJsx: JSX.Element;
	mainJsx: JSX.Element;
	rightJsx?: JSX.Element;
}> = ({ leftJsx, rightJsx, mainJsx }) => {
	const { isMobile } = useMobileView();
	const theme = useTheme();
	return (
		<Flex
			css={css`
				width: 100%;
				height: ${SUB_HEADER_HEIGHT}px;
				box-shadow: 7px -2px 5px 5px rgba(0, 0, 0, 0.03);
			`}
			bg="white"
			zIndex={1}
		>
			<Flex
				flexShrink={0}
				width={isMobile ? 0 : 300}
				overflow="hidden"
				css={css`
					border-right: 1px solid ${theme.colors.border};
					transition: width 0.1s ease-in-out;
				`}
			>
				{leftJsx}
			</Flex>
			<Flex width="100%">{mainJsx}</Flex>
			{rightJsx && (
				<Flex
					width={isMobile ? 0 : 300}
					flexShrink={0}
					css={css`
						transition: width 0.1s ease-in-out;
					`}
				>
					{rightJsx}
				</Flex>
			)}
		</Flex>
	);
};
export default SubHeader;
