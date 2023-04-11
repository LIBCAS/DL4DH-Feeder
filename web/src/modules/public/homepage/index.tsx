/** @jsxImportSource @emotion/react */
import { css } from '@emotion/core';
import { FC, useState } from 'react';
import { MdArrowForward, MdImage, MdInfo } from 'react-icons/md';
import { useTranslation } from 'react-i18next';
import { useNavigate } from 'react-router-dom';

import Checkbox from 'components/form/checkbox/Checkbox';
import { Flex } from 'components/styled';
import { NavLinkButton } from 'components/styled/Button';
import Text from 'components/styled/Text';
import { ResponsiveWrapper } from 'components/styled/Wrapper';
import QuerySearchInput from 'components/search/QuerySearchInput';

import { useTheme } from 'theme';

import { useInfoApi } from 'api/infoApi';

import HomepageFeeds from './homepageFeeds';

const Homepage: FC = () => {
	const [publicOnly, setPublicOnly] = useState<boolean>(true);
	const nav = useNavigate();
	const { t } = useTranslation('homepage');
	const [query, setQuery] = useState('');
	const theme = useTheme();

	const info = useInfoApi();
	const libName = info.data?.kramerius.name ?? '';
	const logo = info.data?.kramerius.logo ?? undefined;

	return (
		<ResponsiveWrapper bg="white" px={1} mx={0}>
			<Flex
				alignItems="center"
				justifyContent="flex-start"
				height="100vh"
				flexDirection="column"
				overflowY="auto"
			>
				<Flex
					mt={[4, 5]}
					flexDirection="column"
					width={[1, 2 / 3, 1 / 2]}
					alignItems="center"
					justifyContent="center"
				>
					{logo ? <img src={logo} height={80} /> : <MdImage size={80} />}
					<Flex mt={3} mb={4} flexDirection="column" alignItems="center">
						<Text fontSize="xl" fontWeight="bold">
							{libName}
						</Text>
						<Flex my={2} width={1} maxWidth={200} height={1} bg="border"></Flex>

						<Text fontSize="md">DL4DH Feeder</Text>
					</Flex>
					<Flex
						px={3}
						width={[6 / 7, 1, 1]}
						flexShrink={0}
						minWidth={300}
						flexDirection={['column', 'row']}
						alignItems="center"
						ml={[0, 100, 100]}
						position="relative"
					>
						<Flex
							width={1}
							css={css`
								border: 1px solid ${theme.colors.border};
								border-bottom: none;
								border-radius: 3px;
							`}
						>
							<QuerySearchInput
								onQueryUpdate={q => {
									const formatted = `${q ? `query=${q}` : ''}${
										publicOnly ? `${q ? '&' : ''}availability=PUBLIC` : ''
									}`;
									nav(`/search${formatted ? `?${formatted}` : ''}`);
								}}
								placeholder={t('search:search_in_publication')}
								onQueryClear={() => {
									setQuery('');
								}}
								//customWrapperCss={css``}
							/>
						</Flex>

						<Flex alignItems="center" minWidth={150} ml={[0, 3]} mt={[3, 0]}>
							<Checkbox
								checked={publicOnly}
								onChange={() => setPublicOnly(p => !p)}
								aria-label={t('public_only')}
								label={t('public_only')}
							/>
						</Flex>
					</Flex>
					{/* //TODO: treba updatovat aj toto query */}
					<NavLinkButton
						mt={4}
						to={`/search${query ? `?${query}` : ''}`}
						variant="primary"
					>
						{t('btn_enter')}
						<Flex ml={2}>
							<MdArrowForward size={22} />
						</Flex>
					</NavLinkButton>
				</Flex>
				<HomepageFeeds />
				<Flex flexGrow={1} />
				<Flex
					py={[3, 4]}
					mb={5}
					bg="primaryLight"
					flexDirection="column"
					width={[1, 1, 1 / 2]}
					justifyContent="center"
					alignItems="center"
				>
					<Flex alignItems="center">
						<MdInfo />
						<Text ml={2} fontSize="md" fontWeight="bold">
							{t('about')}
						</Text>
					</Flex>
					<Text textAlign="center" fontSize="sm" px={[3, 5]}>
						DL4DH Feeder nabízí výzkumným pracovníkům přehledné grafické
						rozhraní pro práci s daty uloženými v modulu Kramerius+ i digitální
						knihovně Kramerius. Umožňuje vyhledání, selekci a následný export
						digitálních dat (opticky rozpoznaný text a metadata) jak v původní
						podobě, tak v některém z dalších formátů, umožňujících mimo jiné
						také efektivní strojové zpracování.
					</Text>
				</Flex>
			</Flex>
			<Flex
				position="sticky"
				bottom={10}
				width={1}
				justifyContent="center"
			></Flex>
		</ResponsiveWrapper>
	);
};

export default Homepage;
