/** @jsxImportSource @emotion/react */
import { css } from '@emotion/react';
import { BsGridFill } from 'react-icons/bs';
import { ImMenu } from 'react-icons/im';
import { MdEqualizer } from 'react-icons/md';

import Tabs from 'components/tabs';
import IconButton from 'components/styled/IconButton';
import { Flex } from 'components/styled';

import { useTheme } from 'theme';

import { useSearchContext, ViewMode } from 'hooks/useSearchContext';

const DashboardModeSwither = () => {
	const theme = useTheme();
	const { state, dispatch } = useSearchContext();

	return (
		<Flex
			mx={3}
			css={css`
				border-right: 1px solid ${theme.colors.border};
			`}
		>
			<Tabs
				tabs={[
					{
						key: 'tiles',
						jsx: (
							<Flex mx={2}>
								<IconButton color="inherit" tooltip="Zobrazení dlažice">
									<BsGridFill size={20} />
								</IconButton>
							</Flex>
						),
					},
					{
						key: 'list',
						jsx: (
							<Flex mx={2}>
								<IconButton color="inherit" tooltip="Zobrazení seznam">
									<ImMenu size={20} />
								</IconButton>
							</Flex>
						),
					},
					{
						key: 'graph',
						jsx: (
							<Flex mx={2}>
								<IconButton color="inherit" tooltip="Zobrazení grafu statistik">
									<MdEqualizer size={20} />
								</IconButton>
							</Flex>
						),
					},
				]}
				setActiveTab={vm =>
					dispatch?.({ type: 'setViewMode', viewMode: vm as ViewMode })
				}
				activeTab={state.viewMode}
			/>
		</Flex>
	);
};
export default DashboardModeSwither;
