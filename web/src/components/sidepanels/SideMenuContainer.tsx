/** @jsxImportSource @emotion/react */
import { css } from '@emotion/core';
import { FC } from 'react';

import { Flex } from 'components/styled';

import { useTheme } from 'theme';

import { useMobileView } from 'hooks/useViewport';

const SideMenuContainer: FC<{
	mobileOverride?: boolean;
	variant: 'left' | 'right';
}> = ({ mobileOverride, children, variant = 'left' }) => {
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
				${variant === 'left' &&
				css`
					border-right: 1px solid ${theme.colors.border};
				`}
				${variant === 'right' &&
				css`
					border-left: 1px solid ${theme.colors.border};
				`}

				transition: width 0.1s ease-in-out;
				/* box-shadow: 5px -3px 7px -4px rgba(0, 0, 0, 0.08); */
			`}
		>
			{children}
		</Flex>
	);
};
export default SideMenuContainer;
