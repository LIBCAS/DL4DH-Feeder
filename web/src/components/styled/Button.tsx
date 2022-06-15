/** @jsxImportSource @emotion/react */
import { css } from '@emotion/core';
import React, { forwardRef } from 'react';
import {
	color,
	layout,
	LayoutProps,
	typography,
	TypographyProps,
	space,
	SpaceProps,
	ColorProps,
} from 'styled-system';

import Link, { HrefLink } from 'components/styled/Link';
import { Box } from 'components/styled';
import LoaderSpin from 'components/loaders/LoaderSpin';

import styled from 'theme/styled';

type ButtonProps = {
	variant?: 'default' | 'primary' | 'outlined' | 'text' | 'confirm' | 'error';
	sizeType?: 'normal' | 'big'; // size is used by 'space'
};

type Props = LayoutProps &
	SpaceProps &
	TypographyProps &
	ButtonProps &
	ColorProps & { hoverDisable?: boolean };

export const resetButtonStyle = css`
	/* line-height: 1.5; */
	background: transparent;
	border: 0;
	cursor: pointer;
`;

// eslint-disable-next-line @typescript-eslint/ban-ts-comment
// @ts-ignore
const StyledButton = styled.button<Props>`
	${resetButtonStyle}

	background: ${p => p.theme.colors.secondary};
	padding: ${p => p.theme.space[2]}px ${p => p.theme.space[3]}px;

	font-size: ${p => p.theme.fontSizes.sm}px;
	font-family: 'Roboto', -apple-system, BlinkMacSystemFont, 'Segoe UI', 'Oxygen',
		'Ubuntu', 'Cantarell', 'Fira Sans', 'Droid Sans', 'Helvetica Neue',
		sans-serif;

	text-align: center;
	display: inline-flex;
	align-items: center;
	justify-content: center;
	transition: filter 250ms ease;

	&:disabled {
		${p =>
			p.variant !== 'text' &&
			css`
				background: ${p.theme.colors.darkerGrey};
				color: ${p.theme.colors.lightGrey};
				border: 1px solid ${p.theme.colors.lightGrey};
				cursor: not-allowed;
				&:hover {
					background: ${p.theme.colors.darkerGrey};
				}
			`}

		${p =>
			p.variant === 'text' &&
			css`
				color: ${p.theme.colors.darkerGrey};
			`}
	}

	${p =>
		p.variant !== 'text' &&
		css`
			color: white;
			min-width: 100px;
		`}

	${p =>
		p.variant === 'primary' &&
		css`
			background: ${p.theme.colors.primary};
			border: 1px solid ${p.theme.colors.primary};
			font-weight: 700;
		`}
		${p =>
		p.variant === 'primary' &&
		!p.hoverDisable &&
		css`
			&:hover {
				filter: brightness(1.1);
				box-shadow: 0px 0px 3px 1px rgba(0, 0, 0, 0.2);
			}
		`}

  	${p =>
		p.variant === 'outlined' &&
		css`
			background: transparent;
			border: 1px solid ${p.theme.colors.primary};
			font-weight: 700;
			color: ${p.theme.colors.primary};
			&:hover {
				filter: brightness(1.15);
				box-shadow: inset 0px 0px 3px 1px rgba(0, 0, 0, 0.05);
			}
		`}
		

	${p =>
		p.variant === 'confirm' &&
		css`
			background: ${p.theme.colors.success};
			border: 1px solid ${p.theme.colors.success};
			font-weight: 700;
		`}

	${p =>
		p.variant === 'error' &&
		css`
			background: ${p.theme.colors.error};
			border: 1px solid ${p.theme.colors.error};
			font-weight: 700;
		`}
  	
		${p =>
		p.variant === 'text' &&
		css`
			${!p.color && `color: ${p.theme.colors.primary};`}
			background: transparent;
			border: 0;
			&:hover {
				text-decoration: underline;
			}
		`}

    ${layout}
    ${space}
    ${typography}
		${color}
`;

type StyledButtonProps = React.ComponentProps<typeof StyledButton>;

StyledButton.defaultProps = {
	type: 'button',
	variant: 'default',
	sizeType: 'normal',
};

const Button = forwardRef<
	HTMLButtonElement,
	StyledButtonProps & { loading?: boolean; hoverDisable?: boolean }
>(({ children, loading, ...buttonProps }, ref) => (
	<StyledButton {...buttonProps} ref={ref}>
		{loading && (
			<Box display="inline-block" mr={2}>
				<LoaderSpin
					color={buttonProps.variant === 'outlined' ? 'primary' : 'white'}
					size={20}
				/>
			</Box>
		)}
		{children}
	</StyledButton>
));

Button.displayName = Button.name;

export const NavButton = styled(StyledButton)`
	cursor: pointer;
`;

export const NavLinkButton = NavButton.withComponent(Link);
export const NavHrefButton = styled(NavButton)`
	text-decoration: none;
	&:hover {
		text-decoration: none;
	}
`.withComponent(HrefLink);

export default Button;
