import { space } from 'styled-system';
import styled from '@emotion/styled/macro';
import isPropValid from '@emotion/is-prop-valid';

import { Box } from 'components/styled';

const Divider = styled(Box, { shouldForwardProp: isPropValid })<{
	size?: number;
}>`
	width: auto;
	align-self: stretch;

	border-bottom: ${p => p?.size ?? 1}px solid currentColor;

	${space}
`;
Divider.defaultProps = {
	color: 'border',
};

export default Divider;
