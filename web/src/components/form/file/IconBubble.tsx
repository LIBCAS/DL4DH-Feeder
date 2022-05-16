/** @jsxImportSource @emotion/react */
import { css } from '@emotion/react';
import React from 'react';

import { Flex } from 'components/styled';

const IconBubble: React.FC<{ variant: string }> = ({ children, variant }) => (
	<Flex
		bg={
			// eslint-disable-next-line no-nested-ternary
			variant === 'error'
				? 'error'
				: variant === 'success'
				? 'success'
				: 'border'
		}
		width={64}
		height={64}
		alignItems="center"
		justifyContent="center"
		color="white"
		css={css`
			border-radius: 50%;
			border: 1px solid white;
		`}
	>
		{children}
	</Flex>
);

export default IconBubble;
