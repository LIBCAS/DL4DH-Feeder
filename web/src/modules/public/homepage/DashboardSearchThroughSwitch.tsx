/** @jsxImportSource @emotion/react */

import { css } from '@emotion/react';
import { ImBooks } from 'react-icons/im';
import { FaBookOpen } from 'react-icons/fa';
import { useSearchParams } from 'react-router-dom';
import { useTranslation } from 'react-i18next';

import Tabs from 'components/tabs';
import IconButton from 'components/styled/IconButton';
import { Flex } from 'components/styled';

import { useTheme } from 'theme';

import {
	SearchThroughVariant,
	useSearchThroughContext,
} from 'hooks/useSearchThroughContext';

import { CUSTOM_URL_PARAMS } from 'utils/enumsMap';

const DashboardSearchThroughSwitch = () => {
	const theme = useTheme();
	const { variant, setVariant, setShowModal } = useSearchThroughContext();
	const [sp, setSp] = useSearchParams();
	const { t } = useTranslation('search');

	return (
		<Flex
			pr={3}
			mr={2}
			css={css`
				border-right: 1px solid ${theme.colors.border};
			`}
		>
			<Tabs
				tabs={[
					{
						key: 'publications',
						jsx: (
							<Flex mx={2}>
								<IconButton
									color="inherit"
									tooltip={t('search_through.tooltip_publications')}
								>
									<ImBooks size={20} />
								</IconButton>
							</Flex>
						),
					},
					{
						key: 'pages',
						jsx: (
							<Flex mx={2}>
								<IconButton
									color="inherit"
									tooltip={t('search_through.tooltip_pages')}
								>
									<FaBookOpen size={20} />
								</IconButton>
							</Flex>
						),
					},
				]}
				setActiveTab={variant => {
					if (variant === 'pages') {
						sp.set('enrichment', 'ENRICHED');
						sp.set('page', '1');
						sp.delete(CUSTOM_URL_PARAMS.HISTORY_ID);
						setSp(sp);
						setShowModal(true);
					} else {
						sp.set('page', '1');
						sp.delete(CUSTOM_URL_PARAMS.HISTORY_ID);
						setSp(sp);
						setShowModal(false);
					}
					setVariant(variant as SearchThroughVariant);
				}}
				activeTab={variant}
			/>
		</Flex>
	);
};
export default DashboardSearchThroughSwitch;
