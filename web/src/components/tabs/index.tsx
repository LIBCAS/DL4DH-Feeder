import { Dispatch, SetStateAction } from 'react';

import { Flex } from 'components/styled';

type Props<T extends string> = {
	tabs: { jsx: JSX.Element; key: T }[];
	activeTab: T;
	setActiveTab: Dispatch<SetStateAction<T>>;
};

export const Tabs = <T extends string>({
	tabs,
	activeTab,
	setActiveTab,
}: Props<T>) => (
	<>
		{tabs.map((t, i) => (
			<Flex
				key={i}
				onClick={() => setActiveTab(t.key)}
				color={activeTab === t.key ? 'primary' : 'inactive'}
			>
				{t.jsx}
			</Flex>
		))}
	</>
);
export default Tabs;
