import { ShadowProps, shadow, border, BorderProps } from 'styled-system';

import { Box } from 'components/styled';

import styled from 'theme/styled';

const ShadowBox = styled(Box)<ShadowProps & BorderProps>`
	${shadow}
	${border}
`;

ShadowBox.defaultProps = {
	backgroundColor: '#fff',
	boxShadow: `0px 4px 4px #000`,
};

export default ShadowBox;
