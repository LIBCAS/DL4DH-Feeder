import styled from '@emotion/styled/macro';

import { Flex } from 'components/styled';

export const SHARED_RESPONSIVE_PADDING_X = [1, 2, 1, 1, 5];

export const Wrapper = styled(Flex)`
	flex: 1;
	flex-direction: column;
`;

export const ResponsivePadder = styled(Flex)`
	position: relative;
	width: 100%;
	margin-left: auto;
	margin-right: auto;
	max-width: 100vw;
	box-sizing: border-box;
`;
ResponsivePadder.defaultProps = {
	flexDirection: 'column',
	px: SHARED_RESPONSIVE_PADDING_X,
};

export const ResponsiveWrapper = styled(ResponsivePadder)`
	flex: 1;
	position: relative;
	padding-bottom: ${p => p.theme.space[4]}px;
`;
