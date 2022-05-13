/** @jsxImportSource @emotion/react */
import { css } from '@emotion/react';
import { FC, useState } from 'react';

import MyAccordion from 'components/accordion';
import { Flex } from 'components/styled';
import Text from 'components/styled/Text';
import SidePanelHideButton from 'components/sidepanels/SidePanelHideButton';
import Tabs from 'components/tabs';
import Button from 'components/styled/Button';
import Divider from 'components/styled/Divider';

import { useTheme } from 'theme';

import PubSideSearch from './PubSideSearch';
import PubSideDetail from './PubSideDetail';

const PublicationSidePanel: FC<{ variant: 'left' | 'right' }> = ({
	variant,
}) => {
	const theme = useTheme();
	const [leftCollapsed, setLeftCollapsed] = useState(false);
	const [viewMode, setViewMode] = useState<'detail' | 'search'>('detail');
	return (
		<Flex
			position="relative"
			maxHeight="100vh"
			width={leftCollapsed ? '1px' : 300}
			flexShrink={0}
			css={css`
				${variant === 'left' &&
				css`
					border-right: 1px solid ${theme.colors.border};
				`}
				${variant === 'right' &&
				css`
					border-left: 1px solid ${theme.colors.border};
				`}
				transition: width 200ms ease-in-out;
			`}
		>
			<Flex
				position="relative"
				alignItems="flex-start"
				overflowY="auto"
				width={1}
				flexDirection="column"
			>
				<Flex
					height={60}
					bg="primaryLight"
					width={1}
					alignItems="center"
					justifyContent="center"
				>
					<Tabs
						tabs={[
							{
								key: 'search',
								jsx: (
									<Button
										height={30}
										hoverDisable
										variant={viewMode === 'search' ? 'primary' : 'outlined'}
									>
										Vyhledávání
									</Button>
								),
							},
							{
								key: 'detail',
								jsx: (
									<Button
										height={30}
										hoverDisable
										ml={2}
										variant={viewMode === 'detail' ? 'primary' : 'outlined'}
									>
										Detail záznamu
									</Button>
								),
							},
						]}
						setActiveTab={k => setViewMode(k as 'detail' | 'search')}
						activeTab={viewMode}
					/>
				</Flex>
				<Divider />
				{viewMode === 'search' ? <PubSideSearch /> : <PubSideDetail />}
			</Flex>
			<SidePanelHideButton
				onClick={() => setLeftCollapsed(p => !p)}
				variant={variant}
				isCollapsed={leftCollapsed}
			/>
		</Flex>
	);
};
export default PublicationSidePanel;
