/** @jsxImportSource @emotion/react */

import { css } from '@emotion/react';
import { Dialog } from '@reach/dialog';

import Paper from 'components/styled/Paper';
import TitleText from 'components/styled/TitleText';
import Text from 'components/styled/Text';
import Button from 'components/styled/Button';
import { Flex } from 'components/styled';

import { useTheme } from 'theme';

import { useSearchThroughContext } from 'hooks/useSearchThroughContext';

const SearchThoroughPagesModal = () => {
	const { variant, showModal, setShowModal } = useSearchThroughContext();

	const theme = useTheme();

	if (variant !== 'pages') {
		return <></>;
	}
	return (
		<Dialog
			isOpen={showModal}
			css={css`
				padding: 0 !important;
				min-width: ${theme.breakpoints[0]};

				@media (max-width: ${theme.breakpoints[0]}) {
					width: 100% !important;
					min-width: unset;
				}
			`}
		>
			<Paper bg="paper" minWidth={['80%', 400]} overflow="visible">
				<Flex
					flexDirection="column"
					justifyContent="center"
					alignItems="center"
				>
					<TitleText>Upozornění</TitleText>
					<Text>
						Při vyhledávání ve stránkách bude automaticky zapnutý filtr:{' '}
						<b>pouze obohacené</b> publikace.
					</Text>

					<Button mt={3} variant="primary" onClick={() => setShowModal(false)}>
						OK
					</Button>
				</Flex>
			</Paper>
		</Dialog>
	);
};

export default SearchThoroughPagesModal;
