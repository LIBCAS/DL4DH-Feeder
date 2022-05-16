import { typography, TypographyProps } from 'styled-system';

import styled from 'theme/styled';

const ErrorFeedback = styled.div<TypographyProps>`
	color: ${p => p.theme.colors.error};
	align-self: flex-end;
	text-align: right;

	${typography}
`;

export default ErrorFeedback;
