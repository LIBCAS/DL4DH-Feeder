import Paper from 'components/styled/Paper';
import Text, { H1 } from 'components/styled/Text';
import { Wrapper } from 'components/styled/Wrapper';
import { Box, Grid } from 'components/styled';

import { useInfoApi } from 'api/infoApi';

import { HrefLink } from '../../components/styled/Link';

const About = () => {
	const info = useInfoApi();

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
				<Box mt={3} width={1}>
					<H1
						my={3}
						textAlign="left"
						color="#444444!important"
						fontWeight="normal"
					>
						Informace
					</H1>

					<Text>
						Nové softwarové řešení napojené na digitální knihovny, provozované v
						systému Kramerius, umožňuje vyhledání, selekci a následný export
						digitálních dat (obrazová data, OCR, metadata) jak v původní podobě,
						tak v některém z dalších formátů, umožňujících mimo jiné také
						efektivní strojové zpracování. DL4DH Feeder dokáže nabízet obohacená
						data a metadata, díky dalším softwarovým součástem vyvinutým v rámci
						projektu DL4DH, kterými jsou Kramerius+ a TEI converter. DL4DH
						feeder je určen primárně humanitně orientovaným vědcům, kteří
						získají možnost vytěžovat data z digitálních knihoven a dále využít
						výpočetní metody pro výzkum, který je řazen do oblasti digital
						humanities.
					</Text>
					<Text>
						Projekt „DL4DH – vývoj nástrojů pro efektivnější využití a
						vytěžování dat z digitálních knihoven k posílení výzkumu digital
						humanities“ byl podpořen Ministerstvem kultury ČR v rámci programu
						aplikovaného výzkumu NAKI II pod ID DG20P02OVV002 a jeho řešení
						probíhalo v letech 2020 – 2022.
					</Text>
				</Box>
				<Box mt={3} maxWidth="500px" marginRight="auto" marginLeft="auto">
					<Grid gridTemplateColumns="1fr 1fr" gridGap={1} bg="paper" p={1}>
						<Text>Kramerius:</Text>
						<Text fontWeight="bold">
							{info.data?.kramerius.version ?? '--'}
						</Text>
						<Text>Kramerius+:</Text>
						<Text fontWeight="bold">
							{info.data?.krameriusPlus.version ?? '--'}
						</Text>
						<Text>DL4DH Feeder:</Text>
						<Text fontWeight="bold">{info.data?.feeder.version ?? '--'}</Text>

						<Text>Odkazy:</Text>
						<Text>
							<HrefLink href="https://github.com/LIBCAS/DL4DH-Feeder/wiki">
								Dokumentace DL4DH Feeder
							</HrefLink>
						</Text>

						<Text></Text>
						<Text>
							<HrefLink href="ttps://github.com/LIBCAS/DL4DH">
								Informace o projektu DL4DH
							</HrefLink>
						</Text>
					</Grid>
				</Box>
			</Paper>
		</Wrapper>
	);
};

export default About;
