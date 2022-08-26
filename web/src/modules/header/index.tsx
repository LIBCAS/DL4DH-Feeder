/** @jsxImportSource @emotion/react */
import { css } from '@emotion/react';
import Dialog from '@reach/dialog';
import { useContext, useState } from 'react';
import { MdArrowBack, MdMenu } from 'react-icons/md';
import { useLocation, useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';

import MainSearchInput from 'components/search/MainSearchInput';
import { Flex } from 'components/styled';
import Button from 'components/styled/Button';
import IconButton from 'components/styled/IconButton';
import Text from 'components/styled/Text';
import { ResponsiveWrapper } from 'components/styled/Wrapper';

import { PubCtx } from 'modules/publication/ctx/pub-ctx';

import { theme } from 'theme';

import { useInfoApi } from 'api/infoApi';

import { useMobileView } from 'hooks/useViewport';

import { HEADER_WRAPPER_ID, INIT_HEADER_HEIGHT } from 'utils/useHeaderHeight';
import Store from 'utils/Store';

import { DesktopMenu } from './menuItems';
import UserBadge from './UserBadge';

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
			px={0}
			mx={0}
			maxHeight={INIT_HEADER_HEIGHT}
			zIndex={10}
			css={css`
				padding-bottom: 0px !important;
				/* border-bottom: 1px solid ${theme.colors.border}; */
				box-shadow: 0px 1px 2px 1px rgb(0 0 0 / 29%);
			`}
		>
			{pathname !== '/' ? (
				<Flex
					maxHeight={INIT_HEADER_HEIGHT}
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
						<Flex
							flexShrink={0}
							width={300}
							color="headerColor"
							alignItems="center"
							justifyContent="space-evenly"
						>
							<IconButton
								onClick={() => nav(-1)}
								p={1}
								color="headerColor"
								tooltip="Krok zpět"
							>
								<MdArrowBack size={22} />
							</IconButton>
							<Button
								tooltip="Zpět na vyledávání"
								onClick={() =>
									nav(
										`/search${Store.get(Store.keys.PreviousSearchQuery) ?? ''}`,
									)
								}
								variant="text"
								color="headerColor"
								pr={2}
								pl={0}
								ml={-2}
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
					{window.origin === 'http://localhost:30000' ? (
						<button
							onClick={() => {
								console.log(ctx);
								toast.info('ahoj');
							}}
						>
							ctx
						</button>
					) : (
						<></>
					)}

					<Flex ml={1} flexShrink={0} color="headerColor">
						{!isTablet ? (
							<>
								<DesktopMenu variant="desktop" />
								<UserBadge />
							</>
						) : (
							<>
								<Button
									variant="primary"
									px={0}
									mx={0}
									minWidth={50}
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
										<DesktopMenu variant="tablet" />
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
