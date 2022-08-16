/** @jsxImportSource @emotion/react */
import { css } from '@emotion/react';
import Dialog from '@reach/dialog';
import { useContext, useState } from 'react';
import { MdArrowBack, MdMenu } from 'react-icons/md';
import { useLocation, useNavigate } from 'react-router-dom';

import MainSearchInput from 'components/search/MainSearchInput';
import { Flex } from 'components/styled';
import Button, { NavLinkButton } from 'components/styled/Button';
import IconButton from 'components/styled/IconButton';
import Text from 'components/styled/Text';
import { ResponsiveWrapper } from 'components/styled/Wrapper';

import { PubCtx } from 'modules/publication/ctx/pub-ctx';

import { theme } from 'theme';

import { useInfoApi } from 'api/infoApi';

import { useMobileView } from 'hooks/useViewport';

import { HEADER_WRAPPER_ID, INIT_HEADER_HEIGHT } from 'utils/useHeaderHeight';

const Header = () => {
	const { pathname } = useLocation();
	const nav = useNavigate();

	const info = useInfoApi();
	const libName = info.data?.kramerius.name ?? '';

	const [sideMenuExpanded, setSideMenuExpanded] = useState(false);

	const ctx = useContext(PubCtx);
	const { isMobile, isTablet } = useMobileView();

	return (
		<ResponsiveWrapper
			bg="headerBg"
			px={1}
			mx={0}
			maxHeight={60}
			zIndex={10}
			css={css`
				padding-bottom: 0px !important;
				/* border-bottom: 1px solid ${theme.colors.border}; */
				box-shadow: 0px 1px 2px 1px rgb(0 0 0 / 29%);
			`}
		>
			{pathname !== '/' ? (
				<Flex
					maxHeight={59}
					id={HEADER_WRAPPER_ID}
					alignItems="center"
					flexDirection="row"
					justifyContent="space-between"
					height={INIT_HEADER_HEIGHT}
					bg="headerBg"
					color="headerColor"
					// overflow="hidden"
				>
					{!isMobile && (
						<Flex flexShrink={0} width={300} color="headerColor">
							<IconButton onClick={() => nav(-1)} p={1} color="headerColor">
								<MdArrowBack size={22} />
							</IconButton>
							<Button
								onClick={() => nav('/search')}
								variant="text"
								color="headerColor"
								pr={2}
								pl={0}
							>
								<Flex flexDirection="column" ml={2} justifyContent="center">
									<Text
										textAlign="left"
										fontSize="14px"
										my={0}
										fontWeight="bold"
									>
										{libName}
									</Text>
									<Text m={0} textAlign="left" fontSize="11px">
										DL4DH Feeder
									</Text>
								</Flex>
							</Button>
						</Flex>
					)}

					<MainSearchInput />
					{window.origin === 'http://localhost:3000' ? (
						<button onClick={() => console.log(ctx)}>ctx</button>
					) : (
						<></>
					)}

					<Flex ml={1} flexShrink={0} color="headerColor">
						{!isTablet ? (
							<>
								<NavLinkButton
									to="/collections"
									color="headerColor"
									variant="primary"
									minWidth={50}
									px={1}
								>
									Sbírky
								</NavLinkButton>
								<NavLinkButton
									to="/browse"
									color="headerColor"
									variant="primary"
									minWidth={50}
									px={1}
								>
									Procházet
								</NavLinkButton>
								<NavLinkButton
									to="/about"
									color="headerColor"
									variant="primary"
									minWidth={50}
									px={1}
								>
									Informace
								</NavLinkButton>

								<Button
									color="headerColor"
									variant="primary"
									minWidth={50}
									px={1}
								>
									English
								</Button>
								<NavLinkButton
									to="/exports"
									color="headerColor"
									variant="primary"
									minWidth={50}
									px={1}
								>
									Exporty
								</NavLinkButton>
								<Button minWidth={100} variant="primary" px={1}>
									Přejít do Kraméria
								</Button>
							</>
						) : (
							<>
								<Button
									variant="primary"
									onClick={() => setSideMenuExpanded(true)}
								>
									<MdMenu size={22} />
								</Button>
								<Dialog
									isOpen={sideMenuExpanded}
									onDismiss={() => setSideMenuExpanded(false)}
									aria-label="Bočné menu"
									css={css`
										position: fixed;
										top: 0;
										right: 0;
										bottom: 0;
										background-color: white;
										padding: 0 !important;
										margin: 0 !important;
										width: auto;
										max-width: 400px;
										min-width: 300px;

										display: flex;
										flex-direction: column;
										overflow-y: auto;
									`}
								>
									<Flex
										flexDirection="column"
										fontSize="xl"
										alignItems="flex-start"
										pl={2}
									>
										<NavLinkButton
											to="/collections"
											color="primary"
											variant="text"
											minWidth={50}
											px={1}
											my={2}
											fontSize="inherit"
										>
											Sbírky
										</NavLinkButton>
										<NavLinkButton
											to="/browse"
											color="primary"
											variant="text"
											minWidth={50}
											px={1}
											my={2}
											fontSize="inherit"
										>
											Procházet
										</NavLinkButton>
										<NavLinkButton
											to="/about"
											color="primary"
											variant="text"
											minWidth={50}
											px={1}
											my={2}
											fontSize="inherit"
										>
											Informace
										</NavLinkButton>

										<Button
											color="primary"
											variant="text"
											minWidth={50}
											px={1}
											my={2}
											fontSize="inherit"
										>
											English
										</Button>
										<NavLinkButton
											to="/exports"
											color="primary"
											fontSize="inherit"
											variant="text"
											minWidth={50}
											px={1}
											my={2}
										>
											Exporty
										</NavLinkButton>
										<Button
											minWidth={100}
											variant="text"
											px={1}
											my={2}
											fontSize="inherit"
										>
											Přejít do Kraméria
										</Button>
									</Flex>
								</Dialog>
							</>
						)}
					</Flex>
				</Flex>
			) : (
				<Flex alignSelf="flex-end">
					<Button color="headerColor" variant="text">
						Sbírky
					</Button>
					<Button color="headerColor" variant="text">
						Procházet
					</Button>
					<Button color="headerColor" variant="text">
						Informace
					</Button>
					<Button color="headerColor" variant="text">
						English
					</Button>
				</Flex>
			)}
		</ResponsiveWrapper>
	);
};
export default Header;
