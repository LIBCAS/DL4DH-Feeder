import React from 'react';

import Text from 'components/styled/Text';

const TitleText: React.FC<
	{ variant?: 'primary' } & React.ComponentProps<typeof Text>
> = ({ variant, children, ...props }) => (
	<Text
		as="h2"
		fontSize={['xl', 'xl', 'xl', 'xxl']}
		fontWeight="bold"
		textAlign="center"
		fontFamily="Roboto"
		my={[3, 3, 'initial']}
		p={[1, 1, 1, 2]}
		color={variant === 'primary' ? 'primary' : 'text'}
		{...props}
	>
		{children}
	</Text>
);
export default TitleText;
