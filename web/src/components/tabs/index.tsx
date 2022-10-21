/** @jsxImportSource @emotion/react */
import { ReactNode } from 'react';
import { css, SerializedStyles } from '@emotion/core';

import { Flex } from 'components/styled';

type Props<T extends string> = {
	tabs: { jsx: JSX.Element; key: T }[];
	activeTab: T;
	setActiveTab: (key: string) => void;
	tabsDivider?: ReactNode;
	wrapperCss?: SerializedStyles;
};

export const Tabs = <T extends string>({
	tabs,
	activeTab,
	setActiveTab,
	tabsDivider,
	wrapperCss,
}: Props<T>) => (
	<>
		{tabs.map((t, i) => (
			<Flex
				key={i}
				onClick={() => setActiveTab(t.key)}
				color={activeTab === t.key ? 'primary' : 'inactive'}
				css={
					wrapperCss
						? css`
								${wrapperCss}
						  `
						: css``
				}
			>
				{t.jsx}
				{i < tabs.length - 1 && tabsDivider ? tabsDivider : <></>}
			</Flex>
		))}
	</>
);
export default Tabs;
