/** @jsxImportSource @emotion/react */
import { css } from '@emotion/react';
import useMeasure from 'react-use-measure';
import { useMemo } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { MdArrowBack } from 'react-icons/md';

import { Flex } from 'components/styled';
import Text from 'components/styled/Text';
import Button, { NavLinkButton } from 'components/styled/Button';
import { ResponsiveWrapper } from 'components/styled/Wrapper';
import MainSearchInput from 'components/search/MainSearchInput';

import { theme } from 'theme';

import { useInfoApi } from 'api/infoApi';

import { HEADER_WRAPPER_ID, INIT_HEADER_HEIGHT } from 'utils/useHeaderHeight';
const collapseWidth = theme.breakpointsInt[3];

const Header = () => {
	const [ref, { width: viewportWidth }] = useMeasure({
		debounce: 200,
	});

	const { pathname } = useLocation();
	const nav = useNavigate();

	const isMobile = useMemo(
		() => viewportWidth < collapseWidth,
		[viewportWidth],
	);
	const info = useInfoApi();
	const libName = info.data?.kramerius.name ?? '';

	return (
		<ResponsiveWrapper
			bg="headerBg"
			px={1}
			mx={0}
			maxHeight={60}
			ref={ref}
			zIndex={1}
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
					<Flex flexShrink={0} width={300} color="headerColor">
						<Button
							onClick={() => nav(-1)}
							variant="text"
							pr={3}
							color="headerColor"
						>
							<MdArrowBack size={22} />
							<Flex flexDirection="column" ml={2} justifyContent="center">
								<Text textAlign="left" fontSize="14px" my={0} fontWeight="bold">
									{libName}
								</Text>
								<Text m={0} textAlign="left" fontSize="11px">
									DL4DH Feeder
								</Text>
							</Flex>
						</Button>
					</Flex>

					<MainSearchInput />

					<Flex ml={1} flexShrink={0} color="headerColor">
						{!isMobile && (
							<>
								<NavLinkButton
									to="/collections"
									color="headerColor"
									variant="primary"
									minWidth={50}
								>
									Sbírky
								</NavLinkButton>
								<NavLinkButton
									to="/browse"
									color="headerColor"
									variant="primary"
									minWidth={50}
								>
									Procházet
								</NavLinkButton>
								<NavLinkButton
									to="/about"
									color="headerColor"
									variant="primary"
									minWidth={50}
								>
									Informace
								</NavLinkButton>
								<Button color="headerColor" variant="primary" minWidth={50}>
									English
								</Button>
							</>
						)}
						<Button minWidth={100} variant="primary">
							Přejít do Kraméria
						</Button>
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
