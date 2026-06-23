import { useTranslation } from 'react-i18next';

import Paper from 'components/styled/Paper';
import Text from 'components/styled/Text';
import Divider from 'components/styled/Divider';
import { Wrapper } from 'components/styled/Wrapper';
import { Box, Grid } from 'components/styled';

import { useInfoApi } from 'api/infoApi';
import { useEffect, useState } from 'react';

import { HrefLink } from '../../components/styled/Link';

const About = () => {
	const info = useInfoApi();
	const [pageContent, setPageContent] = useState('');
	const [loading, setLoading] = useState(true);
	const [error, setError] = useState(null);

	const { t, i18n } = useTranslation('export');
	const fileName = 'about-'+i18n.language+'.html';

	useEffect(() => {
		fetch(`/pages/${fileName}`)
			.then((response) => {
				if (!response.ok) {
					throw new Error(t('download_error'));
				}
				return response.text();
			})
			.then((data) => {
				setPageContent(data);
				setLoading(false);
			})
			.catch((err) => {
				setError(err.message);
				setLoading(false);
			});
	}, [fileName]);

	if (loading) return <div>Loading...</div>;
	if (error) return <div style={{ color: 'red' }}>Error: {error}</div>;
	
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
				<div dangerouslySetInnerHTML={{ __html: pageContent }} />
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
						<Text fontWeight="bold">
							{info.data?.feeder.version ?? '--'}
						</Text>
		
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
						{info.data?.feeder.contact && (
							<>
								<Text>{t('contact')}:</Text>
								<Text>
									<HrefLink
										href={`mailto:${info.data?.feeder.contact}`}
										fontWeight="bold"
									>
										{info.data?.feeder.contact ?? '--'}
									</HrefLink>
								</Text>
							</>
						)}
					</Grid>
				</Box>
			</Paper>
		</Wrapper>
	);
};

export default About;
