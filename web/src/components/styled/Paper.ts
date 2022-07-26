import { Flex } from 'components/styled';

import styled from 'theme/styled';

const Paper = styled(Flex)``;
Paper.defaultProps = {
	flexDirection: 'column',
	px: 4,
	py: 3,
	my: 2,
	bg: 'paper',
};
export default Paper;
