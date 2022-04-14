import { css } from '@emotion/core';
import isPropValid from '@emotion/is-prop-valid';
import { MenuList } from '@reach/menu-button';

import { Box } from 'components/styled';
import { resetButtonStyle } from 'components/styled/Button';

import styled from 'theme/styled';

export const StyledMenuList = styled(MenuList)`
	padding: 0px;
	margin-top: ${p => p.theme.space[1]}px;
	font-size: ${p => p.theme.fontSizes.lg}px;
	border-color: ${p => p.theme.colors.lightGrey};
	border-top: none;
	background: #ffffff;
	border-radius: 5px;
	max-width: 60vw;
	margin-right: ${p => p.theme.space[4]}px;
	filter: drop-shadow(0 20px 10px rgba(0, 0, 0, 0.2));

	& [data-reach-menu-item] {
		padding: ${p => p.theme.space[2]}px ${p => p.theme.space[3]}px;
	}

	& [data-reach-menu-item][data-selected] {
		background: ${p => p.theme.colors.primaryLight};
		color: #ffffff;
		text-decoration: none;
	}
`;

export const MenuHeader = styled.div`
	background: ${p => p.theme.colors.primary};
	color: #ffffff;
	font-weight: bold;

	&[data-reach-menu-item][data-selected] {
		background: ${p => p.theme.colors.primary};
		color: #ffffff;
	}
`;

export const MenuAvatar = styled(Box, {
	shouldForwardProp: isPropValid,
})<{ isOpen?: boolean; disabled?: boolean; border?: boolean }>`
	${resetButtonStyle}

	padding: 0;
	border-radius: 50%;
	overflow: hidden;
	width: 40px;
	height: 40px;
	flex-shrink: 0;
	display: flex;
	justify-content: center;
	align-items: center;

	${p =>
		p.border &&
		css`
			border: 1px solid ${p.theme.colors.darkerGrey};
		`}

	${p =>
		p.disabled &&
		css`
			color: ${p.theme.colors.darkerGrey};
		`}

	${p =>
		!p.disabled &&
		css`
			color: ${p.isOpen ? p.theme.colors.darkerGrey : 'black'};
		`}
`;
