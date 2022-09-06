/** @jsxImportSource @emotion/react */
import { css } from '@emotion/core';
import { FC } from 'react';
import { MdArrowBack, MdArrowForward } from 'react-icons/md';

import Text from 'components/styled/Text';

import { useTheme } from 'theme';

import { useMobileView } from 'hooks/useViewport';

import { SUB_HEADER_HEIGHT } from 'utils/useHeaderHeight';

import IconButton from './IconButton';

import { Flex } from '.';

const SubHeader: FC<{
	leftJsx: JSX.Element;
	mainJsx: JSX.Element;
	rightJsx?: JSX.Element;
	setMobileOverride?: React.Dispatch<React.SetStateAction<boolean>>;
	mobileOverride?: boolean;
}> = ({ leftJsx, rightJsx, mainJsx, setMobileOverride, mobileOverride }) => {
	const { isMobile } = useMobileView();
	const theme = useTheme();
	return (
		<Flex
			css={css`
				width: 100%;
				height: ${SUB_HEADER_HEIGHT}px;
				border-bottom: 1px solid ${theme.colors.border};
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
			<Flex width="100%">
				{isMobile && (
					<IconButton
						onClick={() => setMobileOverride?.(p => !p)}
						tooltip={mobileOverride ? 'Skrýt filtry' : 'Zobrazit filtry'}
					>
						<Text color="primary">
							{mobileOverride ? (
								<MdArrowBack size={22} />
							) : (
								<MdArrowForward size={22} />
							)}
						</Text>
					</IconButton>
				)}

				{mainJsx}
			</Flex>
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
