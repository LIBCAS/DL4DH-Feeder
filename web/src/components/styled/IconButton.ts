import { Box } from 'components/styled';

import styled from 'theme/styled';

import Button from './Button';

const IconButton = styled(Box)`
	background: transparent;
	border: 0;
	cursor: pointer;
	&:hover {
		background-color: rgba(0, 0, 0, 0.03);
		color: rgba(0, 0, 0, 0.8);
	}
	padding: 0;
	margin: 0;
	min-width: unset;
`.withComponent(Button);

export const IconButtonOld = styled(Box)`
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
