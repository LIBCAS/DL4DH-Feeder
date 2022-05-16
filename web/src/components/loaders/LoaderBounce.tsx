import React, { ComponentProps, FC } from 'react';
import { keyframes } from '@emotion/core';

import { Flex } from 'components/styled';

import styled from 'theme/styled';

const bounce = keyframes`
  0%,
  80%,
  100% {
    transform: scale(0);
  }
  40% {
    transform: scale(1);
  }
`;

const Wrapper = styled(Flex)`
	margin: 0 auto;
	text-align: center;

	& > div {
		width: 18px;
		height: 18px;
		margin: 0 2px;
		background-color: currentColor;
		border-radius: 100%;
		display: inline-block;
		animation: ${bounce} 1.4s infinite ease-in-out both;
	}

	.bounce1 {
		animation-delay: -0.32s;
	}

	.bounce2 {
		animation-delay: -0.16s;
	}
`;

const LoaderBounce: FC<ComponentProps<typeof Wrapper>> = props => (
	<Wrapper alignItems="center" width="100%" justifyContent="center" {...props}>
		<div className="bounce1" />
		<div className="bounce2" />
		<div className="bounce3" />
	</Wrapper>
);

export default LoaderBounce;
