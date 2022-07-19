/** @jsxImportSource @emotion/react */
import { css } from '@emotion/react';
import { MdExpandMore } from 'react-icons/md';
import { FC } from 'react';

import { Flex } from 'components/styled';

import { useTheme } from 'theme';

type Props = {
	onClick: () => void;
	isCollapsed?: boolean;
	variant: 'left' | 'right';
};

const SidePanelHideButton: FC<Props> = ({ onClick, isCollapsed, variant }) => {
	const theme = useTheme();
	return (
		<Flex
			bg="primaryLight"
			position="absolute"
			right={variant === 'left' ? 0 : 'unset'}
			left={variant === 'right' ? 0 : 'unset'}
			top={2}
			zIndex={1}
			onClick={onClick}
			marginRight={variant === 'left' ? '-28px' : 'unset'}
			marginLeft={variant === 'right' ? '-28px' : 'unset'}
			alignItems="center"
			justifyContent="center"
			width={26}
			height={50}
			css={css`
				border: 1px solid ${theme.colors.border};
				cursor: pointer;
				box-shadow: 1px 1px 3px 3px rgba(0, 0, 0, 0.01);
				&:hover {
					background-color: ${theme.colors.primary};
					color: white;
				}
				${variant === 'left' &&
				css`
					border-left: none;
					border-top-right-radius: 10%;
					border-bottom-right-radius: 10%;
				`}
				${variant === 'right' &&
				css`
					border-right: none;
					border-top-left-radius: 10%;
					border-bottom-left-radius: 10%;
				`}
			`}
		>
			{isCollapsed ? (
				<MdExpandMore
					size={24}
					css={css`
						transform: rotate(${variant === 'left' ? -90 : 90}deg);
					`}
				/>
			) : (
				<MdExpandMore
					size={24}
					css={css`
						transform: rotate(${variant === 'left' ? 90 : -90}deg);
					`}
				/>
			)}
		</Flex>
	);
};

export default SidePanelHideButton;
