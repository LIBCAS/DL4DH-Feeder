import React, { FC } from 'react';

import Accordion from 'components/accordion';

import StatList, { StatItem } from './StatList';

type AccProps = {
	label: string | JSX.Element;
	isLoading?: boolean;
	storeKey?: string;
	items: StatItem[];
	updateFilter: (key: string) => void;
} & Partial<React.ComponentProps<typeof Accordion>> &
	Partial<React.ComponentProps<typeof StatList>>;

const AccordionFilter: FC<AccProps> = ({
	items,
	label,
	isLoading,
	storeKey,
	updateFilter,
	...props
}) => {
	return items.length > 0 ? (
		<Accordion
			{...props}
			label={label}
			isExpanded
			isLoading={isLoading}
			storeKey={storeKey}
		>
			{onRefresh => (
				<StatList
					{...props}
					items={items}
					onClick={updateFilter}
					refresh={onRefresh}
				/>
			)}
		</Accordion>
	) : (
		<></>
	);
};

export default AccordionFilter;
