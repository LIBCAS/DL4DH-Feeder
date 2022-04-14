import { Box } from 'components/styled';

import styled from 'theme/styled';

const IconButton = styled(Box)`
	background: transparent;
	border: 0;
	cursor: pointer;
`.withComponent('button');

IconButton.defaultProps = {
	type: 'button',
	p: 0,
};

export default IconButton;
