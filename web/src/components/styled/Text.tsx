import { css } from '@emotion/core';

import { Box, BoxProps } from 'components/styled';

import { OffscreenCSS } from 'theme/GlobalStyles';
import styled from 'theme/styled';

type Props = {
	ellipsis?: boolean;
};

const Text = styled(Box)<BoxProps & Props>`
	${p =>
		p.ellipsis &&
		css`
			white-space: nowrap;
			text-overflow: ellipsis;
			overflow: hidden;
		`}
`.withComponent('p');

export const OffscreenText = styled(Text)`
	${OffscreenCSS}
`.withComponent('span');

export default Text;
