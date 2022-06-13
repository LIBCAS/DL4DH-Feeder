import { Box } from 'components/styled';

import styled from 'theme/styled';

const IconButton = styled(Box)`
	background: transparent;
	border: 0;
	cursor: pointer;
	&:hover {
		background-color: rgba(0, 0, 0, 0.03);
		color: rgba(0, 0, 0, 0.8);
	}
`.withComponent('button');

IconButton.defaultProps = {
	type: 'button',
	p: 0,
};

export default IconButton;
