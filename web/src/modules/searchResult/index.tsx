import { FC } from 'react';

import { useSearchContext } from 'hooks/useSearchContext';

import AdminReadingsOverview from './list';

const Results: FC = () => {
	const { content } = useSearchContext();

	return (
		<>
			<AdminReadingsOverview />
		</>
	);
};

export default Results;
