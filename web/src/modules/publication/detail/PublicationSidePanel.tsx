/** @jsxImportSource @emotion/react */
import { css } from '@emotion/react';
import { FC, useState } from 'react';

import { Flex } from 'components/styled';
import SidePanelHideButton from 'components/sidepanels/SidePanelHideButton';
import Tabs from 'components/tabs';
import Button from 'components/styled/Button';
import Divider from 'components/styled/Divider';

import { useTheme } from 'theme';

import { PublicationChild } from 'api/models';

import PubThumbnails from './PubThumbnails';
import PubBiblioDetail from './PubBiblioDetail';
import PubChooseSecond from './PubChooseSecond';

type Props = {
	variant: 'left' | 'right';
	defaultView?: 'detail' | 'search';
	//	page: string;
	pages: PublicationChild[];
};

const PublicationSidePanel: FC<Props> = ({ variant, defaultView, pages }) => {
	const theme = useTheme();
	const [leftCollapsed, setLeftCollapsed] = useState(false);
	const [chooseSecond, setChooseSecond] = useState(false);

	const [viewMode, setViewMode] = useState<'detail' | 'search'>(
		defaultView ?? 'detail',
	);

	return (
		<Flex
			position="relative"
			// maxHeight="100vh"
			width={leftCollapsed ? '0px' : 300}
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
				// overflowY="auto"
				width={1}
				flexDirection="column"
			>
				<Flex alignItems="center" justifyContent="center" p={2} width={1}>
					<Button variant="primary" onClick={() => setChooseSecond(p => !p)}>
						Vyhledávaní v množině záznamů
					</Button>
					{chooseSecond && (
						<PubChooseSecond
							onClose={() => setChooseSecond(false)}
							variant={variant}
						/>
					)}
				</Flex>
				<Divider />
				<Flex
					height={60}
					bg="primaryLight"
					width={1}
					alignItems="center"
					justifyContent="center"
					flexShrink={0}
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

				{viewMode === 'search' ? (
					<PubThumbnails marginTop={60} pages={pages} />
				) : (
					<PubBiblioDetail />
				)}
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
