import Paper from 'components/styled/Paper';
import Text, { H1 } from 'components/styled/Text';
import { Wrapper } from 'components/styled/Wrapper';
import { Box, Grid } from 'components/styled';

import { useInfoApi } from 'api/infoApi';

const About = () => {
	const info = useInfoApi();

	return (
		<Wrapper height="100vh" alignItems="flex-start" p={[4, 0]} width={1}>
			<Paper color="#444444!important">
				<Box mt={3} ml={[0, '300px']} width={1}>
					<H1
						my={3}
						textAlign="left"
						color="#444444!important"
						fontWeight="normal"
					>
						Informace
					</H1>
					<Text></Text>
					<Grid gridTemplateColumns="1fr 1fr" gridGap={3} bg="paper" p={3}>
						<Text>kramerius:</Text>
						<Text fontWeight="bold">
							{info.data?.kramerius.version ?? '--'}
						</Text>
						<Text>kramerius +:</Text>
						<Text fontWeight="bold">
							{info.data?.krameriusPlus.version ?? '--'}
						</Text>
						<Text>feeder:</Text>
						<Text fontWeight="bold">{info.data?.version ?? '--'}</Text>
					</Grid>
				</Box>
			</Paper>
		</Wrapper>
	);
};

export default About;
