import Paper from 'components/styled/Paper';
import { H1 } from 'components/styled/Text';
import { Wrapper } from 'components/styled/Wrapper';
import { Box } from 'components/styled';

const Collections = () => (
	<Wrapper height="100vh" alignItems="flex-start" p={[4, 0]} width={1}>
		<Paper color="#444444!important">
			<Box mt={3} ml={[0, '300px']} width={1}>
				<H1
					my={3}
					textAlign="left"
					color="#444444!important"
					fontWeight="normal"
				>
					Sbírky
				</H1>
			</Box>
		</Paper>
	</Wrapper>
);

export default Collections;
