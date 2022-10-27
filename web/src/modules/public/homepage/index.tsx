/** @jsxImportSource @emotion/react */
import { css } from '@emotion/core';
import { debounce } from 'lodash-es';
import { FC, useCallback, useMemo, useState } from 'react';
import {
	MdArrowForward,
	MdClear,
	MdImage,
	MdInfo,
	MdSearch,
} from 'react-icons/md';
import useMeasure from 'react-use-measure';
import { useTranslation } from 'react-i18next';

import Checkbox from 'components/form/checkbox/Checkbox';
import TextInput from 'components/form/input/TextInput';
import { ClickAway } from 'components/form/select/SimpleSelect';
import { Flex } from 'components/styled';
import { NavLinkButton } from 'components/styled/Button';
import Text from 'components/styled/Text';
import { ResponsiveWrapper } from 'components/styled/Wrapper';

import { api } from 'api';
import { theme } from 'theme';

import { useInfoApi } from 'api/infoApi';

import HomepageFeeds from './homepageFeeds';

const Homepage: FC = () => {
	const [toSearch, setToSearch] = useState('');
	const [publicOnly, setPublicOnly] = useState<boolean>(true);
	const [hints, setHints] = useState<string[]>([]);
	const [wrapperRef, { width }] = useMeasure({
		debounce: 100,
	});
	const { t } = useTranslation('homepage');
	const query = `${toSearch ? `query=${toSearch}` : ''}${
		publicOnly ? `${toSearch ? '&' : ''}availability=PUBLIC` : ''
	}`;

	const getHint = useCallback(async (q: string) => {
		const hints = await api()
			.post(`search/hint?q=${q}`)
			.json<string[]>()
			.catch(r => console.log(r));
		if (hints) {
			setHints(hints);
		}
	}, []);

	const debouncedHint = useMemo(() => debounce(getHint, 200), [getHint]);

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
						<Flex ref={wrapperRef} width={1}>
							<TextInput
								placeholder={t('search_placeholder')}
								label=""
								labelType="inline"
								color="primary"
								value={toSearch}
								iconLeft={
									<Flex color="primary" ml={2}>
										<MdSearch size={26} />
									</Flex>
								}
								iconRight={
									toSearch !== '' ? (
										<Flex mr={3} color="primary">
											<MdClear
												onClick={() => setToSearch('')}
												css={css`
													cursor: pointer;
												`}
											/>
										</Flex>
									) : (
										<></>
									)
								}
								onChange={e => {
									setToSearch(e.currentTarget.value);
									debouncedHint(e.target.value);
								}}
							/>
						</Flex>
						{hints.length > 0 && toSearch !== '' && (
							<ClickAway onClickAway={() => setHints([])}>
								<Flex
									position="absolute"
									left={16}
									top={40}
									bg="white"
									color="text"
									css={css`
										border: 1px solid ${theme.colors.border};
										box-shadow: 0px 0px 8px 2px rgba(0, 0, 0, 0.1);
										z-index: 1;
									`}
								>
									<Flex
										position="relative"
										flexDirection="column"
										overflowY="auto"
										maxHeight="30vh"
										width={width}
									>
										{hints.map((h, index) => (
											<Flex
												px={3}
												py={2}
												key={index}
												onClick={() => {
													setToSearch(h);
													setHints([]);
												}}
												css={css`
													cursor: default;
													border-bottom: 1px solid ${theme.colors.primaryLight};
													&:hover {
														color: white;
														background-color: ${theme.colors.primary};
													}
												`}
											>
												<Text>{h}</Text>
											</Flex>
										))}
									</Flex>
								</Flex>
							</ClickAway>
						)}
						<Flex alignItems="center" minWidth={150} ml={[0, 3]} mt={[3, 0]}>
							<Checkbox
								checked={publicOnly}
								onChange={() => setPublicOnly(p => !p)}
								aria-label={t('public_only')}
								label={t('public_only')}
							/>
						</Flex>
					</Flex>
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
						Lorem ipsum dolor sit amet, consectetur adipisicing elit. Quisquam
						ad animi quod illum enim? Ex, accusamus ad ipsa explicabo incidunt
						voluptatem dolorum architecto unde officiis at quia! Explicabo
						reprehenderit incidunt culpa sint soluta tempore sunt porro natus
						accusamus. Repellendus ut ullam quasi ratione cum ipsum eius sequi,
						omnis inventore eos.
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
