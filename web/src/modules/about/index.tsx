import { useTranslation } from 'react-i18next';

import Paper from 'components/styled/Paper';
import Text, { H1 } from 'components/styled/Text';
import { Wrapper } from 'components/styled/Wrapper';
import { Box, Flex, Grid } from 'components/styled';
import Divider from 'components/styled/Divider';

import { useInfoApi } from 'api/infoApi';

import { HrefLink } from '../../components/styled/Link';

const About = () => {
	const info = useInfoApi();
	const { t } = useTranslation('about');
	return (
		<Wrapper
			height="100vh"
			alignItems="flex-start"
			p={[4, 0]}
			width={1}
			bg="paper"
		>
			<Paper
				color="#444444!important"
				maxWidth="900px"
				marginRight="auto"
				marginLeft="auto"
			>
				<Box my={3} width={1}>
					<H1
						my={3}
						textAlign="left"
						color="#444444!important"
						fontWeight="normal"
					>
						{t('title')}
					</H1>

					<Text>{t('paragraph_1')}</Text>
					<Text>{t('paragraph_2')}</Text>
				</Box>
				<Divider my={3} />
				<Box mt={3} maxWidth="500px" textAlign="left">
					<Grid gridTemplateColumns="1fr 1fr" gridGap={1} bg="paper">
						<Text>{t('kramerius')}:</Text>
						<Text fontWeight="bold">
							{info.data?.kramerius.version ?? '--'}
						</Text>
						<Text>{t('kramerius_plus')}:</Text>
						<Text fontWeight="bold">
							{info.data?.krameriusPlus.version ?? '--'}
						</Text>
						<Text>{t('dl4dh_feeder')}:</Text>
						<Flex>
							<Text fontWeight="bold">{info.data?.feeder.version ?? '--'}</Text>
						</Flex>

						<Text>{t('links')}:</Text>
						<Text>
							<HrefLink href="https://github.com/LIBCAS/DL4DH-Feeder/wiki">
								{t('documentation')}
							</HrefLink>
						</Text>

						<Text></Text>
						<Text>
							<HrefLink href="https://github.com/LIBCAS/DL4DH">
								{t('information')}
							</HrefLink>
						</Text>
						<Text>{t('contact')}:</Text>
						<Text>
							<HrefLink
								href={`mailto:${info.data?.feeder.contact}`}
								fontWeight="bold"
							>
								{info.data?.feeder.contact ?? '--'}
							</HrefLink>
						</Text>
					</Grid>
				</Box>
			</Paper>
		</Wrapper>
	);
};

export default About;
