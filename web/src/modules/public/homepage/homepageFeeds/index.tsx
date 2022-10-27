/** @jsxImportSource @emotion/react */
import { useState } from 'react';
import { css } from '@emotion/react';
import { useTranslation } from 'react-i18next';

import { Flex } from 'components/styled';
import Button from 'components/styled/Button';
import Tabs from 'components/tabs';

import { useTheme } from 'theme';

import NewestHomepageFeed from './NewestHomepageFeed';
import VisitedHomepageFeed from './VisitedHomepageFeed';

const feeds = {
	enriched: NewestHomepageFeed,
	visited: VisitedHomepageFeed,
};

const HomepageFeeds = () => {
	const [activeTab, setActiveTab] = useState<string>('visited');
	const { t } = useTranslation('homepage');

	const Feed = feeds[activeTab];
	const theme = useTheme();

	return (
		<Flex
			my={3}
			width={['100%', '100%', '60%', '60%', '60%', 1 / 2]}
			justifyContent="center"
			flexDirection="column"
		>
			<Flex justifyContent="space-evenly" alignItems="stretch" width={1} mb={3}>
				<Tabs
					wrapperCss={css`
						width: 50%;
					`}
					tabs={[
						{
							key: 'visited',
							jsx: (
								<Flex
									width="100%"
									color={activeTab === 'visited' ? 'primary' : 'textH4'}
									css={css`
										${activeTab === 'visited'
											? css`
													border-bottom: 2px solid;
													border-color: inherit;
											  `
											: css`
													border-bottom: 1px solid;
													border-color: ${theme.colors.border};
											  `}
									`}
								>
									<Button
										fontSize="14px"
										fontWeight="bold"
										width="100%"
										color={activeTab === 'visited' ? 'primary' : 'textH4'}
										variant="text"
									>
										{t('feeds.visited').toUpperCase()}
									</Button>
								</Flex>
							),
						},
						{
							key: 'enriched',
							jsx: (
								<Flex
									width="100%"
									flexGrow={1}
									color={activeTab === 'enriched' ? 'primary' : 'textH4'}
									css={css`
										${activeTab === 'enriched'
											? css`
													border-bottom: 2px solid;
													border-color: inherit;
											  `
											: css`
													border-bottom: 1px solid;
													border-color: ${theme.colors.border};
											  `}
									`}
								>
									<Button
										fontSize="14px"
										fontWeight="bold"
										width="100%"
										color={activeTab === 'enriched' ? 'primary' : 'textH4'}
										variant="text"
									>
										{t('feeds.enriched').toUpperCase()}
									</Button>
								</Flex>
							),
						},
					]}
					setActiveTab={at => setActiveTab(at)}
					activeTab={activeTab}
				/>
			</Flex>

			<Feed />
		</Flex>
	);
};

export default HomepageFeeds;
