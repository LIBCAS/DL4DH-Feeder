/** @jsxImportSource @emotion/react */
import { css } from '@emotion/react';
import { FC, useState } from 'react';
import { useTranslation } from 'react-i18next';

import { Flex } from 'components/styled';
import SidePanelHideButton from 'components/sidepanels/SidePanelHideButton';
import Tabs from 'components/tabs';
import Button from 'components/styled/Button';
import Divider from 'components/styled/Divider';

import { useTheme } from 'theme';

import { PublicationChild } from 'api/models';

import { useMultiviewContext } from 'hooks/useMultiviewContext';

import { useParseUrlIdsAndParams } from '../publicationUtils';

import PubChooseSecond from './PubChooseSecond';
import PubPagesDetail from './PubPagesDetail';
import Bibliography from './biblio/bib-main';

type Props = {
	variant: 'left' | 'right';
	defaultView?: 'detail' | 'search';
	pages: PublicationChild[];
	onCollapse?: (clp?: boolean) => void;
	isCollapsed?: boolean;
};

const PublicationSidePanel: FC<Props> = ({
	variant,
	defaultView,
	onCollapse,
	isCollapsed,
}) => {
	const theme = useTheme();
	const [chooseSecondDialogOpen, setChooseSecondDialogOpen] = useState(false);
	const { t } = useTranslation('publication_detail');
	const urlParams = useParseUrlIdsAndParams();
	const { sidePanel } = useMultiviewContext();
	const isSecond = sidePanel === 'right';

	const [viewMode, setViewMode] = useState<'detail' | 'search'>(
		isSecond ? 'detail' : defaultView ?? 'detail',
	);

	return (
		<Flex
			position="relative"
			height="100%"
			width={300}
			flexShrink={0}
			bg="primaryLight"
			css={css`
				${variant === 'left' &&
				css`
					border-right: 1px solid ${theme.colors.border};
					box-shadow: 1px 60px 10px 2px rgba(0, 0, 0, 0.1);
				`}
				${variant === 'right' &&
				css`
					border-left: 1px solid ${theme.colors.border};
					box-shadow: -1px 60px 10px 2px rgba(0, 0, 0, 0.1);
				`}
				transition: width 200ms ease-in-out;
			`}
		>
			<Flex
				position="absolute"
				height="100%"
				alignItems="flex-start"
				width={1}
				flexDirection="column"
			>
				<>
					<Flex alignItems="center" justifyContent="center" p={2} width={1}>
						{chooseSecondDialogOpen ? (
							<PubChooseSecond
								onClose={() => setChooseSecondDialogOpen(false)}
								variant={variant}
							/>
						) : (
							<>
								<Button
									variant="primary"
									onClick={() => setChooseSecondDialogOpen(p => !p)}
								>
									{t(
										variant === 'right'
											? 'search_in_set_right'
											: 'search_in_set_left',
									)}
								</Button>
								{urlParams.isMultiview && (
									<Button
										tooltip={t('single_publication')}
										mx={2}
										variant="primary"
										onClick={() =>
											variant === 'left'
												? urlParams.navLeft()
												: urlParams.navRight()
										}
									>
										{t('single_publication')}
									</Button>
								)}
							</>
						)}
					</Flex>
					<Divider />
				</>

				{urlParams.isMultiview && (
					<>
						<Flex
							height={50}
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
												{t('search')}
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
												{t('detail')}
											</Button>
										),
									},
								]}
								setActiveTab={k => setViewMode(k as 'detail' | 'search')}
								activeTab={viewMode}
							/>
						</Flex>
						<Divider />
					</>
				)}

				{!chooseSecondDialogOpen && (
					<>{viewMode === 'search' ? <PubPagesDetail /> : <Bibliography />}</>
				)}
			</Flex>
			<SidePanelHideButton
				onClick={() => {
					onCollapse?.();
				}}
				variant={variant}
				isCollapsed={isCollapsed}
			/>
		</Flex>
	);
};
export default PublicationSidePanel;
