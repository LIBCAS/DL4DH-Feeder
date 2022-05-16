import React, { ComponentProps, FC } from 'react';
import { keyframes } from '@emotion/core';
import { space, SpaceProps } from 'styled-system';

import styled from 'theme/styled';

const rotate = keyframes`
	100% {
		transform: rotate(360deg);
	}
`;

const dash = keyframes`
	0% {
		stroke-dasharray: 1, 150;
		stroke-dashoffset: 0;
	}
	50% {
		stroke-dasharray: 90, 150;
		stroke-dashoffset: -35;
	}
	100% {
		stroke-dasharray: 90, 150;
		stroke-dashoffset: -124;
	}
`;

type Props = { color?: string; size?: number } & SpaceProps;

const Wrapper = styled.svg<Props>`
	animation: ${rotate} 2s linear infinite;
	width: ${p => p.size}px;
	height: ${p => p.size}px;

	& .path {
		stroke: ${p =>
			p.color
				? p.theme.colors[p.color as keyof typeof p.theme.colors] ?? p.color
				: p.theme.colors.primary};
		stroke-linecap: round;
		animation: ${dash} 1.5s ease-in-out infinite;
	}

	${space}
`;

const LoaderSpin: FC<ComponentProps<typeof Wrapper>> = ({
	size = 30,
	...props
}) => (
	<Wrapper {...props} viewBox="0 0 50 50" size={size}>
		<circle
			className="path"
			cx="25"
			cy="25"
			r="20"
			fill="none"
			strokeWidth="3"
		/>
	</Wrapper>
);

LoaderSpin.defaultProps = {
	size: 35,
};

export default LoaderSpin;
