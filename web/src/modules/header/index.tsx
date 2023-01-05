/** @jsxImportSource @emotion/react */
import { css } from '@emotion/react';
import { MdArrowBack } from 'react-icons/md';
import { useLocation, useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';

import MainSearchInput from 'components/search/MainSearchInput';
import { Flex } from 'components/styled';
import Button from 'components/styled/Button';
import IconButton from 'components/styled/IconButton';
import Text from 'components/styled/Text';
import { ResponsiveWrapper } from 'components/styled/Wrapper';

import { usePublicationContext } from 'modules/publication/ctx/pub-ctx';

import { theme } from 'theme';

import { useInfoApi } from 'api/infoApi';

import { useSearchContext } from 'hooks/useSearchContext';
import { useMobileView } from 'hooks/useViewport';

import { HEADER_WRAPPER_ID, INIT_HEADER_HEIGHT } from 'utils/useHeaderHeight';

import { HeaderMenu } from './menuItems';

const Header = () => {
	const { pathname } = useLocation();
	const nav = useNavigate();

	const info = useInfoApi();
	const libName = info.data?.kramerius.name ?? '';

	const ctx = usePublicationContext();
	const searchCtx = useSearchContext();
	const { isMobile } = useMobileView();
	const { t } = useTranslation('navbar');

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
								tooltip={t('back')}
							>
								<MdArrowBack size={22} />
							</IconButton>
							<Button
								tooltip={t('home')}
								//`/search${Store.get(Store.keys.PreviousSearchQuery) ?? ''}`,
								onClick={() => nav(`/`)}
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
					{window.origin === 'http://localhost:3000000' ? (
						<button
							onClick={() => {
								console.log(searchCtx);
								console.log(ctx);
							}}
						>
							ctx
						</button>
					) : (
						<></>
					)}

					<HeaderMenu />
				</Flex>
			) : (
				<Flex alignSelf="flex-end">
					<HeaderMenu />
				</Flex>
			)}
		</ResponsiveWrapper>
	);
};
export default Header;
