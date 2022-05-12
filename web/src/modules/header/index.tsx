/** @jsxImportSource @emotion/react */
import { css } from '@emotion/react';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import useMeasure from 'react-use-measure';
import { useMemo } from 'react';

import { Flex } from 'components/styled';
import Text from 'components/styled/Text';
import Button, { NavLinkButton } from 'components/styled/Button';
import { ResponsiveWrapper } from 'components/styled/Wrapper';

import MainSearchInput from 'modules/public/mainSearch/MainSearchInput';

import { theme } from 'theme';

import { HEADER_WRAPPER_ID, INIT_HEADER_HEIGHT } from 'utils/useHeaderHeight';
const collapseWidth = theme.breakpointsInt[2];

const Header = () => {
	const [ref, { width: viewportWidth }] = useMeasure({
		debounce: 200,
	});

	const isMobile = useMemo(
		() => viewportWidth < collapseWidth,
		[viewportWidth],
	);

	return (
		<ResponsiveWrapper
			bg="primaryLight"
			px={1}
			mx={0}
			maxHeight={60}
			ref={ref}
			css={css`
				padding-bottom: 0px !important;
				border-bottom: 1px solid ${theme.colors.border};
			`}
		>
			<Flex
				maxHeight={59}
				id={HEADER_WRAPPER_ID}
				alignItems="center"
				flexDirection="row"
				justifyContent="space-between"
				height={INIT_HEADER_HEIGHT}
				bg="primaryLight"
				// overflow="hidden"
			>
				<Flex flexShrink={0} width={300}>
					<NavLinkButton to="/" variant="text" pr={5}>
						<ArrowBackIcon />
						<Flex flexDirection="column" ml={2} justifyContent="center">
							<Text textAlign="left" fontSize="14px" my={0} fontWeight="bold">
								Studijní a vědecká knihovna Plzeňského kraje
							</Text>
							<Text m={0} textAlign="left" fontSize="11px">
								DL4DH Feeder
							</Text>
						</Flex>
					</NavLinkButton>
				</Flex>

				<MainSearchInput />

				<Flex flexShrink={0}>
					{!isMobile && (
						<>
							<Button variant="text">Sbírky</Button>
							<Button variant="text">Procházet</Button>
							<Button variant="text">Informace</Button>
							<Button variant="text">English</Button>
						</>
					)}
					<Button minWidth={150} variant="primary">
						Přejít do Kraméria
					</Button>
				</Flex>
			</Flex>
		</ResponsiveWrapper>
	);
};
export default Header;
