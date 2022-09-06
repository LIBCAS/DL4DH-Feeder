/** @jsxImportSource @emotion/react */
import { css } from '@emotion/core';
import { FC, useState } from 'react';

import SideMenuContainer from 'components/sidepanels/SideMenuContainer';
import { Box, Flex } from 'components/styled';
import SubHeader from 'components/styled/SubHeader';

import { useMobileView } from 'hooks/useViewport';

import { INIT_HEADER_HEIGHT, SUB_HEADER_HEIGHT } from 'utils/useHeaderHeight';

type Props = {
	subHeader: {
		leftJsx: JSX.Element;
		mainJsx: JSX.Element;
		rightJsx?: JSX.Element;
	};
	body: {
		leftJsx: JSX.Element;
		rightJsx?: JSX.Element;
	};
};

export const MainContainer: FC<Props> = ({ subHeader, body, children }) => {
	const [mobileOverride, setMobileOverride] = useState(false);
	const { isMobile } = useMobileView();

	return (
		<>
			<SubHeader
				{...subHeader}
				mobileOverride={mobileOverride}
				setMobileOverride={setMobileOverride}
			/>
			<Flex
				bg="white"
				css={css`
					width: 100%;
					height: calc(100vh - ${INIT_HEADER_HEIGHT + SUB_HEADER_HEIGHT}px);
				`}
			>
				<SideMenuContainer
					mobileOverride={isMobile && mobileOverride}
					variant="left"
				>
					<Box pt={1} width={1}>
						{body.leftJsx}
					</Box>
				</SideMenuContainer>
				<Flex
					width={1}
					bg="paper"
					css={css`
						display: ${isMobile && mobileOverride ? 'none' : 'flex'};
					`}
				>
					{children}
				</Flex>
				{body.rightJsx && (
					<SideMenuContainer
						mobileOverride={isMobile && mobileOverride}
						variant="right"
					>
						<Box pt={1} width={1}>
							{body.rightJsx}
						</Box>
					</SideMenuContainer>
				)}
			</Flex>
		</>
	);
};

export default MainContainer;
