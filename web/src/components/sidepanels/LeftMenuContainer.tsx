/** @jsxImportSource @emotion/react */
import { css } from '@emotion/core';
import { FC } from 'react';

import { Flex } from 'components/styled';

import { useTheme } from 'theme';

import { useMobileView } from 'hooks/useViewport';

const LeftMenuContainer: FC<{ mobileOverride?: boolean }> = ({
	mobileOverride,
	children,
}) => {
	const { isMobile } = useMobileView();
	const theme = useTheme();
	return (
		<Flex
			position="relative"
			alignItems="flex-start"
			flexDirection="column"
			flexShrink={0}
			// eslint-disable-next-line no-nested-ternary
			width={mobileOverride ? 1 : isMobile ? 0 : 300}
			overflowY="auto"
			css={css`
				border-right: 1px solid ${theme.colors.border};
				transition: width 0.1s ease-in-out;
				/* box-shadow: 5px -3px 7px -4px rgba(0, 0, 0, 0.08); */
			`}
		>
			{children}
		</Flex>
	);
};
export default LeftMenuContainer;
